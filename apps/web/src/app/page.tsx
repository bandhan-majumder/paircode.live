import Hero from "@/components/hero";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import UserMenu from "@/components/user-menu";

const TITLE_TEXT = `
 ██████╗  █████╗ ██╗██████╗      ██████╗ ██████╗ ██████╗ ███████╗
 ██╔══██╗██╔══██╗██║██╔══██╗    ██╔════╝██╔═══██╗██╔══██╗██╔════╝
 ██████╔╝███████║██║██████╔╝    ██║     ██║   ██║██║  ██║█████╗  
 ██╔═══╝ ██╔══██║██║██╔══██╗    ██║     ██║   ██║██║  ██║██╔══╝  
 ██║     ██║  ██║██║██║  ██║    ╚██████╗╚██████╔╝██████╔╝███████╗
 ╚═╝     ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝     ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝
                                  
 `;

export default function Home() {
	return (
		<div className="container mx-auto max-w-[85vw] px-4 py-2">
			<div className="flex flex-row justify-end gap-5">
				<ModeToggle />
				<UserMenu />
			</div>
			<pre className="overflow-x-auto font-mono text-sm text-[#76C47C] text-center">{TITLE_TEXT}</pre>
			<p className="font-stretch-50% text-center font-semibold text-xl">Do pair programming, on a video call.</p>
			<Hero />
		</div>
	);
}
