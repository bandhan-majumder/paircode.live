"use client";

import { useEffect, useRef, useState } from "react";
import CodeShare from "@/components/code-share";
import { DropdownMenuLanguageCheckboxes } from "@/components/lang-dropdown";
import { languageExtensions } from "@/lib/languageExtensions";
import { defaultCodeSnippets } from "@/lib/defaultCodeSnippets";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useSocketIO } from "@/hooks/use-websocket";
import { MicOff, VideoOff, Mic, Video, PhoneOff, Info } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import z from "zod";
import { useOutSourceCodeActionsStore } from "@/providers/outsource-source-provider";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import peerConfiguration from "@/utils/webrtc/stun-server";
import { DisconnectingLoader } from "./disconnect-loader";
import { ShareRoomDialog } from "./share-room-dialog";
import { trpc } from "@/lib/utils/trpc";
import { useMutation } from "@tanstack/react-query";

export interface PairRoomProps {
    id: string;
    localAudioTrack: MediaStreamTrack | null;
    localVideoTrack: MediaStreamTrack | null;
    isCreator: boolean;
    isShared: boolean;
    onShared: any
}

export function PairRoomContent({
    id,
    localAudioTrack,
    localVideoTrack,
    token,
    isCreator,
    isShared,
    onShared
}: PairRoomProps & { token: string }) {
    const { data: session } = authClient.useSession();
    const router = useRouter();

    const {
        code: outSourcedCode,
        language: outSourcedLanguage,
        setCode: setOutSourcedCode,
        setLanguage: setOutSourcedLanguage
    } = useOutSourceCodeActionsStore((state) => state);

    const hasConsumedOutsourcedCode = useRef(false);
    const isFirstUserInRoom = useRef(true);

    const [selectedLanguage, setSelectedLanguage] = useState(() => {
        if (outSourcedCode && outSourcedLanguage) {
            return outSourcedLanguage;
        }
        return "py";
    });

    const selectedLanguageRef = useRef(selectedLanguage);

    const [code, setCode] = useState(() => {
        if (outSourcedCode) {
            return outSourcedCode;
        }
        return defaultCodeSnippets["py"];
    });

    const [lobby, setLobby] = useState(true);
    const [localMicOff, setLocalMicOff] = useState(false);
    const [localVidOff, setLocalVidOff] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [sentInvite, setSentInvite] = useState(false);

    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const pendingIceCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
    const hasRemoteDescriptionRef = useRef(false);

    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const localVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (!hasConsumedOutsourcedCode.current && (outSourcedCode || outSourcedLanguage)) {
            hasConsumedOutsourcedCode.current = true;

            const timeoutId = setTimeout(() => {
                setOutSourcedCode('');
                setOutSourcedLanguage('');
            }, 100);

            return () => clearTimeout(timeoutId);
        }
    }, [outSourcedCode, outSourcedLanguage, setOutSourcedCode, setOutSourcedLanguage]);

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

    const handleUserJoined = (socketId: string) => {
        // sync states of code and lang everytime a new user joins an existing user in the room
        if (isFirstUserInRoom.current) {
            sendMessage(JSON.stringify({
                code,
                language: selectedLanguageRef.current,
            }));
            isFirstUserInRoom.current = false;
        }
    };

    const createPeerConnection = (roomId: string, isCaller: boolean) => {
        // Clean up existing connection
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }

        // Reset state for new connection
        pendingIceCandidatesRef.current = [];
        hasRemoteDescriptionRef.current = false;

        const pc = new RTCPeerConnection(peerConfiguration);
        peerConnectionRef.current = pc;

        if (localVideoTrack) {
            pc.addTrack(localVideoTrack);
        }
        if (localAudioTrack) {
            pc.addTrack(localAudioTrack);
        }

        pc.onconnectionstatechange = () => {
            if (pc.connectionState === 'failed' || pc.connectionState === 'closed') {
                setLobby(true);
            }
        };

        pc.oniceconnectionstatechange = () => {
            // console.log("ICE connection state: ", pc.iceConnectionState);
        };

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
                    type: isCaller ? "sender" : "receiver",
                    roomId,
                });
            }
        };

        return pc;
    };

    const processPendingIceCandidates = async () => {
        const pc = peerConnectionRef.current;
        if (!pc || !hasRemoteDescriptionRef.current) return;

        const candidates = pendingIceCandidatesRef.current;
        pendingIceCandidatesRef.current = [];

        for (const candidate of candidates) {
            try {
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (error) {
                console.error("Error adding queued ICE candidate:", error);
            }
        }
    };

    const handleSendOffer = async ({ roomId }: { roomId: string }) => {
        setLobby(false);

        const pc = createPeerConnection(roomId, true);

        pc.onnegotiationneeded = async () => {
            try {
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                emitOffer({ sdp: offer, roomId });
            } catch (error) {
                console.error("Error creating offer:", error);
            }
        };
    };

    const handleReceivedOffer = async ({ roomId, sdp: remoteSdp }: { roomId: string; sdp: any }) => {
        setLobby(false);

        const pc = createPeerConnection(roomId, false);

        try {
            await pc.setRemoteDescription(new RTCSessionDescription(remoteSdp));
            hasRemoteDescriptionRef.current = true;

            // Process any ICE candidates that arrived before remote description was set
            await processPendingIceCandidates();

            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            emitAnswer({ roomId, sdp: answer });
        } catch (error) {
            console.error("Error handling received offer:", error);
        }
    };

    const handleAnswer = async ({ roomId, sdp: remoteSdp }: { roomId: string; sdp: RTCSessionDescriptionInit }) => {
        const pc = peerConnectionRef.current;
        if (!pc) {
            console.error("No peer connection when receiving answer");
            return;
        }

        try {
            await pc.setRemoteDescription(new RTCSessionDescription(remoteSdp));
            hasRemoteDescriptionRef.current = true;

            // Process any ICE candidates that arrived before remote description was set
            await processPendingIceCandidates();
        } catch (error) {
            console.error("Error setting remote description from answer:", error);
        }
    };

    const handleIceCandidate = async ({ candidate, type }: { candidate: any; type: "sender" | "receiver" }) => {
        const pc = peerConnectionRef.current;

        if (!pc) {
            console.warn("No peer connection available for ICE candidate");
            return;
        }

        // Queue ICE candidates if remote description hasn't been set yet
        if (!hasRemoteDescriptionRef.current) {
            pendingIceCandidatesRef.current.push(candidate);
            return;
        }

        try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
            console.error("Error adding ICE candidate:", error);
        }
    };

    const handleLobby = () => {
        setLobby(true);
    };

    const inviteMutation = useMutation(
        trpc.invite.send.mutationOptions({
            onSuccess: () => {
                toast.success('Email sent successfully!');
                setInviteEmail('');
                setSentInvite(false);
            },
            onError: (error) => {
                console.error("Failed to send invite:", error);
                toast.error('Apologize! Please copy the URL and send them manually.');
                setSentInvite(false);
            },
        })
    );

    const handleSendInvite = async () => {
        try {
            setSentInvite(true);
            if (!z.email().safeParse(inviteEmail).success) {
                toast.error('Please enter a valid email!');
                setSentInvite(false);
                return;
            }
            await inviteMutation.mutateAsync({
                receiverEmail: inviteEmail,
                roomId: id,
            });
        } catch (error) {
            // Error handled in mutation options
        }
    };

    const handleLeaveRoom = async () => {
        if (localAudioTrack) {
            localAudioTrack.stop();
        }

        if (localVideoTrack) {
            localVideoTrack.stop();
        }

        if (localVideoRef.current?.srcObject) {
            const stream = localVideoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            localVideoRef.current.srcObject = null;
        }

        if (remoteVideoRef.current?.srcObject) {
            const stream = remoteVideoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            remoteVideoRef.current.srcObject = null;
        }

        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }

        // Reset state
        pendingIceCandidatesRef.current = [];
        hasRemoteDescriptionRef.current = false;

        if (leaveRoom && id) {
            leaveRoom(id);
        }

        if (!isLeaveMutationPending && !isLeaveMutationErrror) {
            router.push(`/end-call?roomId=${id}`);
        } else {
            toast.error("Something went wrong. Please try again")
            router.push("/")
        }

    };

    const handleLanguageChange = (language: string) => {
        setSelectedLanguage(language);
        selectedLanguageRef.current = language;
        const newCode = defaultCodeSnippets[language] || "";
        setCode(newCode);
        if (sendMessage) {
            sendMessage(JSON.stringify({ language, code: newCode }));
        }
    };

    const handleCodeChange = (value: string) => {
        setCode(value);
        if (sendMessage) {
            sendMessage(
                JSON.stringify({
                    code: value,
                    language: selectedLanguageRef.current,
                })
            );
        }
    };

    const handleError = (error: { message: string }) => {
        if (error.message === "Room is full") {
            toast.error("Room is already full, please contact the person sent you the link");
            router.push('/');
        }
    }

    const { sendMessage, emitOffer, emitAnswer, emitIceCandidate, leaveRoom, isConnected, isLeaveMutationPending, isLeaveMutationErrror } = useSocketIO({
        token,
        roomId: id,
        onMessageReceived: handleMessageReceived,
        onUserJoined: handleUserJoined,
        onUserLeft: () => {
            // Clear remote video when user leaves
            if (remoteVideoRef.current?.srcObject) {
                const stream = remoteVideoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
                remoteVideoRef.current.srcObject = null;
            }

            // Close peer connection when other user leaves
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
                peerConnectionRef.current = null;
            }
            pendingIceCandidatesRef.current = [];
            hasRemoteDescriptionRef.current = false;

            setLobby(true);
            // code should always sync with the current state for new users, even if they leave and rejoin.
            isFirstUserInRoom.current = true;
        },
        onSendOffer: handleSendOffer,
        onOffer: handleReceivedOffer,
        onAnswer: handleAnswer,
        onIceCandidate: handleIceCandidate,
        onLobby: handleLobby,
        onError: handleError
    });

    const currentExtensions =
        selectedLanguage && languageExtensions[selectedLanguage]
            ? languageExtensions[selectedLanguage]
            : [];

    if (isLeaveMutationPending) {
        return <DisconnectingLoader />
    }

    return (
        <div className="flex flex-col w-full h-screen">
            <div className="flex items-center justify-between p-3 md:p-4 border-b bg-background dark:bg-[#292929]">
                <div className="flex items-center gap-2 md:gap-4">
                    <Tooltip>
                        <TooltipTrigger>
                            <Info size={15} />
                        </TooltipTrigger>
                        <TooltipContent className="w-[95vw] md:w-auto ml-2">
                            <p>Switching languages replaces present code with default template.</p>
                            <p>Use Ctrl+Z to restore your code.</p>
                            <p>However, the selected language might still be incorrect.</p>
                        </TooltipContent>
                    </Tooltip>
                    <DropdownMenuLanguageCheckboxes
                        selectedLanguage={selectedLanguage}
                        onLanguageChange={handleLanguageChange}
                    />
                </div>
                <div className="flex items-center gap-2 text-sm md:text-base">
                    <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="hidden sm:inline">{isConnected ? "Connected" : "Disconnected"}</span>
                </div>
            </div>

            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-l p-3 md:p-4 flex flex-col gap-3 md:gap-4 bg-background dark:bg-[#130303] md:order-2 overflow-y-auto md:overflow-y-visible">
                    {lobby ? (
                        <div className="p-2 md:p-4 text-center text-sm md:text-base">
                            {isCreator && <div className="absolute top-20 right-4 z-50">
                                <ShareRoomDialog
                                    roomId={id}
                                    isShared={isShared}
                                    onShared={onShared}
                                />
                            </div>}
                            <p className="mb-2 md:mb-4  md:mt-10">Invite your friend to join...</p>
                            <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                                <Input
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    type="email"
                                    placeholder="friend@gmail.com"
                                    className="text-sm"
                                />
                                <Button
                                    disabled={!inviteEmail || sentInvite}
                                    onClick={handleSendInvite}
                                    className="whitespace-nowrap text-sm"
                                >
                                    {sentInvite ? 'Inviting..' : 'Invite'}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h3 className="font-semibold mb-2 text-sm md:text-base">Friend's Video</h3>
                            <video
                                style={{
                                    borderRadius: '12px',
                                    maxHeight: '220px',
                                    objectFit: 'cover',
                                    width: '100%',
                                    aspectRatio: '4:3',
                                }}
                                ref={remoteVideoRef}
                                autoPlay
                                playsInline
                                className="w-full rounded md:max-h-none dark:border-2 dark:border-[#D1D5DC]"
                            />
                        </div>
                    )}

                    <div>
                        <h3 className="font-semibold mb-2 text-sm md:text-base">Your Video</h3>
                        <video
                            style={{
                                borderRadius: '12px',
                                maxHeight: '220px',
                                objectFit: 'cover',
                                width: '100%',
                                aspectRatio: '4:3',
                            }}
                            ref={localVideoRef}
                            autoPlay
                            muted
                            playsInline
                            className="w-full rounded md:max-h-none dark:border-2 dark:border-[#D1D5DC]"
                        />

                        <div className="flex flex-row gap-2 md:gap-3 justify-center items-center mt-2 md:mt-3">
                            <Tooltip>
                                <TooltipTrigger onClick={toggleMicrophone} className="p-2 md:p-3 rounded-full bg-gray-800 dark:bg-white transition-colors" aria-label={localMicOff ? "Turn on microphone" : "Turn off microphone"}>
                                    {localMicOff ? (
                                        <MicOff className="text-red-500" size={16} />
                                    ) : (
                                        <Mic className="text-white dark:text-black" size={16} />
                                    )}
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>on/off audio</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger onClick={toggleVideo}
                                    className="p-2 md:p-3 rounded-full bg-gray-800 dark:bg-white transition-colors"
                                    aria-label={localVidOff ? "Turn on video" : "Turn off video"}>
                                    {localVidOff ? (
                                        <VideoOff className="text-red-500" size={16} />
                                    ) : (
                                        <Video className="text-white dark:text-black" size={16} />
                                    )}
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>on/off video</p>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger onClick={handleLeaveRoom}
                                    className="p-2 md:p-3 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
                                    aria-label="Leave room">
                                    <PhoneOff className="text-white dark:text-black" size={16} />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>leave</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                </div>

                <div className="flex-1 md:order-1 h-[60vh] md:h-auto">
                    <CodeShare
                        code={code || ''}
                        onChange={handleCodeChange}
                        extensions={currentExtensions}
                    />
                </div>
            </div>
        </div >
    );
}