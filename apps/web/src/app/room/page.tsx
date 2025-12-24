import type { Metadata } from "next"
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@paircode/auth";

export const metadata: Metadata = {
  title: 'Join Room - PairCode',
  description: 'Join a collaboration room on PairCode to start pair programming with your team in real-time.',
  keywords: ['collaboration room', 'join session', 'pair programming session', 'code room'],
  openGraph: {
    title: 'Join Room - PairCode',
    description: 'Join a collaboration room on PairCode to start pair programming with your team in real-time.',
    siteName: 'PairCode',
    images: [{
      url: 'https://cdn.jsdelivr.net/gh/bandhan-majumder/paircode.live@main/apps/web/public/paircode-ascii.svg',
      width: '1200',
      height: '630'
    }],
    locale: 'en_US',
    type: "website"
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Join Room - PairCode',
    description: 'Join a collaboration room on PairCode to start pair programming with your team in real-time.',
    creator: '@paircode',
    images: 'https://cdn.jsdelivr.net/gh/bandhan-majumder/paircode.live@main/apps/web/public/paircode-ascii.svg'
  },
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: false,
      follow: true,
      "max-snippet": -1,
      "max-video-preview": -1,
      "max-image-preview": "large"
    }
  }
}

async function Page() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || !session?.user || !session.user.id) {
    redirect("/login");
  }

  redirect("/");
}

export default Page