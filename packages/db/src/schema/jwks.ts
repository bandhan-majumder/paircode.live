/**
 * This is unused for now. Maybe later we use it to enable jwt from better-auth itself.
 */
import { pgTable, text, timestamp} from "drizzle-orm/pg-core";

export const jwks = pgTable(
    "jwks",
    {
        id: text("id").primaryKey(),
        publicKey: text("public_key").notNull(),
        privateKey: text("private_key").notNull(),
        expiresAt: timestamp("expires_at"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    }
);