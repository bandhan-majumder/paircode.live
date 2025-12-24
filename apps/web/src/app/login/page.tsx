import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { GoogleSignInButton } from "@/components/google-sign-in"
import { auth } from "@paircode/auth"
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: 'Sign In - PairCode',
  description: 'Sign in to PairCode with Google authentication. Start collaborating on code with real-time video calls and direct VSCode import support.',
  keywords: ['sign in', 'login', 'authentication', 'Google OAuth', 'user login', 'PairCode login'],
  openGraph: {
    title: 'Sign In - PairCode',
    description: 'Sign in to PairCode with Google authentication. Start collaborating on code with real-time video calls and direct VSCode import support.',
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
    title: 'Sign In - PairCode',
    description: 'Sign in to PairCode with Google authentication. Start collaborating on code with real-time video calls and direct VSCode import support.',
    creator: '@paircode',
    images: 'https://cdn.jsdelivr.net/gh/bandhan-majumder/paircode.live@main/apps/web/public/paircode-ascii.svg'
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

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session) {
    redirect("/")
  }

  return (
    <div className="h-screen overflow-hidden bg-background">
      <main className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-border bg-card/50 dark:bg-card/80 backdrop-blur-sm p-8 shadow-2xl">
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-semibold tracking-tight">Welcome to PairCode</h2>
                <p className="text-sm text-muted-foreground">
                  Sign in to pair code. Supports direct import from{" "}
                  <span className="text-blue-400 font-extrabold underline decoration-wavy decoration-blue-700 underline-offset-4 hover:text-blue-300 transition-colors">
                    vscode
                  </span>
                </p>
              </div>

              <GoogleSignInButton />

              <p className="text-xs text-center text-muted-foreground leading-relaxed">
                By continuing, you agree to our{" "}
                <Link
                  href="/terms-and-services"
                  className="underline underline-offset-2"
                >
                  Terms of Service
                </Link>
              </p>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Have feedback? <Link href="/feedback" className="font-bold underline">Let us know</Link>
          </p>
        </div>
      </main>
    </div>
  )
}