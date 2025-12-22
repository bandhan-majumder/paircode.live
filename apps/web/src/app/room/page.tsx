"use client";

import { authClient } from '@/lib/auth-client';
import { useRouter } from "next/navigation";
import { useEffect } from 'react';

function Page() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    useEffect(() => {
        if (!isPending && (!session || !session?.user || !session.user.id)) {
          router.push("/login");
        }
      }, [isPending, session, router]);
      
    router.push("/");
}

export default Page