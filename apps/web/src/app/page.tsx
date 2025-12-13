import ActionButtons from "@/components/action-buttons";
import { ModeToggle } from "@/components/mode-toggle";
import UserMenu from "@/components/user-menu";
import { shadowsIntoLight } from "./layout";
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
		<div className="container mx-auto max-w-[85vw] px-4 py-6">
			<div className="flex flex-row justify-end gap-5">
				<ModeToggle />
				<UserMenu />
			</div>
			<pre className="overflow-x-auto font-mono text-sm text-[#BD9267] text-center">{TITLE_TEXT}</pre>
			<p className={`${shadowsIntoLight.className} text-center text-5xl dark:text-[#E5E7EB] text-black`}>Do pair programming, on a video call.</p>
			<ActionButtons />

			<div className="mt-10" style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}><iframe src="https://www.loom.com/embed/8b6df15c6b2445e1a60127266ac9cca5" frameBorder="0" width={500} className="p-20" style={{ borderRadius: '10px', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}></iframe></div>

			<div className="my-10">
				<p className={`${shadowsIntoLight.className} text-center text-5xl dark:text-[#E5E7EB] text-black`}>Join the community</p>
				<p className={`mt-5 text-center text-xl dark:text-[#7A7B7E] text-black`}>Discover what our community has to say about their experience.</p>
			</div>
			<FeedbackCarousel />

			<div className="my-40">
				<p className={`${shadowsIntoLight.className} text-center text-5xl dark:text-[#E5E7EB] text-black`}><span className="text-[#898989]">Fix Issues, Change Lines -</span> Collaboratively</p>
				<ActionButtons />
			</div>
			<Footer />
		</div>
	);
}
