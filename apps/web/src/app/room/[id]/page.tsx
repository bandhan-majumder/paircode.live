"use client";

import { use, useEffect, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import PairRoomJoinHandler from "@/components/room-join-handler";

type Props = {
  params: Promise<{ id: string }>;
};

export default function CodeArena({ params }: Props) {
  const { id: roomId } = use(params);
  const { data: session, isPending } = authClient.useSession();
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [showJoinButton, setShowJoinButton] = useState<boolean>(false);
  const [localAudioTrack, setLocalAudioTrack] = useState<MediaStreamTrack | null>(null);
  const [localVideoTrack, setlocalVideoTrack] = useState<MediaStreamTrack | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isPending && (!session || !session?.user || !session.user.id)) {
      router.push(`/login?redirect=/room/${roomId}`);
    }
  }, [isPending, session, router, roomId]);

  useEffect(() => {
    if (!isPending && session?.user) {
      getCameraMicPermissions();
    }
  }, [isPending, session]);

  const getCameraMicPermissions = async () => {
    try {
      // List all the devices
      
      // navigator.mediaDevices.enumerateDevices().then((data) => {
      //   console.log("the data is: ", data)
      // }).catch(()=> {
      //   console.error('error')
      // })
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // Feature: Add filters. For more info:https://youtu.be/-Uons2hxonI

      const audioTrack = stream.getAudioTracks()[0];
      const videoTrack = stream.getVideoTracks()[0];

      setLocalAudioTrack(audioTrack);
      setlocalVideoTrack(videoTrack);

      if (!videoRef.current) return;

      const videoElement = videoRef.current;
      videoElement.srcObject = new MediaStream([videoTrack]);

      videoElement.muted = true;

      videoElement.onloadedmetadata = () => {
        videoElement.play().catch(err => {
          console.error("Play failed:", err);
        });
      };
      
      setShowJoinButton(true);
    } catch (err) {
      toast.error("Please allow your microphone and camera permissions to make your video and voice appear correctly. Go to browser settings and change it.");
      console.error("Permission error", err);
    }
  };


  if (isPending || !session?.user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#BD9267]"></div>
      </div>
    );
  }

  if (!isJoined) {
    return (
      <div className="flex justify-center flex-col items-center gap-6 md:gap-10 h-screen px-4">
        <p className="font-semibold text-xl md:text-2xl text-center">
          Are you ready to debug,{" "}
          <span className="text-[#BD9267]">{session?.user.name}</span>{" "}?
        </p>
        <div className="w-full max-w-[600px]">
          <video 
            style={{
              borderRadius: "20px"
            }} 
            autoPlay 
            className="w-full h-auto"
            ref={videoRef}
          ></video>
        </div>
        {showJoinButton && (
          <Button onClick={() => {
            setIsJoined(true);
          }}>
            Join Now
          </Button>
        )}
      </div>
    );
  }

  return (
    <PairRoomJoinHandler 
      id={roomId} 
      localAudioTrack={localAudioTrack} 
      localVideoTrack={localVideoTrack} 
    />
  );
}