import type { auth } from "@paircode/auth";
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "https://paircode.live",
	plugins: [inferAdditionalFields<typeof auth>()],
	fetchOptions: {
		credentials: "include",
	},
});

export const signInWithGoogle = async () => {
	await authClient.signIn.social({
		provider: "google",
		callbackURL: "/",
	});
};