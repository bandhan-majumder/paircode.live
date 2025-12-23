"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
	const { setTheme, theme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon">
					<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
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
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
