"use client";

import { use, useEffect, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import PairRoom from "@/components/pair-room";

type Props = {
  params: Promise<{ id: string }>;
};

export default function CodeArena({ params }: Props) {
  const { id } = use(params);
  const { data: session, isPending } = authClient.useSession();
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [localAudioTrack, setLocalAudioTrack] = useState<MediaStreamTrack | null>(null);
  const [localVideoTrack, setlocalVideoTrack] = useState<MediaStreamTrack | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isPending && (!session || !session?.user || !session.user.id)) {
      router.push("/login");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    if (videoRef && videoRef.current) {
      getCameraMicPermissions()
    }
  }, [videoRef]);

  const getCameraMicPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

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
    } catch (err) {
      console.error("Permission error", err);
    }
  }

  if (!isJoined) {
    return (
      <>
        <div className="flex justify-center flex-col items-center gap-10 h-screen">
          <p className="font-semibold text-2xl">Are you ready to debug,{" "} <span className="text-[#BD9267]">{session?.user.name}</span>{" "} ?</p>
          <div className="">
            <video style={{
              borderRadius: "20px"
            }} autoPlay width={600} height={500} ref={videoRef}></video>
          </div>
          <Button onClick={() => {
            setIsJoined(true);
          }}>
            Join Now
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <PairRoom id={id} localAudioTrack={localAudioTrack} localVideoTrack={localVideoTrack} />
    </>
  )
}