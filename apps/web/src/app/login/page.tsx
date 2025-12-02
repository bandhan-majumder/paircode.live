"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { authClient, signInWithGoogle } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default function LoginPage() {
	const { data: session, isPending } = authClient.useSession();

	if (session || session?.user) {
		return redirect("/");
	}
	
	const [isClicked, setIsClicked] = useState<boolean>(false);
	return (
		<div className="flex flex-col justify-center items-center h-screen">
			<div className="w-60 p-1 bg-primary/20 rounded-xl" onClick={() => {
				setIsClicked(true);
				signInWithGoogle();
			}}
			>
				<Button className="flex flex-row gap-6 w-full h-full cursor-pointer" disabled={isClicked} variant={"ghost"}>
					<Image src={"/google.svg"} width={40} height={40} alt="" />
					<div className="flex justify-center items-center flex-col">
						<p className="font-bold text-xl">{!isClicked ? 'Sign In' : 'Signing in...'}</p>
					</div>
				</Button>
			</div>
		</div>
	)
}
