"use client";

import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/auth-client";

const TITLE_TEXT = `
 ██████╗  █████╗ ██╗██████╗      ██████╗ ██████╗ ██████╗ ███████╗
 ██╔══██╗██╔══██╗██║██╔══██╗    ██╔════╝██╔═══██╗██╔══██╗██╔════╝
 ██████╔╝███████║██║██████╔╝    ██║     ██║   ██║██║  ██║█████╗  
 ██╔═══╝ ██╔══██║██║██╔══██╗    ██║     ██║   ██║██║  ██║██╔══╝  
 ██║     ██║  ██║██║██║  ██║    ╚██████╗╚██████╔╝██████╔╝███████╗
 ╚═╝     ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝     ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝
                                                                   
 ██╗     ██╗██╗   ██╗███████╗                                     
 ██║     ██║██║   ██║██╔════╝                                     
 ██║     ██║██║   ██║█████╗                                       
 ██║     ██║╚██╗ ██╔╝██╔══╝                                       
 ███████╗██║ ╚████╔╝ ███████╗                                     
 ╚══════╝╚═╝  ╚═══╝  ╚══════╝                                     
 `;

export default function Home() {
	return (
		<div className="container mx-auto max-w-3xl px-4 py-2">
			<Button className="text-white" onClick={signInWithGoogle}>click</Button>
			<pre className="overflow-x-auto font-mono text-sm">{TITLE_TEXT}</pre>
			<div className="grid gap-6">
				<section className="rounded-lg border p-4">
					<h2 className="mb-2 font-medium">API Status</h2>
				</section>
			</div>
		</div>
	);
}
