import ActionButtons from "@/components/action-buttons";
import Footer from "@/components/footer";
import { FeedbackCarousel } from "@/components/feedback-carousel";
import Header from "@/components/header";
import Image from "next/image";

export const TITLE_TEXT = `
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
			<div
				className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.1] text-foreground pointer-events-none"
				style={{
					backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                        linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
					backgroundSize: "64px 64px",
				}}
			/>
			<Header />
			<div className="container mx-auto max-w-[85vw] px-4 pb-6">
				<div className="overflow-x-auto">
					<pre className="font-mono text-[0.45rem] sm:text-xs md:text-sm text-[#BD9267] text-center whitespace-pre inline-block min-w-full">{TITLE_TEXT}</pre>
				</div>
				<p className='text-center text-2xl sm:text-3xl md:text-4xl font-bold text-balance'>Do pair programming, on a video call.</p>
				<ActionButtons showGithub />

				<section className="my-30 -mx-4 sm:mx-0">
					<div className="w-full flex justify-center items-center flex-col">
						<div className="relative overflow-hidden sm:rounded-2xl border-y sm:border border-border shadow-2xl">
							<Image
								src="/demo-web.gif"
								width={1800}
								height={675}
								alt="PairCode VSCode Extension Demo"
								className="w-full h-auto"
							/>
						</div>
					</div>
				</section>

				<div className="mt-10">
					<p className='text-3xl sm:text-4xl md:text-5xl font-bold text-balance text-center'>Join the community</p>
					<p className='text-lg sm:text-xl text-muted-foreground text-center mt-5'>Discover what our community has to say about their experience.</p>
				</div>

				<FeedbackCarousel />

				<div className="my-40">
					<p className='text-center text-2xl sm:text-3xl md:text-4xl font-bold text-balance'><span className="text-[#898989]">Fix Issues, Change Lines -</span> Real Time, In a Video Call</p>
					<ActionButtons />
				</div>
			</div>
			<div className="container mx-auto w-full md:max-w-[85vw] px-4 pb-6">
				<Footer />
			</div>
		</div>
	);
}
