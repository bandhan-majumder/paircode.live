/**
 * see https://www.better-auth.com/docs/plugins/jwt page for more details
 */

import { betterAuth, type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@paircode/db";
import * as schema from "@paircode/db/schema/auth";

export const auth = betterAuth<BetterAuthOptions>({
	baseURL: "https://backend.paircode.live",
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
			domain: '.paircode.live',
		},
		useSecureCookies: true,
		defaultCookieAttributes: {
			sameSite: "none", 
			secure: true,
		}
	},
	// BETTER_AUTH_URL is set as baseURL
	trustedOrigins: [
		"https://paircode.live",
		"https://backend.paircode.live",
		...(process.env.NODE_ENV === 'development' ? ["http://localhost:3000", "http://localhost:3001"] : [])
	],
	session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
		freshAge: 60 * 5, // 5 minutes
		cookieCache: {
            enabled: true,
            maxAge: 5 * 60, // Cache duration in seconds (5 minutes)
			strategy: "compact"
        }
    }
});
