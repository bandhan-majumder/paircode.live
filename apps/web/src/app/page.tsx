import ActionButtons from "@/components/action-buttons";
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
				<p className='text-center text-4xl font-bold text-balance'>Do pair programming, on a video call.</p>
				<ActionButtons showGithub />

				<section className="px-4 my-30">
					<div className="container mx-auto max-w-6xl">
						<div className="relative overflow-hidden rounded-2xl border border-border shadow-2xl">
							<Image src="/demo-web.gif" width={1200} height={675} alt="PairCode VSCode Extension Demo" className="w-full" />
						</div>
					</div>
				</section>

				<div className="mt-10">
					<p className='text-5xl font-bold text-balance text-center'>Join the community</p>
					<p className='text-xl text-muted-foreground text-center mt-5'>Discover what our community has to say about their experience.</p>
				</div>

				<FeedbackCarousel />

				<div className="my-40">
					<p className='text-center text-4xl font-bold text-balance'><span className="text-[#898989]">Fix Issues, Change Lines -</span> Collaboratively</p>
					<ActionButtons />
				</div>
				<Footer />
			</div>
		</div>
	);
}
