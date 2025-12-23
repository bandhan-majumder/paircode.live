"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import { Dot, LogOut } from "lucide-react"
import { authClient } from "@/lib/auth-client"

interface UserMenuProps {
  initialSession: any 
}

export default function UserMenu({ initialSession }: UserMenuProps) {
  const router = useRouter()
  const { setTheme, theme } = useTheme()

  if (!initialSession?.user) {
    return (
      <Button variant="outline" asChild>
        <Link href="/login">Sign In</Link>
      </Button>
    )
  }

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/")
        },
      },
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="mt-1">
          <Image 
            src={initialSession.user.image ?? "/user.svg"} 
            width={35} 
            height={35} 
            alt="User" 
            className="rounded-full bg-gray-400" 
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-card">
        <DropdownMenuLabel className="text-md">
          {initialSession.user.name}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-md">
          {initialSession.user.email}
        </DropdownMenuItem>
        <hr />
        <DropdownMenuLabel className="text-[#817878] text-sm">
          Theme
        </DropdownMenuLabel>
        <DropdownMenuItem
          className="pl-8 text-[#ADADAD] text-sm"
          onClick={() => setTheme("light")}
        >
          Light
          {theme === 'light' && (
            <div className="w-2 h-2 rounded-full bg-green-500" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="pl-8 text-[#ADADAD] text-sm"
          onClick={() => setTheme("dark")}
        >
          Dark
          {theme === 'dark' && (
            <div className="w-2 h-2 rounded-full bg-green-500" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="pl-8 text-[#ADADAD] text-sm"
          onClick={() => setTheme("system")}
        >
          System
          {theme === 'system' && (
            <div className="w-2 h-2 rounded-full bg-green-500" />
          )}
        </DropdownMenuItem>
        <hr />
        <DropdownMenuItem
          className="mt-2 text-[#ADADAD] text-sm cursor-pointer"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2" /> Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}