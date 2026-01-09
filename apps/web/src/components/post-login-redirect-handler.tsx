"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

/**
 * Client component that checks sessionStorage for a post-login redirect URL.
 * This is used after OAuth login to redirect users back to where they came from.
 */
export default function PostLoginRedirectHandler() {
    const router = useRouter();
    const { data: session } = authClient.useSession();

    useEffect(() => {
        if (!session?.user) return;

        const redirectUrl = sessionStorage.getItem("postLoginRedirect");
        if (redirectUrl) {
            sessionStorage.removeItem("postLoginRedirect");
            router.push(redirectUrl as any);
        }
    }, [session, router]);
    
    return null;
}
