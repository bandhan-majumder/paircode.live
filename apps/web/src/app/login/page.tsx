"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { authClient, signInWithGoogle } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const [isClicked, setIsClicked] = useState(false)

  useEffect(() => {
    if (!isPending && session) {
      router.push("/", undefined)
    }
  }, [session, isPending, router])

  async function handleLogin() {
    if (isClicked) return
    setIsClicked(true)
    try {
      await signInWithGoogle()
    } catch (error) {
      console.log("Error signing in: ", error)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05] text-foreground"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                              linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <div className="max-w-4xl text-center space-y-6 mb-12">
          <div>
            <p className='text-center text-4xl font-bold text-balance'>Start your Pair Coding...</p>
            <p className={`mt-5 text-center text-3xl font-bold text-balance text-[#BD9267] tracking-wide`}>Create Rooms, directly from <span className="relative text-blue-400 font-extrabold underline decoration-wavy decoration-blue-700 underline-offset-4 group-hover:text-blue-300 transition-colors">
              vscode
            </span>{' '}!!</p>
          </div>
        </div>

        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-border bg-card/50 dark:bg-card/80 backdrop-blur-sm p-8 shadow-2xl">
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-semibold tracking-tight">Get started</h2>
                <p className="text-sm text-muted-foreground">Sign in to create your first debug room</p>
              </div>

              <Button
                onClick={handleLogin}
                disabled={isClicked}
                size="lg"
                className="w-full h-12 gap-3 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Image src="/google.svg" width={20} height={20} alt="Google" className="size-5" />
                {isClicked ? "Signing in..." : "Continue with Google"}
              </Button>

              <p className="text-xs text-center text-muted-foreground leading-relaxed">
                By continuing, you agree to our <Link href={"/terms-and-services"} className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:text-blue-700 dark:hover:text-blue-300">Terms of Service</Link>
              </p>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">Trusted by developers and interviewers</p>
        </div>
      </div>
    </div>
  );
}