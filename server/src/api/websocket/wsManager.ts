import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import IORedis from "ioredis";

export class WSManager {
  private wss: WebSocketServer;
  private clients: Map<string, Set<WebSocket>> = new Map();
  private redisSubscriber: IORedis;

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server, path: "/ws" });
    this.redisSubscriber = new IORedis(process.env.REDIS_URL || "redis://localhost:6379");
    
    this.init();
    this.subscribeToJobUpdates();
  }

  private init() {
    this.wss.on("connection", (ws, req) => {
      // Very basic auth via query param for this example. 
      // In production, parse JWT or better-auth session cookie from req.headers.cookie.
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

  /**
   * Listens to Redis Pub/Sub for job updates from worker nodes 
   * and broadcasts them to the correct connected WebSocket clients.
   */
  private subscribeToJobUpdates() {
    this.redisSubscriber.subscribe("job:updates", (err) => {
      if (err) console.error("Redis Pub/Sub error:", err);
    });

    this.redisSubscriber.on("message", (channel, message) => {
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

  /**
   * Helper to publish a job update from ANY Node.js process (e.g. Worker)
   */
  static async publishJobUpdate(projectId: string, jobId: string, status: string, progress: number) {
    const redisPublisher = new IORedis(process.env.REDIS_URL || "redis://localhost:6379");
    await redisPublisher.publish("job:updates", JSON.stringify({ projectId, jobId, status, progress }));
    redisPublisher.disconnect();
  }
}
