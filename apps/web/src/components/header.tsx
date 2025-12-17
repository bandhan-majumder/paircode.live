"use client";
import Link from "next/link";
import { Github, X } from "lucide-react";
import { useState } from "react";
import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";
import { Button } from "./ui/button";

export default function Header() {
	const [showBanner, setShowBanner] = useState(true);

	const links = [
		// { to: "/", label: "Home" },
	] as const;

	return (
		<div>
			{showBanner && (
				<div className="bg-[#3CB371]">
					<div className="container mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
						<div className="flex-1 flex items-center justify-center gap-2 text-white text-sm md:text-base">
							<span className="text-lg">📣</span>
							<span className="font-medium">
								VSCode extension is now live on marketplace!
							</span>
							<Link
								href="/vscode-extension"
								className="underline hover:no-underline font-semibold whitespace-nowrap"
							>
								Learn more →
							</Link>
						</div>
						<button
							onClick={() => setShowBanner(false)}
							className="text-white hover:bg-white/20 rounded p-1 transition-colors flex-shrink-0"
							aria-label="Close banner"
						>
							<X size={18} />
						</button>
					</div>
				</div>
			)}
			<div className="flex flex-row items-center justify-between px-2 py-1">
				<nav className="flex gap-4 text-lg">
					{links.map(({ to, label }) => {
						return (
							<Link key={to} href={to}>
								{label}
							</Link>
						);
					})}
				</nav>
				<div className="flex items-center gap-2">
					<ModeToggle />
					<UserMenu />
					<Button
						size="lg"
						variant="outline"
						className="group border-[#BD9267]/30 hover:border-[#BD9267] bg-transparent"
					>
						<Link target="blank" href={"https://github.com/bandhan-majumder/paircode.live"} className="flex justify-center items-center">
							<Github className="mr-2 h-5 w-5" />
							Give a ⭐</Link>
					</Button>
				</div>
			</div>
			<hr />
		</div>
	);
}