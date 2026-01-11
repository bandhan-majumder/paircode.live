import type { Metadata } from "next"
import ActionButtons from "@/components/action-buttons";
import Footer from "@/components/footer";
import { FeedbackCarousel } from "@/components/feedback-carousel";
import NavBar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import HeroSectionMobile from "@/components/hero-section-mobile";
import PostLoginRedirectHandler from "@/components/post-login-redirect-handler";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const metadata: Metadata = {
	title: 'PairCode - Real-Time Code Collaboration with Video',
	description: 'Collaborate on code in real-time with video calling. Import code directly from VSCode, pair program with teammates, and fix issues together instantly.',
	keywords: ['pair programming', 'live programming', 'live pair programming', 'code collaboration', 'real-time coding', 'video call coding', 'PairCode VSCode extension', 'collaborative coding', 'remote pair programming', 'code review', 'live coding', 'developer tools'],
	openGraph: {
		title: 'PairCode - Real-Time Code Collaboration with Video',
		description: 'Collaborate on code in real-time with video calling. Import code directly from VSCode, pair program with teammates, and fix issues together instantly.',
		siteName: 'PairCode',
		images: [{
			url: 'https://qaqtvoxob8zyd7wl.public.blob.vercel-storage.com/pair.png',
			width: '1200',
			height: '630'
		}],
		locale: 'en_US',
		type: "website"
	},
	twitter: {
		card: 'summary_large_image',
		title: 'PairCode - Real-Time Code Collaboration with Video',
		description: 'Collaborate on code in real-time with video calling. Import code directly from VSCode, pair program with teammates, and fix issues together instantly.',
		creator: '@paircode',
		images: 'https://qaqtvoxob8zyd7wl.public.blob.vercel-storage.com/pair.png'
	},
	robots: {
		index: true,
		follow: true,
		nocache: true,
		googleBot: {
			index: true,
			follow: true,
			"max-snippet": -1,
			"max-video-preview": -1,
			"max-image-preview": "large"
		}
	},
	alternates: {
		canonical: 'https://paircode.live'
	}
}



