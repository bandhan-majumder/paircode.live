import type { Metadata } from "next"
import { Suspense } from "react";
import { headers } from "next/headers";
import { auth } from "@paircode/auth";
import { redirect } from "next/navigation";
import OutsourceClient from "@/components/outsource-client";

export const metadata: Metadata = {
    title: 'Import Code - PairCode',
    description: 'Import your code from VSCode directly into PairCode for real-time collaboration. Secure, fast, and seamless code transfer.',
    keywords: ['import code', 'VSCode import', 'code transfer', 'upload code', 'code collaboration'],
    openGraph: {
        title: 'Import Code - PairCode',
        description: 'Import your code from VSCode directly into PairCode for real-time collaboration. Secure, fast, and seamless code transfer.',
        siteName: 'PairCode',
        images: [{
            url: 'https://cdn.jsdelivr.net/gh/bandhan-majumder/paircode.live@main/apps/web/public/paircode-ascii-dark.svg',
            width: '1200',
            height: '630'
        }],
        locale: 'en_US',
        type: "website"
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Import Code - PairCode',
        description: 'Import your code from VSCode directly into PairCode for real-time collaboration. Secure, fast, and seamless code transfer.',
        creator: '@paircode',
        images: 'https://cdn.jsdelivr.net/gh/bandhan-majumder/paircode.live@main/apps/web/public/paircode-ascii-dark.svg'
    },
    robots: {
        index: true,
        follow: true,
        nocache: true,
        googleBot: {
            index: true,
            follow: true,
            "max-snippet": -1,
            "max-video-preview": -1,
            "max-image-preview": "large"
        }
    }
}

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    const params = await searchParams;
    const source = params.source;
    const code = params.code;
    const language = params.language;

    let redirectUrl = '/outsource';
    if (source || code || language) {
        const queryParams = new URLSearchParams();
        if (source) queryParams.set('source', source);
        if (code) queryParams.set('code', code);
        if (language) queryParams.set('language', language);
        redirectUrl = `/outsource?${queryParams.toString()}`;
    }

    if (!session) {
        redirect(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
    }

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
