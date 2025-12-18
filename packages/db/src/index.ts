import dotenv from "dotenv";

if (process.env.NODE_ENV === "development") {
    dotenv.config({
        path: "../../apps/server/.env",
    });
}

import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

// To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch

neonConfig.poolQueryViaFetch = true

const sql = neon(process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/postgres");
export const db = drizzle(sql);
