"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PairRoomContent, type PairRoomProps } from "./pair-room-content";
import { ConnectingLoader } from "./disconnect-loader";
import { trpc } from "@/lib/utils/trpc";
import { useMutation } from "@tanstack/react-query";

export default function PairRoom({
    id,
    localAudioTrack,
    localVideoTrack,
    isCreator,
    isShared, 
    onShared
}: PairRoomProps) {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();
    const [jwtToken, setJwtToken] = useState<string | null>(null);
    const getTokenMutation = useMutation(
        trpc.room.getSocketToken.mutationOptions({
            onSuccess: (result) => {
                if (result.token) {
                    setJwtToken(result.token);
                } else {
                    toast.error('Failed to retrieve authentication token. Please try again.');
                    router.push('/login');
                }
            },
            onError: (error) => {
                console.error('Failed to fetch JWT token:', error);
                toast.error('Failed to authenticate. Redirecting to login...');
                router.push('/login');
            }
        }),
    );

    useEffect(() => {
        if (!session && !isPending) {
            router.push("/login");
        }
    }, [session, isPending, router]);

    useEffect(() => {
        if (!isPending && session?.user && !jwtToken) {
            const fetchToken = async () => {
                try {
                    const result = await getTokenMutation.mutateAsync({ roomId: id });
                    
                    if (result.token) {
                        setJwtToken(result.token);
                    }
                } catch (error) {
                    console.error('Failed to fetch JWT token:', error);
                    toast.error('Failed to authenticate. Redirecting to login...');
                    router.push('/login');
                }
            };
            fetchToken();
        }
    }, [session, id, jwtToken, router, isPending]);

    if (!session || isPending || !jwtToken) {
        return <ConnectingLoader desc="Preparing PairCode session" />
    }

    return (
        <PairRoomContent
            id={id}
            isCreator={isCreator}
            isShared={isShared}
            onShared={onShared}
            localAudioTrack={localAudioTrack}
            localVideoTrack={localVideoTrack}
            token={jwtToken}
        />
    );
}