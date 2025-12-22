import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Download, Zap, Shield, Code2, ArrowRight, CheckCircle2, Play, Github } from "lucide-react"
import { FAQExtension } from "@/components/faq-extension"
import { Star } from "lucide-react"
import { StyledButton } from "@/components/styled-buttons"

export default function ExtensionPage() {
    return (
        <div className="min-h-screen relative bg-background">
            <div
                className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.1] text-foreground pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                        linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
                    backgroundSize: "64px 64px",
                }}
            />

            <section className="relative overflow-hidden px-4 sm:px-6 md:px-8 py-20 sm:py-24 md:py-32 lg:py-40">
                <div className="container mx-auto max-w-5xl relative z-10">
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-6 animate-fade-in-up">
                            <span className="inline-flex items-center gap-2 rounded-full border border-[#BD9267]/30 bg-[#BD9267]/10 px-4 py-1.5 text-sm font-medium text-[#BD9267] shadow-sm backdrop-blur-sm">
                                <Image src={"/vscode.svg"} width={20} height={20} alt="VSCode Icon" />
                                <span>Available on VS Marketplace</span>
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground text-balance mb-6">
                            Import Code to PairCode <br className="hidden sm:block" />
                            <span className="bg-gradient-to-r from-[#BD9267] to-[#e6b98a] bg-clip-text text-transparent">
                                With One Click
                            </span>
                        </h1>

                        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground text-balance max-w-2xl mb-10">
                            Seamlessly transfer your code from VSCode to PairCode for instant real-time collaboration.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 justify-center">
                            <StyledButton text="" variant="dark" className="w-full sm:w-auto min-w-[200px]" url="https://marketplace.visualstudio.com/items?itemName=BandhanMajumder.paircode">
                                <div className="flex items-center justify-center gap-2 text-nowrap">
                                    <Download className="h-5 w-5" />
                                    <span>Install Extension</span>
                                </div>
                            </StyledButton>
                            <StyledButton text="" variant="default" url="https://github.com/bandhan-majumder/paircode.ext" className="w-full sm:w-auto min-w-[200px]">
                                <div className="flex justify-center items-center gap-2 text-nowrap">
                                    <Github className="h-5 w-5" />
                                    <span>Star on GitHub</span>
                                </div>
                            </StyledButton>
                        </div>
                    </div>
                </div>
            </section>

            <section className="px-0 sm:px-4 mt-8 sm:mt-10 md:mt-12">
                <div className="container mx-auto max-w-6xl">
                    <div className="relative overflow-hidden rounded-none sm:rounded-2xl border-0 sm:border border-border shadow-2xl">
                        <Image src="/demo-ext.gif" width={1200} height={675} alt="PairCode VSCode Extension Demo" className="w-full" />
                    </div>
                </div>
            </section>

            <section className="px-4 py-12 sm:py-16 md:py-24 md:mt-10">
                <div className="container mx-auto max-w-6xl">
                    <div className="mb-12 sm:mb-16 text-center">
                        <h2 className="mb-4 text-3xl sm:text-4xl text-balance text-center px-4">
                            Why use PairCode extension?
                        </h2>
                        <p className="text-base sm:text-lg md:text-xl text-muted-foreground text-center px-4">
                            Built for developers who value speed, security, and simplicity
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <Card className="group border-border/50 p-6 transition-all hover:border-[#BD9267]/50 hover:shadow-lg">
                            <div className="flex gap-2">
                                <Zap className="h-6 w-6" />
                                <p className="mb-2 text-lg font-semibold">Lightning Fast</p>
                            </div>

                            <div>
                                <p className="text-black dark:text-white">Import code instantly with a single click.</p>
                                <p className="text-[#858585] mt-1">
                                    No copying, pasting, or manual transfers needed. Just right click on the file and import directly to PairCode.
                                </p>
                            </div>
                        </Card>

                        <Card className="group border-border/50 p-6 transition-all hover:border-[#BD9267]/50 hover:shadow-lg">
                            <div className="flex gap-2">
                                <Shield className="h-6 w-6" />
                                <p className="mb-2 text-lg font-semibold">Secure & Private</p>
                            </div>
                            <div>
                                <p className="text-black dark:text-white">We never store your code in our db.</p>
                                <p className="text-[#858585] mt-1">
                                    Your code is never stored on our servers. We respect your privacy and we ask for permission every time before importing.
                                </p>
                            </div>
                        </Card>

                        <Card className="group border-border/50 p-6 transition-all hover:border-[#BD9267]/50 hover:shadow-lg">
                            <div className="flex gap-2">
                                <Code2 className="h-6 w-6" />
                                <p className="mb-2 text-lg font-semibold">Smart Transfer</p>
                            </div>
                            <div>
                                <p className="text-black dark:text-white">Support for large and small files</p>
                                <p className="text-[#858585] mt-1">
                                    Automatically handles small and large files with optimized transfer methods for the best experience.
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            <section className="bg-muted/30 px-4 py-12 sm:py-12 md:py-10 rounded-2xl">
                <div className="container mx-auto max-w-5xl">
                    <div className="mb-12 sm:mb-16 text-center">
                        <h2 className="tmb-4 text-3xl sm:text-4xl text-balance text-center px-4">How to get started?</h2>
                        <p className="text-base sm:text-lg md:text-xl text-muted-foreground text-center mt-5 px-4">Get started in three simple steps</p>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
                        <div className="relative">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#BD9267] text-2xl font-bold text-white">
                                1
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">Install Extension</h3>
                            <p className="text-muted-foreground">
                                Search for "PairCode" in VSCode extensions marketplace and click install
                            </p>
                        </div>

                        <div className="relative">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#BD9267] text-2xl font-bold text-white">
                                2
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">Right Click File</h3>
                            <p className="text-muted-foreground">
                                Select any file in your project, right-click, and choose "Open with PairCode"
                            </p>
                        </div>

                        <div className="relative">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#BD9267] text-2xl font-bold text-white">
                                3
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">Start Collaborating</h3>
                            <p className="text-muted-foreground">
                                Your code opens instantly in PairCode.live, ready for real-time collaboration
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="px-4 py-12 sm:py-16 md:py-24">
                <div className="container mx-auto max-w-4xl">
                    <div className="grid gap-12 md:grid-cols-2">
                        <div>
                            <h2 className="mb-6 text-2xl sm:text-3xl tracking-tight">Built for Modern Development</h2>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#BD9267]" />
                                    <span className="text-muted-foreground text-sm sm:text-base">
                                        <strong className="text-foreground">Permission-based:</strong> Always asks before importing your
                                        code
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#BD9267]" />
                                    <span className="text-muted-foreground text-sm sm:text-base">
                                        <strong className="text-foreground">No storage:</strong> We never save or store your code anywhere
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#BD9267]" />
                                    <span className="text-muted-foreground text-sm sm:text-base">
                                        <strong className="text-foreground">Smart handling:</strong> Optimized for both small and large
                                        files
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#BD9267]" />
                                    <span className="text-muted-foreground text-sm sm:text-base">
                                        <strong className="text-foreground">Open source:</strong> Available on GitHub for full transparency
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div className="flex flex-col justify-center">
                            <Card className="border-[#BD9267]/20 bg-gradient-to-br from-[#BD9267]/5 to-transparent p-6 sm:p-8">
                                <h3 className="mb-4 text-xl sm:text-2xl">Ready to get started?</h3>
                                <p className="mb-6 text-base sm:text-lg md:text-xl text-muted-foreground">
                                    Join developers who are already using PairCode to collaborate more effectively
                                </p>
                                <StyledButton text="" className="bg-[#BD9267] dark:bg-[#BD9267] w-full sm:w-auto" url="https://marketplace.visualstudio.com/items?itemName=BandhanMajumder.paircode">
                                    <div className="flex items-center justify-center text-nowrap">
                                        <Download className="mr-2 h-5 w-5" />
                                        <span>Download Now</span>
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </StyledButton>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-muted/30 px-4 py-12 sm:py-16 md:py-24 rounded-2xl">
                <div className="container mx-auto max-w-4xl">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl text-balance text-center px-4">Frequently Asked Questions</h2>
                        <p className="text-base sm:text-lg md:text-xl text-muted-foreground text-center mt-5 px-4">Everything you need to know about the PairCode extension</p>
                    </div>
                    <FAQExtension />
                </div>
            </section>
        </div>
    )
}