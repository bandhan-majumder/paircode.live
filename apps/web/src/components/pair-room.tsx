"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { PairRoomContent, type PairRoomProps } from "./pair-room-content";

export default function PairRoom({
    id,
    localAudioTrack,
    localVideoTrack,
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

    if (!session || isPending) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4"></div>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (!jwtToken) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4"></div>
                    <p>Authenticating...</p>
                </div>
            </div>
        );
    }

    return (
        <PairRoomContent
            id={id}
            localAudioTrack={localAudioTrack}
            localVideoTrack={localVideoTrack}
            token={jwtToken}
        />
    );
}