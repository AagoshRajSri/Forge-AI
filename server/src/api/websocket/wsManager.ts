import { WebSocketServer, WebSocket } from "ws";
import { Server, IncomingMessage } from "http";
import { Redis } from "ioredis";

export class WSManager {
  private wss: WebSocketServer;
  private clients: Map<string, Set<WebSocket>> = new Map();
  private redisSubscriber: Redis;

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server, path: "/ws" });
    // @ts-ignore - ioredis constructor can be finicky in ESM + TS
    this.redisSubscriber = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
    
    this.init();
    this.subscribeToJobUpdates();
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
    this.redisSubscriber.subscribe("job:updates", (err: any) => {
      if (err) console.error("Redis Pub/Sub error:", err);
    });

    this.redisSubscriber.on("message", (channel: string, message: string) => {
      if (channel === "job:updates") {
        try {
          const data = JSON.parse(message);
          const { projectId, jobId, status, progress } = data;
          
          this.broadcastToProject(projectId, "job:update", { jobId, status, progress });
        } catch (e) {
          console.error("Failed to parse pub/sub message", e);
        }
      }
    });
  }

  private broadcastToProject(projectId: string, event: string, payload: any) {
    const clients = this.clients.get(projectId);
    if (!clients) return;

    const message = JSON.stringify({ event, data: payload });
    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  }

  static async publishJobUpdate(projectId: string, jobId: string, status: string, progress: number) {
    // @ts-ignore
    const redisPublisher = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
    await redisPublisher.publish("job:updates", JSON.stringify({ projectId, jobId, status, progress }));
    redisPublisher.disconnect();
  }
}
