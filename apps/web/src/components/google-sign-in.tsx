"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { signInWithGoogle } from "@/lib/auth-client"
import { useSearchParams } from "next/navigation"

export function GoogleSignInButton() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || "/";
  const [isClicked, setIsClicked] = useState(false)

  async function handleLogin() {
    if (isClicked) return
    setIsClicked(true)
    try {
      await signInWithGoogle(redirectUrl)
    } catch (error) {
      console.error("Error signing in: ", error)
      setIsClicked(false)
    }
  }

  return (
    <Button
      onClick={handleLogin}
      disabled={isClicked}
      size="lg"
      className="w-full h-12 gap-3 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Image src="/google.svg" width={20} height={20} alt="Google" className="size-5" />
      {isClicked ? "Signing in..." : "Continue with Google"}
    </Button>
  )
}