"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Video, Home, RotateCcw, Clock } from "lucide-react"

export default function CallEndedClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const roomId = searchParams.get("roomId")

  const [countdown, setCountdown] = useState(10)
  const [autoRedirect, setAutoRedirect] = useState(true)

  useEffect(() => {
    if (!autoRedirect) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push("/")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [autoRedirect, router])

  const handleRejoin = () => {
    if (roomId) {
      router.push(`/room/${roomId}`)
    }
  }

  const cancelAutoRedirect = () => {
    setAutoRedirect(false)
  }

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="w-full max-w-2xl space-y-8 text-center">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <div className="relative bg-primary/10 p-8 rounded-full">
              <Video className="w-16 h-16 text-primary" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight">
            You left the meeting
          </h1>
          <p className="text-muted-foreground text-lg">
            Thanks for joining! Hope you enjoyed your session.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          {roomId && (
            <Button
              size="lg"
              onClick={handleRejoin}
              className="w-full sm:w-auto gap-2 text-base font-medium"
            >
              <RotateCcw className="w-5 h-5" />
              Rejoin Meeting
            </Button>
          )}

          <Button
            size="lg"
            variant="outline"
            className=""
          >
            <Link href={"/"} className="flex w-full justify-center items-center sm:w-auto gap-2 text-base font-medium">
              <Home className="w-5 h-5" />
              Return to Home</Link>
          </Button>
        </div>

        {autoRedirect && (
          <div className="pt-6">
            <div className="inline-flex items-center gap-2 bg-muted/50 px-6 py-3 rounded-full text-sm text-muted-foreground border border-border/50">
              <Clock className="w-4 h-4" />
              <span>
                Redirecting to home in{" "}
                <span className="font-semibold text-foreground">{countdown}</span> seconds
              </span>
              <button
                onClick={cancelAutoRedirect}
                className="ml-2 text-primary hover:text-primary/80 font-medium underline underline-offset-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="pt-8 space-y-4">
          <div className="h-px bg-border w-32 mx-auto" />

          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              Had an issue?{" "}
              <Link
                href="/feedback"
                className="text-primary hover:text-primary/80 font-medium underline underline-offset-2"
              >
                Send feedback
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}