import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
}
// Force HTTP fetch for reliability
neonConfig.useFetch = true;
// Also provide WebSocket constructor in case it's needed for other parts
if (!neonConfig.webSocketConstructor) {
    neonConfig.webSocketConstructor = ws;
}
let pool;
function getPool() {
    if (!pool) {
        pool = new Pool({
            connectionString,
            max: 5, // Limit for serverless
            idleTimeoutMillis: 30000, // Close idle connections after 30s
            connectionTimeoutMillis: 5000, // Fail fast if can't connect
        });
        pool.on("error", (err) => {
            console.error("Unexpected Neon pool error:", err);
        });
    }
    return pool;
}
const adapter = new PrismaNeon(getPool());
const prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
});
export default prisma;
