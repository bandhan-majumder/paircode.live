"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { authClient, signInWithGoogle } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isClicked, setIsClicked] = useState(false);

  // useEffect(() => {
  //   if (!isPending && session) {
  //     router.push("/");
  //   }
  // }, [session, isPending, router]);

  async function handleLogin() {
    if (isClicked) return;
    setIsClicked(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.log("Error signing in: ", error);
    }
  }

  return (
    <div className="h-screen flex flex-row justify-between">
      <div>
        asfd
      </div>
      <div>
        <Button
          onClick={handleLogin}
          disabled={isClicked}
          variant="ghost"
          className="flex flex-row gap-6 w-60 p-1 bg-primary/20 rounded-xl h-15"
        >
          <Image src="/google.svg" width={40} height={40} alt="Google" />
          <p className="font-bold text-xl">
            {isClicked ? "Signing in..." : "Sign In"}
          </p>
        </Button>
      </div>
    </div>
  );
}
