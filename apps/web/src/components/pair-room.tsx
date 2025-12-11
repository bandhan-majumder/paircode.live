"use client";
import { useEffect, useRef, useState } from "react";
import CodeShare from "@/components/code-share";
import { DropdownMenuLanguageCheckboxes } from "@/components/lang-dropdown";
import { languageExtensions } from "@/lib/languageExtensions";
import { defaultCodeSnippets } from "@/lib/defaultCodeSnippets";
import { ShareRoomDialog } from "@/components/share-dialog";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useSocketIO } from "@/hooks/use-websocket";
import { MicOff, VideoOff, Mic, Video, PhoneOff } from "lucide-react";
import { Button } from "./ui/button";

export default function PairRoom({
    id,
    localAudioTrack,
    localVideoTrack,
}: {
    id: string;
    localAudioTrack: MediaStreamTrack | null;
    localVideoTrack: MediaStreamTrack | null;
}) {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

    const [selectedLanguage, setSelectedLanguage] = useState("python");
    const selectedLanguageRef = useRef(selectedLanguage);
    const [code, setCode] = useState(defaultCodeSnippets["python"]);
    const [lobby, setLobby] = useState(true);
    const [localMicOff, setLocalMicOff] = useState(false);
    const [localVidOff, setLocalVidOff] = useState(false);

    const sendingPcRef = useRef<RTCPeerConnection | null>(null);
    const receivingPcRef = useRef<RTCPeerConnection | null>(null);

    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const localVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (localVideoRef.current && localVideoTrack) {
            localVideoRef.current.srcObject = new MediaStream([localVideoTrack]);
        }
    }, [localVideoTrack]);

    useEffect(() => {
        selectedLanguageRef.current = selectedLanguage;
    }, [selectedLanguage]);

    const toggleMicrophone = () => {
        if (localAudioTrack) {
            const newState = !localMicOff;
            localAudioTrack.enabled = !newState;
            setLocalMicOff(newState);
        }
    };

    const toggleVideo = () => {
        if (localVideoTrack) {
            const newState = !localVidOff;
            localVideoTrack.enabled = !newState;
            setLocalVidOff(newState);
        }
    };

    const handleMessageReceived = (content: string) => {
        try {
            const data = JSON.parse(content);
            if (data.code !== undefined) {
                setCode(data.code);
            }
            if (data.language !== undefined) {
                setSelectedLanguage(data.language);
            }
        } catch (error) {
            console.error("Error parsing received message:", error);
        }
    };

    const handleSendOffer = async ({ roomId }: { roomId: string }) => {
        setLobby(false);
        const pc = new RTCPeerConnection();
        sendingPcRef.current = pc;

        if (localVideoTrack) {
            pc.addTrack(localVideoTrack);
        }
        if (localAudioTrack) {
            pc.addTrack(localAudioTrack);
        }

        pc.ontrack = (e) => {
            if (remoteVideoRef.current) {
                if (!remoteVideoRef.current.srcObject) {
                    remoteVideoRef.current.srcObject = new MediaStream();
                }
                (remoteVideoRef.current.srcObject as MediaStream).addTrack(e.track);
            }
        };

        pc.onicecandidate = (e) => {
            if (e.candidate) {
                emitIceCandidate({
                    candidate: e.candidate,
                    type: "sender",
                    roomId,
                });
            }
        };

        pc.onnegotiationneeded = async () => {
            const sdp = await pc.createOffer();
            await pc.setLocalDescription(sdp);
            emitOffer({ sdp, roomId });
        };
    };

    const handleOffer = async ({ roomId, sdp: remoteSdp }: { roomId: string; sdp: RTCSessionDescriptionInit }) => {
        setLobby(false);

        const pc = new RTCPeerConnection();
        receivingPcRef.current = pc;

        pc.ontrack = (e) => {
            if (remoteVideoRef.current) {
                if (!remoteVideoRef.current.srcObject) {
                    remoteVideoRef.current.srcObject = new MediaStream();
                }
                (remoteVideoRef.current.srcObject as MediaStream).addTrack(e.track);
            }
        };

        pc.onicecandidate = (e) => {
            if (e.candidate) {
                emitIceCandidate({
                    candidate: e.candidate,
                    type: "receiver",
                    roomId,
                });
            }
        };

        await pc.setRemoteDescription(remoteSdp);
        const sdp = await pc.createAnswer();
        await pc.setLocalDescription(sdp);

        emitAnswer({ roomId, sdp });
    };

    const handleAnswer = async ({ sdp: remoteSdp }: { roomId: string; sdp: RTCSessionDescriptionInit }) => {
        if (sendingPcRef.current) {
            await sendingPcRef.current.setRemoteDescription(remoteSdp);
        }
    };

    const handleIceCandidate = async ({ candidate, type }: { candidate: any; type: "sender" | "receiver" }) => {

        try {
            const iceCandidate = candidate instanceof RTCIceCandidate
                ? candidate
                : new RTCIceCandidate(candidate);

            if (type === "sender" && receivingPcRef.current) {
                await receivingPcRef.current.addIceCandidate(iceCandidate);
            } else if (type === "receiver" && sendingPcRef.current) {
                await sendingPcRef.current.addIceCandidate(iceCandidate);
            }
        } catch (error) {
            console.error("Error adding ICE candidate:", error);
        }
    };

    const handleLobby = () => {
        setLobby(true);
    };

    const { sendMessage, emitOffer, emitAnswer, emitIceCandidate, leaveRoom, isConnected } = useSocketIO({
        roomId: id,
        onMessageReceived: handleMessageReceived,
        onUserJoined: () => { },
        onUserLeft: () => { },
        onSendOffer: handleSendOffer,
        onOffer: handleOffer,
        onAnswer: handleAnswer,
        onIceCandidate: handleIceCandidate,
        onLobby: handleLobby,
    });

    // const cleanupConnections = () => {
    //     if (sendingPcRef.current) {
    //         sendingPcRef.current.close();
    //         sendingPcRef.current = null;
    //     }
    //     if (receivingPcRef.current) {
    //         receivingPcRef.current.close();
    //         receivingPcRef.current = null;
    //     }

    //     if (localAudioTrack) {
    //         localAudioTrack.stop();
    //     }
    //     if (localVideoTrack) {
    //         localVideoTrack.stop();
    //     }

    //     if (remoteVideoRef.current) {
    //         remoteVideoRef.current.srcObject = null;
    //     }
    //     if (localVideoRef.current) {
    //         localVideoRef.current.srcObject = null;
    //     }
    // };

    const handleLeaveRoom = () => {
        // cleanupConnections();
        leaveRoom();
        router.push("/");
    };

    useEffect(() => {
        return () => {
            // if (sendingPcRef.current) {
            //     sendingPcRef.current.close();
            // }
            // if (receivingPcRef.current) {
            //     receivingPcRef.current.close();
            // }

            // if (localAudioTrack) {
            //     localAudioTrack.stop();
            // }
            // if (localVideoTrack) {
            //     localVideoTrack.stop();
            // }
        };
    }, []);

    useEffect(() => {
        if (!session && !isPending) {
            router.push("/login");
        }
    }, [session, isPending, router]);

    if (!session) {
        return null;
    }

    const handleLanguageChange = (language: string) => {
        setSelectedLanguage(language);
        selectedLanguageRef.current = language;
        const newCode = defaultCodeSnippets[language] || "";
        setCode(newCode);
        sendMessage(JSON.stringify({ language, code: newCode }));
    };

    const handleCodeChange = (value: string) => {
        setCode(value);
        sendMessage(
            JSON.stringify({
                code: value,
                language: selectedLanguageRef.current ? selectedLanguageRef.current : undefined,
            })
        );
    };

    const currentExtensions =
        selectedLanguage && languageExtensions[selectedLanguage]
            ? languageExtensions[selectedLanguage]
            : [];

    return (
        <div className="flex flex-col w-full h-screen">
            <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-4">
                    <DropdownMenuLanguageCheckboxes
                        selectedLanguage={selectedLanguage}
                        onLanguageChange={handleLanguageChange}
                    />
                    {session && <ShareRoomDialog session={session} roomId={id} />}
                </div>
                <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                    {isConnected ? "Connected" : "Disconnected"}
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                <div className="flex-1">
                    <CodeShare
                        code={code || ''}
                        onChange={handleCodeChange}
                        extensions={currentExtensions}
                    />
                </div>
                <div className="w-96 border-l p-4 flex flex-col gap-4">
                    <div>
                        <h3 className="font-semibold mb-2">Your Video</h3>
                        <video
                            ref={localVideoRef}
                            autoPlay
                            muted
                            playsInline
                            className="w-full rounded bg-gray-900"
                        />
                        <div className="flex flex-row gap-3 justify-center items-center mt-5">
                            <Button
                                onClick={toggleMicrophone}
                                className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                                aria-label={localMicOff ? "Turn on microphone" : "Turn off microphone"}
                            >
                                {localMicOff ? (
                                    <MicOff className="text-red-500" size={20} />
                                ) : (
                                    <Mic className="text-white" size={20} />
                                )}
                            </Button>
                            <Button
                                onClick={toggleVideo}
                                className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                                aria-label={localVidOff ? "Turn on video" : "Turn off video"}
                            >
                                {localVidOff ? (
                                    <VideoOff className="text-red-500" size={20} />
                                ) : (
                                    <Video className="text-white" size={20} />
                                )}
                            </Button>
                            <Button
                                onClick={handleLeaveRoom}
                                className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
                                aria-label="Leave room"
                            >
                                <PhoneOff className="text-white" size={20} />
                            </Button>
                        </div>
                    </div>
                    {lobby ? (
                        <div className="p-4 text-center">
                            Waiting to connect you to someone...
                        </div>
                    ) : <div>
                        <h3 className="font-semibold mb-2">Friend's Video</h3>

                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className="w-full rounded bg-gray-900"
                        />
                    </div>}
                </div>
            </div>
        </div>
    );
}