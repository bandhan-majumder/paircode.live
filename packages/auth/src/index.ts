import { betterAuth, type BetterAuthOptions } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@paircode/db";
import * as schema from "@paircode/db/schema/auth";

export const auth = betterAuth<BetterAuthOptions>({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: schema,
	}),
	socialProviders: {
		google: {
			prompt: "select_account", 
			clientId: process.env.GOOGLE_CLIENT_ID || "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
		},
	},
	// advanced: {
	// 	defaultCookieAttributes: {
	// 		sameSite: "none",
	// 		secure: true,
	// 		httpOnly: true,
	// 	},
	// },
	trustedOrigins: ["https://paircode.live"],
	plugins: [nextCookies()],
});
