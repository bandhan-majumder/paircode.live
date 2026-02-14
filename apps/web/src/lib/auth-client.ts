import type { auth } from "@paircode/auth";
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { env } from '@paircode/env/web';

export const authClient = createAuthClient({
	baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL,
	plugins: [inferAdditionalFields<typeof auth>()],
	fetchOptions: {
		credentials: "include",
	},
});

export const signInWithGoogle = async (callbackURL?: string) => {
	await authClient.signIn.social({
		provider: "google",
		callbackURL: callbackURL || "/",
	});
};