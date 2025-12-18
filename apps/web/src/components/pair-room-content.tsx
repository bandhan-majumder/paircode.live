"use client";

import { useEffect, useRef, useState } from "react";
import CodeShare from "@/components/code-share";
import { DropdownMenuLanguageCheckboxes } from "@/components/lang-dropdown";
import { languageExtensions } from "@/lib/languageExtensions";
import { defaultCodeSnippets } from "@/lib/defaultCodeSnippets";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useSocketIO } from "@/hooks/use-websocket";
import { MicOff, VideoOff, Mic, Video, PhoneOff } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import axios from "axios";
import { toast } from "sonner";
import z from "zod";
import { useOutSourceCodeActionsStore } from "@/providers/outsource-source-provider";

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
        if (leaveRoom) {
            leaveRoom();
        }
        router.push("/");
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

    const { sendMessage, emitOffer, emitAnswer, emitIceCandidate, leaveRoom, isConnected } = useSocketIO({
        token,
        roomId: id,
        onMessageReceived: handleMessageReceived,
        onUserJoined: handleUserJoined,
        onUserLeft: () => { },
        onSendOffer: handleSendOffer,
        onOffer: handleOffer,
        onAnswer: handleAnswer,
        onIceCandidate: handleIceCandidate,
        onLobby: handleLobby,
    });

    const currentExtensions =
        selectedLanguage && languageExtensions[selectedLanguage]
            ? languageExtensions[selectedLanguage]
            : [];

    return (
        <div className="flex flex-col w-full h-screen">
            <div className="flex items-center justify-between p-4 border-b bg-background dark:bg-[#292929]">
                <div className="flex items-center gap-4">
                    <DropdownMenuLanguageCheckboxes
                        selectedLanguage={selectedLanguage}
                        onLanguageChange={handleLanguageChange}
                    />
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
                <div className="w-96 border-l p-4 flex flex-col gap-4 bg-background dark:bg-[#292929]">
                    <div>
                        <h3 className="font-semibold mb-2">Your Video</h3>
                        <video
                            style={{
                                borderRadius: '20px'
                            }}
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
                            Waiting for your friend to join...
                            <div className="flex gap-3 mt-5">
                                <Input
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    type="email"
                                    placeholder="friend@gmail.com"
                                />
                                <Button
                                    disabled={!inviteEmail || sentInvite}
                                    onClick={handleSendInvite}
                                >
                                    {sentInvite ? 'Inviting..' : 'Invite'}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h3 className="font-semibold mb-2">Friend's Video</h3>
                            <video
                                style={{ borderRadius: '20px' }}
                                ref={remoteVideoRef}
                                autoPlay
                                playsInline
                                className="w-full rounded bg-gray-900"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}