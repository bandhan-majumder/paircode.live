/**
 * see https://www.better-auth.com/docs/plugins/jwt page for more details
 */

import { betterAuth, type BetterAuthOptions } from "better-auth";
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
	advanced: {
		crossSubDomainCookies: {
			enabled: true,
			domain: 'backend.paircode.live',
		},
		useSecureCookies: true,
		defaultCookieAttributes: {
			sameSite: "none", 
			secure: true,
			httpOnly: true,
		}
	},
	// BETTER_AUTH_URL is set as baseURL
	trustedOrigins: [
		"https://paircode.live",
		"https://backend.paircode.live",
		...(process.env.NODE_ENV === 'development' ? ["http://localhost:3000", "http://localhost:3001"] : [])
	]
});
