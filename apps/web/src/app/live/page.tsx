import type { Metadata } from "next";
import { LivePageClient } from "@/components/live-page-client";
import { auth } from "@paircode/auth";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: 'Live Sessions - PairCode',
  description: 'Join live pair programming sessions happening right now on PairCode. Connect with developers and collaborate in real-time.',
  keywords: ['live sessions', 'pair programming', 'live coding', 'collaboration rooms', 'real-time coding'],
  openGraph: {
    title: 'Live Sessions - PairCode',
    description: 'Join live pair programming sessions happening right now on PairCode. Connect with developers and collaborate in real-time.',
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
    title: 'Live Sessions - PairCode',
    description: 'Join live pair programming sessions happening right now on PairCode. Connect with developers and collaborate in real-time.',
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

export default async function LivePage() {
  const session = await auth.api.getSession({
        headers: await headers()
    });

    return <LivePageClient initialSession={session} />;
}
