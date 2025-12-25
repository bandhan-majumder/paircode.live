import type { Metadata } from "next"
import ActionButtons from "@/components/action-buttons";
import Footer from "@/components/footer";
import { FeedbackCarousel } from "@/components/feedback-carousel";
import NavBar from "@/components/navbar";
import Image from "next/image";
import HeroSection from "@/components/hero-section";

export const metadata: Metadata = {
	title: 'PairCode - Real-Time Code Collaboration with Video',
	description: 'Collaborate on code in real-time with video calling. Import code directly from VSCode, pair program with teammates, and fix issues together instantly.',
	keywords: ['pair programming', 'code collaboration', 'real-time coding', 'video call', 'VSCode extension', 'collaborative coding', 'remote pair programming', 'code review', 'live coding', 'developer tools'],
	openGraph: {
		title: 'PairCode - Real-Time Code Collaboration with Video',
		description: 'Collaborate on code in real-time with video calling. Import code directly from VSCode, pair program with teammates, and fix issues together instantly.',
		siteName: 'PairCode',
		images: [{
			url: 'https://cdn.jsdelivr.net/gh/bandhan-majumder/paircode.live@main/apps/web/public/paircode-ascii-dark.svg',
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
		images: 'https://cdn.jsdelivr.net/gh/bandhan-majumder/paircode.live@main/apps/web/public/paircode-ascii-dark.svg'
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
					"url": "https://cdn.jsdelivr.net/gh/bandhan-majumder/paircode.live@main/apps/web/public/paircode-ascii-dark.svg"
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
					"@id": "https://paircode.live/#organization"
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
				"softwareVersion": "1.0",
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
				<HeroSection />
				<ActionButtons showGithub />

				<section className="my-30 -mx-4 sm:mx-0">
					<div className="w-full flex justify-center items-center flex-col">
						<div className="relative overflow-hidden rounded-lg sm:rounded-2xl border border-border shadow-2xl">
							<video
								className="w-full md:max-w-[70vw] h-auto"
								autoPlay
								loop
								muted
								playsInline
								preload="metadata"
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
