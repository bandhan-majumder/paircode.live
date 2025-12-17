"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Dot, LogOut } from "lucide-react";

export default function UserMenu() {
	const router = useRouter();
	const { setTheme, theme } = useTheme();
	const { data: session, isPending } = authClient.useSession();

	if (isPending) {
		return <Skeleton className="h-9 w-24" />;
	}

	if (!session) {
		return (
			<Button variant="outline" asChild>
				<Link href="/login">Sign In</Link>
			</Button>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<div>
					<Button variant="ghost">
						<Image src={session.user.image ?? "/user.svg"} width={30} height={30} alt="User" className="rounded-full bg-gray-400" />
					</Button>
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="bg-card">
				<DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem>{session.user.email}</DropdownMenuItem>
				<hr />
				<DropdownMenuLabel className="text-[#817878]">Theme</DropdownMenuLabel>
				<DropdownMenuItem className="pl-8 text-[#ADADAD]" onClick={() => setTheme("light")}>
					Light
					{theme === 'light' && <Dot className="text-green-500" />}
				</DropdownMenuItem>
				<DropdownMenuItem className="pl-8 text-[#ADADAD]" onClick={() => setTheme("dark")}>
					Dark
					{theme === 'dark' && <Dot className="text-green-500" />}
				</DropdownMenuItem>
				<DropdownMenuItem className="pl-8 text-[#ADADAD]" onClick={() => setTheme("system")}>
					System
					{theme === 'system' && <Dot className="text-green-500" />}
				</DropdownMenuItem>
				<hr />
				<DropdownMenuItem className="mt-2 text-[#ADADAD]" asChild onClick={() => {
					authClient.signOut({
						fetchOptions: {
							onSuccess: () => {
								router.push("/");
							},
						},
					});
				}}>
					<div><LogOut /> Log Out</div>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
