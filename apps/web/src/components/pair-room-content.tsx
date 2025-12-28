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
import axios from "axios";
import { toast } from "sonner";
import z from "zod";
import { useOutSourceCodeActionsStore } from "@/providers/outsource-source-provider";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export interface PairRoomProps {
    id: string;
    localAudioTrack: MediaStreamTrack | null;
    localVideoTrack: MediaStreamTrack | null;
}

export function PairRoomContent({
    id,
    localAudioTrack,
    localVideoTrack,
    token
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
        return "python";
    });

    const selectedLanguageRef = useRef(selectedLanguage);

    const [code, setCode] = useState(() => {
        if (outSourcedCode) {
            return outSourcedCode;
        }
        return defaultCodeSnippets["python"];
    });

    const [lobby, setLobby] = useState(true);
    const [localMicOff, setLocalMicOff] = useState(false);
    const [localVidOff, setLocalVidOff] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [sentInvite, setSentInvite] = useState(false);

    const sendingPcRef = useRef<RTCPeerConnection | null>(null);
    const receivingPcRef = useRef<RTCPeerConnection | null>(null);

    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const candidateQueue = useRef<{ candidate: any; type: "sender" | "receiver" }[]>([]);

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
        if (isFirstUserInRoom.current) {
            sendMessage(JSON.stringify({
                code,
                language: selectedLanguageRef.current,
            }));
            isFirstUserInRoom.current = false;
        }
    };

    const rtcConfig = {
        iceServers: [
            {
                urls: [
                    "stun:stun.l.google.com:19302",
                    "stun:stun1.l.google.com:19302",
                    "stun:stun2.l.google.com:19302",
                    "stun:stun3.l.google.com:19302",
                    "stun:stun4.l.google.com:19302",
                    "stun:stun.bsnl.co.in:3478",
                    "stun:stun.cloudflare.com:3478",
                    "stun:stun.voip.blackberry.com:3478",
                    "stun:stun.stunprotocol.org:3478",
                    "stun:stun.sipgate.net:3478",
                    "stun:stun.zoiper.com:3478",
                    "stun:stun.voipstunt.com:3478",
                    "stun:stun.voiparound.com:3478",
                    "stun:stun.voipbuster.com:3478",
                    "stun:stun.voipcheap.com:3478",
                    "stun:stun.voipraider.com:3478",
                    "stun:stun.ekiga.net:3478",
                ],
            },
        ],
    };

    const handleSendOffer = async ({ roomId }: { roomId: string }) => {
        setLobby(false);
        console.log("Creating sending PeerConnection");
        const pc = new RTCPeerConnection(rtcConfig);
        sendingPcRef.current = pc;

        if (localVideoTrack) {
            pc.addTrack(localVideoTrack);
        }
        if (localAudioTrack) {
            pc.addTrack(localAudioTrack);
        }

        pc.ontrack = (e) => {
            console.log("Receiving remote track in sending PC (unexpected but logged)");
            if (remoteVideoRef.current) {
                if (!remoteVideoRef.current.srcObject) {
                    remoteVideoRef.current.srcObject = new MediaStream();
                }
                (remoteVideoRef.current.srcObject as MediaStream).addTrack(e.track);
            }
        };

        pc.onicecandidate = (e) => {
            if (e.candidate) {
                console.log("Sending ICE candidate (sender):", e.candidate.candidate);
                emitIceCandidate({
                    candidate: e.candidate,
                    type: "sender",
                    roomId,
                });
            }
        };

        pc.oniceconnectionstatechange = () => {
            console.log("Sending PC ICE Connection State:", pc.iceConnectionState);
        };

        pc.onicegatheringstatechange = () => {
            console.log("Sending PC ICE Gathering State:", pc.iceGatheringState);
        };

        pc.onsignalingstatechange = () => {
            console.log("Sending PC Signaling State:", pc.signalingState);
        };

        pc.onnegotiationneeded = async () => {
            console.log("Negotiation needed");
            const sdp = await pc.createOffer();
            await pc.setLocalDescription();
            console.log("Set local description (offer)", sdp.type);
            emitOffer({ sdp, roomId });
        };
    };

    const handleOffer = async ({ roomId, sdp: remoteSdp }: { roomId: string; sdp: RTCSessionDescriptionInit }) => {
        setLobby(false);
        console.log("Received offer, creating receiving PeerConnection");

        const pc = new RTCPeerConnection(rtcConfig);
        receivingPcRef.current = pc;

        if (localVideoTrack) {
            pc.addTrack(localVideoTrack);
        }
        if (localAudioTrack) {
            pc.addTrack(localAudioTrack);
        }

        pc.ontrack = (e) => {
            console.log("Receiving remote track");
            if (remoteVideoRef.current) {
                if (!remoteVideoRef.current.srcObject) {
                    remoteVideoRef.current.srcObject = new MediaStream();
                }
                (remoteVideoRef.current.srcObject as MediaStream).addTrack(e.track);
            }
        };

        pc.onicecandidate = (e) => {
            if (e.candidate) {
                console.log("Sending ICE candidate (receiver):", e.candidate.candidate);
                emitIceCandidate({
                    candidate: e.candidate,
                    type: "receiver",
                    roomId,
                });
            }
        };

        pc.oniceconnectionstatechange = () => {
            console.log("Receiving PC ICE Connection State:", pc.iceConnectionState);
        };

        pc.onicegatheringstatechange = () => {
            console.log("Receiving PC ICE Gathering State:", pc.iceGatheringState);
        };

        pc.onsignalingstatechange = () => {
            console.log("Receiving PC Signaling State:", pc.signalingState);
        };

        await pc.setRemoteDescription(remoteSdp);
        console.log("Set remote description (offer)");
        const sdp = await pc.createAnswer();
        await pc.setLocalDescription(sdp);
        console.log("Set local description (answer)");

        emitAnswer({ roomId, sdp });

        const queuedCandidates = candidateQueue.current.filter(c => c.type === "sender");
        for (const c of queuedCandidates) {
            try {
                const iceCandidate = new RTCIceCandidate(c.candidate);
                await receivingPcRef.current.addIceCandidate(iceCandidate);
                console.log("Added queued candidate for receiver");
            } catch (e) {
                console.error("Error adding queued candidate:", e);
            }
        }
        candidateQueue.current = candidateQueue.current.filter(c => c.type !== "sender");
    };

    const handleAnswer = async ({ roomId, sdp: remoteSdp }: { roomId: string; sdp: RTCSessionDescriptionInit }) => {
        if (sendingPcRef.current) {
            await sendingPcRef.current.setRemoteDescription(remoteSdp);

            const queuedCandidates = candidateQueue.current.filter(c => c.type === "receiver");
            for (const c of queuedCandidates) {
                try {
                    const iceCandidate = new RTCIceCandidate(c.candidate);
                    await sendingPcRef.current.addIceCandidate(iceCandidate);
                    console.log("Added queued candidate for sender");
                } catch (e) {
                    console.error("Error adding queued candidate:", e);
                }
            }
            candidateQueue.current = candidateQueue.current.filter(c => c.type !== "receiver");
        }
    };

    const handleIceCandidate = async ({ candidate, type }: { candidate: any; type: "sender" | "receiver" }) => {
        console.log(`Received ICE candidate (${type}):`, candidate.candidate);
        try {
            const iceCandidate = candidate instanceof RTCIceCandidate
                ? candidate
                : new RTCIceCandidate(candidate);

            if (type === "sender") {
                if (receivingPcRef.current && receivingPcRef.current.remoteDescription) {
                    await receivingPcRef.current.addIceCandidate(iceCandidate);
                } else {
                    console.log("Queueing sender candidate (receiver PC not ready)");
                    candidateQueue.current.push({ candidate, type });
                }
            } else if (type === "receiver") {
                if (sendingPcRef.current && sendingPcRef.current.remoteDescription) {
                    await sendingPcRef.current.addIceCandidate(iceCandidate);
                } else {
                    console.log("Queueing receiver candidate (sender PC not ready)");
                    candidateQueue.current.push({ candidate, type });
                }
            }
        } catch (error) {
            console.error("Error adding ICE candidate:", error);
        }
    };

    const handleLobby = () => {
        setLobby(true);
    };

    const handleSendInvite = async () => {
        try {
            setSentInvite(true);
            if (!z.email().safeParse(inviteEmail).success) {
                toast.error('Please enter a valid email!');
                return;
            }
            await axios.post('/api/invite', {
                receiverEmail: inviteEmail,
                senderEmail: session?.user.email,
                roomId: id,
                senderName: session?.user.name
            });
            toast.success('Email sent successfully!');
        } catch (error) {
            console.error("Failed to send invite:", error);
            toast.error('Apologize! Please copy the URL and send them manually.');
        } finally {
            setInviteEmail('');
            setSentInvite(false);
        }
    };

    const handleLeaveRoom = () => {
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

        if (sendingPcRef.current) {
            sendingPcRef.current.close();
            sendingPcRef.current = null;
        }

        if (receivingPcRef.current) {
            receivingPcRef.current.close();
            receivingPcRef.current = null;
        }

        if (leaveRoom) {
            leaveRoom();
        }
        router.push(`/end-call?roomId=${id}`);
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

    const { sendMessage, emitOffer, emitAnswer, emitIceCandidate, leaveRoom, isConnected } = useSocketIO({
        token,
        roomId: id,
        onMessageReceived: handleMessageReceived,
        onUserJoined: handleUserJoined,
        onUserLeft: () => {
            setLobby(true);
        },
        onSendOffer: handleSendOffer,
        onOffer: handleOffer,
        onAnswer: handleAnswer,
        onIceCandidate: handleIceCandidate,
        onLobby: handleLobby,
        onError: handleError
    });

    const currentExtensions =
        selectedLanguage && languageExtensions[selectedLanguage]
            ? languageExtensions[selectedLanguage]
            : [];

    return (
        <div className="flex flex-col w-full h-screen">
            <div className="flex items-center justify-between p-3 md:p-4 border-b bg-background dark:bg-[#292929]">
                <div className="flex items-center gap-2 md:gap-4">
                    <Tooltip>
                        <TooltipTrigger>
                            <Info size={15} />
                        </TooltipTrigger>
                        <TooltipContent className="w-[95vw] md:w-auto ml-2">
                            <p>Switching languages replaces your code with a default template.</p>
                            <p>Pressing Ctrl+Z may restore your code.</p>
                            <p>However, the selected language might still be incorrect.</p>
                            <p>The change happens in real time for both you and your pair partner.</p>
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
                            <p className="mb-2 md:mb-4">Invite your friend to join...</p>
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
                                className="w-full rounded md:max-h-none"
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