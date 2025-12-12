import type {Metadata} from "next";
import { Geist, Geist_Mono, Raleway, Shadows_Into_Light } from "next/font/google";
import "../index.css";
import Providers from "@/components/providers";
import localFont from "next/font/local";

export const sekuyaFont = localFont({
	src: "../../public/font/Sekuya-Regular.ttf"
});

export const shadowsIntoLight = Shadows_Into_Light({
  subsets: ["latin"],
  variable: "--font-shadows-into-light",
  weight: "400",  
  display: "swap",
});

export const railwayFont = Raleway({
	variable: "--font-geist-sans",
	subsets: ["latin"],
})

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "paircode",
	description: "paircode",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Providers>
					<div className="grid grid-rows-[auto_1fr] h-svh">
						{children}
					</div>
				</Providers>
			</body>
		</html>
	);
}