export default function Home() {
	const structuredData = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "Organization",
				"@id": "https://paircode.live/#organization",
				"name": "PairCode",
				"url": "https://paircode.live",
				"logo": {
					"@type": "ImageObject",
					"url": "https://qaqtvoxob8zyd7wl.public.blob.vercel-storage.com/pair.png"
				},
				"description": "Real-time code collaboration platform with video calling and VSCode integration",
				"sameAs": [
					"https://github.com/bandhan-majumder/paircode.live",
					"https://marketplace.visualstudio.com/items?itemName=BandhanMajumder.paircode"
				]
			},
			{
				"@type": "WebSite",
				"@id": "https://paircode.live/#website",
				"url": "https://paircode.live",
				"name": "PairCode",
				"description": "Collaborate on code in real-time with video calling. Import code directly from VSCode, pair program with teammates, and fix issues together instantly.",
				"publisher": {
					"@id": "https://paircode.live"
				},
				"inLanguage": "en-US"
			},
			{
				"@type": "WebApplication",
				"name": "PairCode",
				"url": "https://paircode.live",
				"description": "Real-time code collaboration platform with integrated video calling",
				"applicationCategory": "DeveloperApplication",
				"operatingSystem": "Web Browser",
				"offers": {
					"@type": "Offer",
					"price": "0",
					"priceCurrency": "USD"
				},
				"featureList": [
					"Real-time code collaboration",
					"Integrated video calling",
					"VSCode extension integration",
					"One-click code import",
					"Secure and private"
				],
				"browserRequirements": "Requires JavaScript. Requires HTML5."
			},
			{
				"@type": "SoftwareApplication",
				"name": "PairCode VSCode Extension",
				"applicationCategory": "DeveloperApplication",
				"operatingSystem": "Windows, macOS, Linux",
				"offers": {
					"@type": "Offer",
					"price": "0",
					"priceCurrency": "USD"
				},
				"description": "Import code from VSCode to PairCode with a single click. Secure, fast, and private.",
				"url": "https://marketplace.visualstudio.com/items?itemName=BandhanMajumder.paircode",
				"downloadUrl": "https://marketplace.visualstudio.com/items?itemName=BandhanMajumder.paircode",
				"softwareVersion": "0.1.0",
				"featureList": [
					"One-click code import",
					"Permission-based transfers",
					"No code storage",
					"Smart file handling"
				]
			}
		]
	};

	return (
		<div>
			<PostLoginRedirectHandler />
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
			/>
			<div
				className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.1] text-foreground pointer-events-none"
				style={{
					backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                        linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
					backgroundSize: "64px 64px",
				}}
			/>
			<NavBar />
			<main className="container mx-auto w-[95vw] md:max-w-[85vw] px-4 pb-6">
				<div className="hidden md:block">
					<HeroSection />
				</div>
				<div className="md:hidden">
					<HeroSectionMobile />
				</div>
				<div className="text-center">
					<h1 className='text-center text-xl sm:text-2xl md:text-3xl font-bold text-balance'>Do pair programming, on a video call.</h1>
				</div>

				<ActionButtons showLive />

				<section className="my-20 md:mt-40 -mx-4 sm:mx-0">
					<div className="w-full flex justify-center items-center flex-col">
						<div className="relative overflow-hidden rounded-lg sm:rounded-2xl border border-[#DFDFDF] shadow-2xl p-2 dark:border-[#2E2E2E]">
							<div className="flex gap-3 ml-3 my-2">
								<div className="w-3 h-3 rounded-full bg-[#DFDFDF] dark:bg-[#2E2E2E]" />
								<div className="w-3 h-3 rounded-full bg-[#DFDFDF] dark:bg-[#2E2E2E]" />
								<div className="w-3 h-3 rounded-full bg-[#DFDFDF] dark:bg-[#2E2E2E]" />
							</div>
							<video
								className="mt-2 w-full md:max-w-[70vw] h-auto rounded-xl border border-[#DFDFDF] dark:border-[#2E2E2E]"
								autoPlay
								loop
								muted
								playsInline
								preload="metadata"
								poster="./demo-web.jpg"
							>
								<source
									src="https://qaqtvoxob8zyd7wl.public.blob.vercel-storage.com/demo-web.webm"
									type="video/webm"
								/>
								<source
									src="https://cdn.jsdelivr.net/gh/bandhan-majumder/paircode.live@main/apps/web/public/demo-web.webm"
									type="video/webm"
								/>
								<source
									src="https://cdn.jsdelivr.net/gh/bandhan-majumder/paircode.live@main/apps/web/public/demo-web.mp4"
									type="video/mp4"
								/>
								Your browser doesn't support video playback.
							</video>
						</div>
					</div>
				</section>

				<section className="mb-20 md:mb-32 px-4 sm:px-6 lg:px-10 xl:px-16">
					<div className="mx-auto max-w-6xl">
						<div className="flex flex-col xl:flex-row justify-between gap-8 xl:gap-12 items-center">

							<div className="text-center xl:text-left text-md sm:text-lg md:text-xl text-balance xl:max-w-md xl:shrink-0 tracking-tight">
								<div className="text-[#898989]">Use PairCode With</div>
								70+ languages
							</div>

							<div className="flex justify-center items-center w-full">
								<div className="flex flex-wrap justify-center gap-2 sm:gap-3 xl:flex-nowrap items-center max-w-4xl">
									<Image width={35} alt="JavaScript" src="https://cdn.jsdelivr.net/npm/programming-languages-logos/src/javascript/javascript.png" height={35} className="grayscale hover:grayscale-0 hover:drop-shadow-[0_0_12px_rgba(247,223,30,0.8)] transition-all duration-300 w-8 h-8 sm:w-10 sm:h-10" />
									<Image width={35} alt="TypeScript" src="https://cdn.jsdelivr.net/npm/programming-languages-logos/src/typescript/typescript.png" height={35} className="grayscale hover:grayscale-0 hover:drop-shadow-[0_0_12px_rgba(49,120,198,0.8)] transition-all duration-300 w-8 h-8 sm:w-10 sm:h-10" />
									<Image width={35} height={35} alt="C" src="https://cdn.jsdelivr.net/npm/programming-languages-logos/src/c/c.png" className="grayscale hover:grayscale-0 hover:drop-shadow-[0_0_12px_rgba(93,108,191,0.8)] transition-all duration-300 w-8 h-8 sm:w-10 sm:h-10" />
									<Image width={35} height={35} alt="C++" src="https://cdn.jsdelivr.net/npm/programming-languages-logos/src/cpp/cpp.png" className="grayscale hover:grayscale-0 hover:drop-shadow-[0_0_12px_rgba(0,149,221,0.8)] transition-all duration-300 w-8 h-8 sm:w-10 sm:h-10" />
									<Image width={35} height={35} alt="C#" src="https://cdn.jsdelivr.net/npm/programming-languages-logos/src/csharp/csharp.png" className="grayscale hover:grayscale-0 hover:drop-shadow-[0_0_12px_rgba(149,96,199,0.8)] transition-all duration-300 w-8 h-8 sm:w-10 sm:h-10" />
									<Image width={35} height={35} alt="CSS" src="https://cdn.jsdelivr.net/npm/programming-languages-logos/src/css/css.png" className="grayscale hover:grayscale-0 hover:drop-shadow-[0_0_12px_rgba(21,114,182,0.8)] transition-all duration-300 w-8 h-8 sm:w-10 sm:h-10" />
									<Image width={35} height={35} alt="Go" src="https://cdn.jsdelivr.net/npm/programming-languages-logos/src/go/go.png" className="grayscale hover:grayscale-0 hover:drop-shadow-[0_0_12px_rgba(0,173,216,0.8)] transition-all duration-300 w-8 h-8 sm:w-10 sm:h-10" />
									<Image width={35} height={35} alt="HTML" src="https://cdn.jsdelivr.net/npm/programming-languages-logos/src/html/html.png" className="grayscale hover:grayscale-0 hover:drop-shadow-[0_0_12px_rgba(227,79,38,0.8)] transition-all duration-300 w-8 h-8 sm:w-10 sm:h-10" />
									<Image width={35} height={35} alt="Java" src="https://cdn.jsdelivr.net/npm/programming-languages-logos/src/java/java.png" className="grayscale hover:grayscale-0 hover:drop-shadow-[0_0_12px_rgba(237,76,60,0.8)] transition-all duration-300 w-8 h-8 sm:w-10 sm:h-10" />
									<Image width={35} height={35} alt="Lua" src="https://cdn.jsdelivr.net/npm/programming-languages-logos/src/lua/lua.png" className="grayscale hover:grayscale-0 hover:drop-shadow-[0_0_12px_rgba(0,0,128,0.8)] transition-all duration-300 w-8 h-8 sm:w-10 sm:h-10" />
									<Image width={35} height={35} alt="PHP" src="https://cdn.jsdelivr.net/npm/programming-languages-logos/src/php/php.png" className="grayscale hover:grayscale-0 hover:drop-shadow-[0_0_12px_rgba(119,123,180,0.8)] transition-all duration-300 w-8 h-8 sm:w-10 sm:h-10" />
									<Image width={35} height={35} alt="Python" src="https://cdn.jsdelivr.net/npm/programming-languages-logos/src/python/python.png" className="grayscale hover:grayscale-0 hover:drop-shadow-[0_0_12px_rgba(55,118,171,0.8)] transition-all duration-300 w-8 h-8 sm:w-10 sm:h-10" />
									<Image width={35} height={35} alt="R" src="https://cdn.jsdelivr.net/npm/programming-languages-logos/src/r/r.png" className="grayscale hover:grayscale-0 hover:drop-shadow-[0_0_12px_rgba(25,140,219,0.8)] transition-all duration-300 w-8 h-8 sm:w-10 sm:h-10" />
									<Image width={35} height={35} alt="Ruby" src="https://cdn.jsdelivr.net/npm/programming-languages-logos/src/ruby/ruby.png" className="grayscale hover:grayscale-0 hover:drop-shadow-[0_0_12px_rgba(204,52,45,0.8)] transition-all duration-300 w-8 h-8 sm:w-10 sm:h-10" />
									<Image width={35} height={35} alt="Swift" src="https://cdn.jsdelivr.net/npm/programming-languages-logos/src/swift/swift.png" className="grayscale hover:grayscale-0 hover:drop-shadow-[0_0_12px_rgba(240,81,56,0.8)] transition-all duration-300 w-8 h-8 sm:w-10 sm:h-10" />
									<Tooltip>
										<TooltipTrigger>
											<div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-dashed border-muted-foreground/30 text-muted-foreground text-xs sm:text-sm font-medium hover:border-foreground/50 hover:text-foreground hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] transition-all duration-300">
												+58
											</div>
										</TooltipTrigger>
										<TooltipContent>
											<p className="text-sm">And 58+ more</p>
										</TooltipContent>
									</Tooltip>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="mt-10">
					<h2 className='text-3xl sm:text-4xl md:text-5xl tacking-wide text-balance text-center'>Join the community</h2>
					<p className='text-lg sm:text-xl text-muted-foreground text-center mt-5'>Discover what our community has to say about their experience.</p>
					<FeedbackCarousel />
				</section>

				<section className="my-30 md:my-40">
					<h2 className='text-center text-2xl sm:text-3xl md:text-4xl font-bold text-balance'><span className="text-[#898989]">Fix Issues, Change Lines -</span> Real Time, In a Video Call</h2>
					<ActionButtons />
				</section>
			</main>
			<div className="container mx-auto w-full md:max-w-[85vw] px-4 pb-6">
				<Footer />
			</div>
		</div>
	);
}
