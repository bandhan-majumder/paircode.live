import ActionButtons from "@/components/action-buttons";
import { ModeToggle } from "@/components/mode-toggle";
import UserMenu from "@/components/user-menu";
import { shadowsIntoLight } from "./layout";
import Footer from "@/components/footer";
import { FeedbackCarousel } from "@/components/feedback-carousel";
import Header from "@/components/header";
import Image from "next/image";

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
		<div>
			<Header />
			<div className="container mx-auto max-w-[85vw] px-4 pb-6">
				<pre className="overflow-x-auto font-mono text-sm text-[#BD9267] text-center">{TITLE_TEXT}</pre>
				<p className={`${shadowsIntoLight.className} text-center text-5xl dark:text-[#E5E7EB] text-black`}>Do pair programming, on a video call.</p>
				<ActionButtons />

				<section className="px-4 my-20">
					<div className="container mx-auto max-w-6xl">
						<div className="relative overflow-hidden rounded-2xl border border-border shadow-2xl">
							<Image src="/demo-web.gif" width={1200} height={675} alt="PairCode VSCode Extension Demo" className="w-full" />
						</div>
					</div>
				</section>

				<div className="my-10">
					<p className={`text-center text-5xl dark:text-[#E5E7EB] text-black`}>Join the community</p>
					<p className={`mt-5 text-center text-xl dark:text-[#7A7B7E] text-black tracking-tight`}>Discover what our community has to say about their experience.</p>
				</div>
				<FeedbackCarousel />

				<div className="my-40">
					<p className={`${shadowsIntoLight.className} text-center text-5xl dark:text-[#E5E7EB] text-black`}><span className="text-[#898989]">Fix Issues, Change Lines -</span> Collaboratively</p>
					<ActionButtons />
				</div>
				<Footer />
			</div>
		</div>
	);
}
