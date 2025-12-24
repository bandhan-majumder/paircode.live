import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import FeedbackForm from "../../components/feedback-form"

export const metadata: Metadata = {
  title: 'Send Feedback - PairCode',
  description: 'Share your thoughts and suggestions with us. Report bugs, request features, or provide general feedback to help us improve PairCode.',
  keywords: ['feedback', 'bug report', 'feature request', 'support', 'contact', 'suggestions', 'user feedback'],
  openGraph: {
    title: 'Send Feedback - PairCode',
    description: 'Share your thoughts and suggestions with us. Report bugs, request features, or provide general feedback to help us improve PairCode.',
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
    title: 'Send Feedback - PairCode',
    description: 'Share your thoughts and suggestions with us. Report bugs, request features, or provide general feedback to help us improve PairCode.',
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
  },
  alternates: {
    canonical: 'https://paircode.live/feedback'
  }
}

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-[#F4F4F4] dark:bg-background text-foreground">
      <header className="border-b border-border">
        <div className="container mx-auto max-w-2xl px-4 py-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              ← Back
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-[#BD9267]">Send Us Your Feedback</h1>
          <p className="text-muted-foreground mt-2">We value your thoughts and suggestions</p>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-4 py-12">
        <FeedbackForm />
      </main>
    </div>
  )
}