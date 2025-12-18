"use client";
import Link from "next/link"
import Image from "next/image"
import { Sparkles, ArrowRight, X } from "lucide-react"
import { useState } from "react";

export function AnnouncementBanner() {
    const [showBanner, setShowBanner] = useState(true);

    if (showBanner) {
        return (
            <div className="bg-gradient-to-r from-[#3CB371] via-[#2E8B57] to-[#3CB371] bg-[length:200%_auto] animate-gradient-slow relative overflow-hidden">
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </div>

                <div className="container mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-4 relative z-10">
                    <div className="flex-1 flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 sm:gap-3 text-white text-sm md:text-base">
                        <span className="inline-flex items-center justify-center">
                            <Image
                                src={"/vscode.svg"}
                                width={25}
                                height={25}
                                alt="VSCode"
                                className="animate-bounce-subtle"
                            />
                        </span>

                        <span className="font-semibold drop-shadow-sm">
                            VSCode extension is now live!
                        </span>

                        <Link
                            href="/vscode-extension"
                            className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 transition-all duration-300 font-semibold whitespace-nowrap shadow-lg hover:shadow-xl"
                        >
                            <span className="text-xs sm:text-sm">Know more</span>
                            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>

                    <button
                        onClick={() => setShowBanner(false)}
                        className="text-white hover:bg-white/20 rounded-full p-1.5 transition-all duration-200 flex-shrink-0 hover:rotate-90 hover:scale-110"
                        aria-label="Close banner"
                    >
                        <X size={18} />
                    </button>
                </div>

                <style jsx>{`
        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        
        @keyframes gradient-slow {
          0%, 100% {
            background-position: 0% center;
          }
          50% {
            background-position: 100% center;
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        
        .animate-gradient-slow {
          animation: gradient-slow 8s ease infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
            </div>
        )
    }
    return null;
}