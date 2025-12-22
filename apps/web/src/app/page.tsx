import ActionButtons from "@/components/action-buttons";
import Footer from "@/components/footer";
import { FeedbackCarousel } from "@/components/feedback-carousel";
import NavBar from "@/components/navbar";
import Image from "next/image";
import HeroSection from "@/components/hero-section";



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
			<NavBar />
			<div className="container mx-auto w-[95vw] md:max-w-[85vw] px-4 pb-6">
				<HeroSection />
				<ActionButtons showGithub />

				<section className="my-30 -mx-4 sm:mx-0">
					<div className="w-full flex justify-center items-center flex-col">
						<div className="relative overflow-hidden rounded-lg sm:rounded-2xl border border-border shadow-2xl">
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
					<p className='text-3xl sm:text-4xl md:text-5xl tacking-wide text-balance text-center'>Join the community</p>
					<p className='text-lg sm:text-xl text-muted-foreground text-center mt-5'>Discover what our community has to say about their experience.</p>
				</div>

				<FeedbackCarousel />

				<div className="my-30 md:my-40">
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
