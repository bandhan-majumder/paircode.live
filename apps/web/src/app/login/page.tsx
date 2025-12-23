import Link from "next/link"
import { redirect } from "next/navigation"
import { GoogleSignInButton } from "@/components/google-sign-in"
import { auth } from "@paircode/auth"
import { headers } from "next/headers";

export default async function LoginPage() {
  const session = await auth.api.getSession({
          headers: await headers()
      })
  
  if (session) {
    redirect("/")
  }

  return (
    <div className="h-screen overflow-hidden bg-background">
      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
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
      </div>
    </div>
  )
}