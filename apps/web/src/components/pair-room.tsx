"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { PairRoomContent, type PairRoomProps } from "./pair-room-content";
import { ConnectingLoader } from "./disconnect-loader";

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

    useEffect(() => {
        if (!session && !isPending) {
            router.push("/login");
        }
    }, [session, isPending, router]);

    useEffect(() => {
        if (!isPending && session?.user && !jwtToken) {
            const fetchToken = async () => {
                try {
                    const response = await axios.post('/api/room/token', {
                        roomId: id
                    })

                    if (!response.data) {
                        throw new Error('Failed to fetch token');
                    }

                    const { token } = response.data;

                    if (token) {
                        setJwtToken(token);
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