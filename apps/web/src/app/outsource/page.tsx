import { Suspense } from "react";
import { headers } from "next/headers";
import { auth } from "@paircode/auth";
import OutsourceClient from "@/components/outsource-client";

export default async function Page() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-screen">
                <p>Loading...</p>
            </div>
        }>
            <OutsourceClient session={session} />
        </Suspense>
    );
}
