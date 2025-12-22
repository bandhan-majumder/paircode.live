import type { auth } from "@paircode/auth";
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
	baseURL: "http://paircode.live",
	plugins: [inferAdditionalFields<typeof auth>()],
});

export const signInWithGoogle = async () => {
	await authClient.signIn.social({
		provider: "google",
		callbackURL: "/",
	});
};