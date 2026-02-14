"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Users, Sparkles, Phone, ArrowLeft } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { CreateRoomDialog } from "@/components/create-room-dialog"
import type { Room } from "./live-room-types"
import Image from "next/image"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { trpcClient } from "@/lib/utils/trpc"

interface LivePageClientProps {
    initialSession: typeof authClient.$Infer.Session | null
}

interface PublicRoomsResponse {
    rooms: Room[]
    hasMore: boolean
}

const fetchPublicRooms = async ({ pageParam = 0 }): Promise<PublicRoomsResponse> => {
    const response = await trpcClient.live.getPublicRooms.query({ limit: 12, offset: pageParam });
    return response;
}

function RoomCard({ room }: { room: Room }) {
    const router = useRouter()
    const { data: session, isPending } = authClient.useSession()

    const handleJoin = async () => {
        if (!isPending && !session?.user) {
            router.push(`/login?redirect=/room/${room.id}`)
            return
        }
        router.push(`/room/${room.id}`)
    }

    return (
        <div className="group h-full">
            <div className="relative h-full overflow-hidden rounded-lg border border-border/50 bg-card">
                <div className="relative z-10 flex flex-col h-full p-6">
                    <div className="mb-6 flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg text-card-foreground line-clamp-2 text-balance leading-tight">
                                    {room.topic}
                                </h3>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    {room.members.length}/2
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex items-center justify-center py-8 min-h-24">
                        <div className="flex gap-3 items-center justify-center">
                            {room.members.length === 0 ? (
                                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                    <div className="h-16 w-16 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                                        <Users className="h-8 w-8" />
                                    </div>
                                    <span className="text-xs text-center">Waiting for users</span>
                                </div>
                            ) : (
                                room.members.map((member, index) => (
                                    <div
                                        key={member.id}
                                        className="relative flex-shrink-0"
                                        style={{
                                            marginLeft: index > 0 ? "-0.75rem" : "0",
                                            zIndex: room.members.length - index,
                                        }}
                                    >
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <div className=" rounded-full overflow-hidden bg-gradient-to-br from-primary to-accent shadow-lg">
                                                    {member.userImage ? (
                                                        <Image
                                                            width={60}
                                                            height={60}
                                                            src={member.userImage || "/placeholder.svg"}
                                                            alt={member.userName || member.userId}
                                                            className="h-16 w-16 object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-16 w-16 flex items-center justify-center bg-gradient-to-br from-primary/80 to-accent/80 text-primary-foreground font-semibold text-lg">
                                                            {(member.userName || member.userId).charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className="text-sm">{member.userName}</p>
                                            </TooltipContent>
                                        </Tooltip>

                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="mt-auto">
                        <Button
                            onClick={handleJoin}
                            disabled={room.isFull}
                            className="w-full group/btn relative overflow-hidden rounded-lg font-medium transition-all duration-300 bg-transparent border-2 border-dotted hover:bg-transparent hover:border-[#CAA885] cursor-pointer"
                            variant={room.isFull ? "outline" : "default"}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2 text-black dark:text-white">
                                {!room.isFull && (
                                    <Phone className="h-4 w-4 -rotate-90" />
                                )}
                                {room.isFull ? "🚫 Room is Full" : "Join and discuss"}
                            </span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function RoomCardSkeleton() {
    return (
        <div className="rounded-lg border border-border/50 bg-card p-6 space-y-4">
            <div className="space-y-2">
                <div className="h-5 w-full animate-pulse rounded-md bg-muted" />
                <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted" />
            </div>
            <div className="flex gap-2 justify-center py-8">
                <div className="h-16 w-16 animate-pulse rounded-full bg-muted" />
                <div className="h-16 w-16 animate-pulse rounded-full bg-muted" />
            </div>
            <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
        </div>
    )
}

function CreateRoomButton({ session }: { session: any }) {
    return (
        <div className="flex justify-center mb-12">
            {session ? (
                <CreateRoomDialog session={session} />
            ) : (
                <Button onClick={() => (window.location.href = "/login")} size="lg" className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    Create a Room
                </Button>
            )}
        </div>
    )
}

function PageHeader() {
    const router = useRouter()
    
    return (
        <div className="space-y-4 mb-12">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="mb-4 gap-2"
            >
                <ArrowLeft className="h-4 w-4" />
                Back
            </Button>
            <div className="text-center">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-balance leading-tight">Join Public Rooms</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Find public rooms, join for discussions
                </p>
            </div>
        </div>
    )
}

function EmptyState() {
    return (
        <div className="flex items-center justify-center py-24">
            <div className="text-center space-y-4">
                <div className="flex justify-center mb-4">
                    <div className="rounded-full bg-muted p-4">
                        <Users className="h-12 w-12 text-muted-foreground" />
                    </div>
                </div>
                <h3 className="text-2xl font-semibold">No active sessions</h3>
                <p className="text-muted-foreground max-w-xs mx-auto">
                    Be the first to start a public session and invite others to join you
                </p>
            </div>
        </div>
    )
}

function ErrorState() {
    return (
        <div className="flex items-center justify-center py-24">
            <div className="text-center space-y-4">
                <h2 className="text-2xl font-semibold">Failed to load rooms</h2>
                <p className="text-muted-foreground">Please try again later or contact support.</p>
            </div>
        </div>
    )
}

function LoadingState() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
                <RoomCardSkeleton key={i} />
            ))}
        </div>
    )
}

export function LivePageClient({ initialSession }: LivePageClientProps) {
    const observerTarget = useRef<HTMLDivElement>(null)

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useInfiniteQuery({
        queryKey: ["public-rooms"],
        queryFn: fetchPublicRooms,
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            if (lastPage.hasMore) {
                return lastPage.rooms.length
            }
            return undefined
        },
    })

    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const [target] = entries
            if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage()
            }
        },
        [hasNextPage, isFetchingNextPage, fetchNextPage],
    )

    useEffect(() => {
        const element = observerTarget.current
        const option = { threshold: 0 }
        const observer = new IntersectionObserver(handleObserver, option)

        if (element) observer.observe(element)
        return () => {
            if (element) observer.unobserve(element)
        }
    }, [handleObserver])

    if (error) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                    <ErrorState />
                </div>
            </div>
        )
    }

    const allRooms = data?.pages.flatMap((page) => page.rooms) || []

    return (
        <div className="min-h-screen bg-[#F4F4F4] dark:bg-[#0A0A0A]">
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-20" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl opacity-20" />
            </div>

            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <PageHeader />
                <CreateRoomButton session={initialSession} />

                {isLoading ? (
                    <LoadingState />
                ) : allRooms.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allRooms.map((room) => (
                            <RoomCard key={room.id} room={room} />
                        ))}
                    </div>
                )}

                {!isLoading && isFetchingNextPage && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                        {[...Array(3)].map((_, i) => (
                            <RoomCardSkeleton key={`skeleton-${i}`} />
                        ))}
                    </div>
                )}

                <div ref={observerTarget} className="h-8" />
            </div>
        </div>
    )
}