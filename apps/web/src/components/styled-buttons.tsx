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
  small: "h-10 px-4 text-sm sm:h-11 sm:px-5 sm:text-base lg:h-12 lg:px-6",
  default: "h-12 px-6 text-base sm:h-13 sm:px-7 sm:text-lg lg:h-16 lg:px-10 lg:text-xl",
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
    "relative inline-flex rounded-sm no-underline items-center justify-center border border-black transition-all duration-150 group-hover:-translate-x-1 group-hover:-translate-y-1 sm:group-hover:-translate-x-1.5 sm:group-hover:-translate-y-1.5 lg:group-hover:-translate-x-2 lg:group-hover:-translate-y-2 z-[3] w-full lg:w-auto font-semibold",
    sizeClasses[size],
    variantClasses[variant],
    className,
  )

  const content = (
    <div className="relative inline-block group w-full lg:w-auto">
      <div className="absolute inset-0 rounded-sm bg-yellow-400 border border-black transition-transform duration-150 z-[2]"></div>
      <div className="absolute inset-0 rounded-sm bg-red-500 border border-black transition-transform duration-150 group-hover:translate-x-1 group-hover:translate-y-1 sm:group-hover:translate-x-1.5 sm:group-hover:translate-y-1.5 lg:group-hover:translate-x-2 lg:group-hover:translate-y-2 z-[1]"></div>
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
