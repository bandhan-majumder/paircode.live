import { Suspense } from "react";
import OutsourceClient from "@/components/outsource-client";

export default function Page() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-screen">
                <p>Loading...</p>
            </div>
        }>
            <OutsourceClient />
        </Suspense>
    );
}
