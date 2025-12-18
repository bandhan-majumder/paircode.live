"use client"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { ReactElement } from "react"
import type { UrlObject } from "url"

type ButtonVariant = "light" | "dark" | "pink" | "default"
type ButtonSize = "small" | "default"

interface StyledButtonProps {
  text: string
  variant?: ButtonVariant
  size?: ButtonSize
  type?: "submit" | "button"
  url?: string
  className?: string
  onClick?: () => void
  children?: ReactElement
}

const variantClasses: Record<ButtonVariant, string> = {
  dark: "bg-black text-white dark:bg-white dark:text-black",
  light: "bg-white text-black",
  pink: "bg-pink-500 text-black",
  default: "bg-white dark:bg-gray-700 text-black dark:text-white"
}

const sizeClasses: Record<ButtonSize, string> = {
  small: "h-12 px-3 text-base lg:h-12 lg:px-6 lg:text-base",
  default: "h-14 px-8 text-xl lg:h-16 lg:px-10 lg:text-xl",
}

export function StyledButton({
  text,
  variant = "default",
  size = "default",
  type,
  url,
  className,
  onClick,
  children
}: StyledButtonProps) {
  const buttonClasses = cn(
    "relative inline-flex rounded-sm no-underline items-center justify-center border border-black transition-all duration-150 group-hover:-translate-x-2 group-hover:-translate-y-2 z-[3] w-full lg:w-auto font-semibold",
    sizeClasses[size],
    variantClasses[variant],
    className,
  )

  const content = (
    <div className="relative inline-block group">
      <div className="absolute inset-0 rounded-sm bg-yellow-400 border border-black transition-transform duration-150 z-[2]"></div>
      <div className="absolute inset-0 rounded-sm bg-red-500 border border-black transition-transform duration-150 group-hover:translate-x-2 group-hover:translate-y-2 z-[1]"></div>
      {type === "submit" || type === "button" ? (
        <button type={type} className={buttonClasses} onClick={onClick}>
          {children}
          {text}
        </button>
      ) : url ? (
        <Link href={url as unknown as UrlObject} className={buttonClasses}>
          {children}
          {text}
        </Link>
      ) : (
        <button type="button" className={buttonClasses} onClick={onClick}>
          {children}
          {text}
        </button>
      )}
    </div>
  )

  return content
}
