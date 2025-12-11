import Hero from "@/components/hero";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import UserMenu from "@/components/user-menu";
import { sekuyaFont, shadowsIntoLight } from "./layout";
import Footer from "@/components/footer";
import { FeedbackCarousel } from "@/components/feedback-carousel";

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
			<pre className="overflow-x-auto font-mono text-sm text-[#BD9267] text-center">{TITLE_TEXT}</pre>
			<p className={`${shadowsIntoLight.className} text-center text-5xl dark:text-[#E5E7EB] text-black`}>Do pair programming, on a video call.</p>
			<Hero />

			<div className="mt-20">
				<p className={`${shadowsIntoLight.className} text-center text-5xl dark:text-[#E5E7EB] text-black`}>Wall of Feedbacks : {')'}</p>
			<FeedbackCarousel />
			</div>
			<Footer />
		</div>
	);
}
