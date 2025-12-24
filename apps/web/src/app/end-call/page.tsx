import type { Metadata } from "next"
import { Suspense } from "react"
import CallEndedClient from "@/components/call-ended-client"

export const metadata: Metadata = {
  title: 'Call Ended - PairCode',
  description: 'Your collaboration session has ended. Thank you for using PairCode for pair programming.',
  keywords: ['call ended', 'session complete', 'session ended'],
  openGraph: {
    title: 'Call Ended - PairCode',
    description: 'Your collaboration session has ended. Thank you for using PairCode for pair programming.',
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
    title: 'Call Ended - PairCode',
    description: 'Your collaboration session has ended. Thank you for using PairCode for pair programming.',
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

export default function CallEndedPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <CallEndedClient />
    </Suspense>
  )
}