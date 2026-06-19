import { WebSocketServer, WebSocket } from "ws";
import { Server, IncomingMessage } from "http";
import { Redis } from "ioredis";

// Singleton instance — allows publishJobUpdate to broadcast directly in-process
let instance: WSManager | null = null;

function createRedis(url: string): Redis {
  const client = new Redis(url, {
    maxRetriesPerRequest: null,
    enableOfflineQueue: false, // Don't queue commands when disconnected
    retryStrategy: (times: number) => {
      if (times > 3) return null; // Give up, fall back to in-process broadcast
      return Math.min(times * 1000, 5000);
    },
  });
  // Suppress all ioredis error noise — retryStrategy handles reconnection
  client.on("error", () => {});
  return client;
}

export class WSManager {
  private wss: WebSocketServer;
  private clients: Map<string, Set<WebSocket>> = new Map();
  private redisSubscriber: Redis | null = null;

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server, path: "/ws" });
    instance = this;

    // Only attempt Redis if REDIS_URL is explicitly configured
    const redisUrl = process.env.REDIS_URL;
    if (redisUrl) {
      const subscriber = createRedis(redisUrl);
      subscriber.on("ready", () => {
        console.log("[Redis] Pub/Sub connected.");
        this.redisSubscriber = subscriber;
        this.subscribeToJobUpdates();
      });
    } else {
      console.log("[WS] No REDIS_URL — using in-process broadcast (single-process mode).");
    }

    this.init();
  }

  private init() {
    this.wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
      const url = new URL(req.url || "", `http://${req.headers.host}`);
      const projectId = url.searchParams.get("projectId");

      if (!projectId) {
        ws.close(1008, "Project ID required");
        return;
      }

      if (!this.clients.has(projectId)) {
        this.clients.set(projectId, new Set());
      }
      this.clients.get(projectId)?.add(ws);
      console.log(`[WS] Client connected to project: ${projectId}`);

      ws.on("close", () => {
        this.clients.get(projectId)?.delete(ws);
        if (this.clients.get(projectId)?.size === 0) {
          this.clients.delete(projectId);
        }
      });
    });
  }

  private subscribeToJobUpdates() {
    if (!this.redisSubscriber) return;

    this.redisSubscriber.subscribe("job:updates", (err: Error | null | undefined) => {
      if (err) console.error("[Redis] Subscribe error:", err.message);
    });

    this.redisSubscriber.on("message", (_channel: string, message: string) => {
      try {
        const { projectId, jobId, status, progress } = JSON.parse(message);
        this.broadcastToProject(projectId, "job:update", { jobId, status, progress });
      } catch (e) {
        console.error("[WS] Failed to parse pub/sub message:", e);
      }
    });
  }

  broadcastToProject(projectId: string, event: string, payload: unknown) {
    const clients = this.clients.get(projectId);
    if (!clients) return;

    const message = JSON.stringify({ event, data: payload });
    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  }

  static async publishJobUpdate(
    projectId: string,
    jobId: string,
    status: string,
    progress: number
  ) {
    const payload = { jobId, status, progress };

    // In-process broadcast (works in single-process / dev)
    if (instance) {
      instance.broadcastToProject(projectId, "job:update", payload);
    }

    // Also publish via Redis for multi-process / horizontal scaling
    const redisUrl = process.env.REDIS_URL;
    if (redisUrl) {
      const publisher = createRedis(redisUrl);
      try {
        await publisher.publish("job:updates", JSON.stringify({ projectId, ...payload }));
      } catch {
        // Redis publish failed — in-process broadcast above already handled it
      } finally {
        publisher.disconnect();
      }
    }
  }
}
