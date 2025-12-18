import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Download, Zap, Shield, Code2, ArrowRight, CheckCircle2, Play, Github } from "lucide-react"
import { FAQExtension } from "@/components/faq-extension"
import { Star } from "lucide-react"
import { StyledButton } from "@/components/styled-buttons"

export default function ExtensionPage() {
    return (
        <div className="min-h-screen px-4 sm:px-6 md:px-8 lg:px-16 xl:px-40 pb-6 bg-[#F4F4F4] dark:bg-background">
            <section className="relative overflow-hidden px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 lg:py-32 rounded-2xl">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#BD9267]/30 bg-[#BD9267]/10 px-4 py-1.5 text-sm font-medium text-[#BD9267]">
                            Available on <Image src={"/vscode.svg"} width={25} height={25} alt="200" />
                        </div>
                        <div className="text-3xl sm:text-4xl md:text-5xl tracking-wide text-balance text-center px-4">
                            Import Code to PairCode
                        </div>
                        <div className="my-6 sm:my-8 md:my-10">
                            <span className="p-2 bg-[#BD9267] text-2xl sm:text-3xl md:text-4xl font-bold text-balance">
                                With One Click
                            </span>
                        </div>
                        <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-4">
                            Seamlessly transfer your code from VSCode to PairCode
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 mt-8 sm:mt-10 md:mt-15 w-full sm:w-auto px-4">
                            <StyledButton text="" variant="dark" className="w-full sm:w-auto" url="https://marketplace.visualstudio.com/items?itemName=BandhanMajumder.paircode">
                                <div className="flex items-center justify-center gap-1.5 text-nowrap">
                                    <Download className="h-5 w-5" />
                                    <span>Install Extension</span>
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </div>
                            </StyledButton>
                            <StyledButton text="" variant="default" url="https://marketplace.visualstudio.com/items?itemName=BandhanMajumder.paircode" className="w-full sm:w-auto">
                                <Link target="blank" href={"https://github.com/bandhan-majumder/paircode.ext"} className="flex justify-center items-center gap-1 text-nowrap">
                                    <Github className="h-5 w-5" />
                                    Give us a<Star className="fill-yellow-400 text-yellow-400" />
                                </Link>
                            </StyledButton>
                        </div>
                    </div>
                </div>
            </section>

            <section className="px-0 sm:px-4 mt-8 sm:mt-12 md:mt-16">
                <div className="container mx-auto max-w-6xl">
                    <div className="relative overflow-hidden rounded-none sm:rounded-2xl border-0 sm:border border-border shadow-2xl">
                        <Image src="/demo-ext.gif" width={1200} height={675} alt="PairCode VSCode Extension Demo" className="w-full" />
                    </div>
                </div>
            </section>

            <section className="px-4 py-12 sm:py-16 md:py-24">
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
                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#BD9267]/10 text-[#BD9267]">
                                <Zap className="h-6 w-6" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">Lightning Fast</h3>
                            <p className="text-muted-foreground">
                                Import code instantly with a single click. No copying, pasting, or manual transfers needed.
                            </p>
                        </Card>

                        <Card className="group border-border/50 p-6 transition-all hover:border-[#BD9267]/50 hover:shadow-lg">
                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#BD9267]/10 text-[#BD9267]">
                                <Shield className="h-6 w-6" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">Secure & Private</h3>
                            <p className="text-muted-foreground">
                                Your code is never stored on our servers. We respect your privacy and ask for permission every time.
                            </p>
                        </Card>

                        <Card className="group border-border/50 p-6 transition-all hover:border-[#BD9267]/50 hover:shadow-lg">
                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#BD9267]/10 text-[#BD9267]">
                                <Code2 className="h-6 w-6" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">Smart Transfer</h3>
                            <p className="text-muted-foreground">
                                Automatically handles small and large files with optimized transfer methods for the best experience.
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

            <section className="bg-muted/30 px-4 py-12 sm:py-16 md:py-24 rounded-2xl">
                <div className="container mx-auto max-w-5xl">
                    <div className="mb-12 sm:mb-16 text-center">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl text-balance text-center px-4">How to get started?</h2>
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