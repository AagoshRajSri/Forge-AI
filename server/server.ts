import express, { Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import userRouter from "./routes/userRoutes.js";
import projectRouter from "./routes/projectRoutes.js";
import { stripeWebHook } from "./controllers/stripeWebhook.js";
import { WSManager } from "./src/api/websocket/wsManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

const corsOption = {
  origin: process.env.TRUSTED_ORIGINS?.split(",").filter(Boolean) || [
    "http://localhost:5173",
    "http://localhost:3000",
  ],
  credentials: true,
};

app.use(cors(corsOption));
app.post(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  stripeWebHook
);

app.use(express.json({ limit: "50mb" }));

const authHandler = toNodeHandler(auth);

// Mount all auth routes — app.use is required for Express 5 compatibility
app.use("/api/auth", (req: Request, res: Response) => {
  return authHandler(req, res);
});

app.use("/api/user", userRouter);
app.use("/api/project", projectRouter);

// ── Health check ──────────────────────────────────────────────────
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// ── Production: serve client build + SPA fallback ─────────────────
if (process.env.NODE_ENV === "production") {
  const clientDir = path.join(__dirname, "../client/dist");
  app.use(express.static(clientDir));
  app.get("/{*splat}", (_req: Request, res: Response) => {
    res.sendFile(path.join(clientDir, "index.html"));
  });
} else {
  app.get("/", (_req: Request, res: Response) => {
    res.send("Server is Live!");
  });
}

const server = app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});

// Initialize WebSocket Server
new WSManager(server);
