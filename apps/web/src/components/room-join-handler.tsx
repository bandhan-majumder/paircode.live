"use client";

import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import PairRoom from "@/components/pair-room";
import { ShareRoomDialog } from "@/components/share-room-dialog";
import { getRoomData } from "@/app/actions/room";
import { trpc } from "@/lib/utils/trpc";

type Props = {
  id: string;
  localAudioTrack: MediaStreamTrack | null;
  localVideoTrack: MediaStreamTrack | null;
};

export default function PairRoomJoinHandler({ 
  id: roomId, 
  localAudioTrack, 
  localVideoTrack 
}: Props) {
  const { data: roomDetails, refetch: refetchRoomData } = useQuery({ 
    queryKey: ["room", roomId], 
    queryFn: async () => await getRoomData(roomId),
  });

  const addMemberMutation = useMutation(
    trpc.roomMember.join.mutationOptions({
      onSuccess: async () => {
        await refetchRoomData();
      },
      onError: (error) => {
        console.error("Error joining room:", error);
        toast.error("Failed to join room. Please try again.");
      },
    })
  );

  useEffect(() => {
    if (addMemberMutation.isIdle) {
      addMemberMutation.mutate({ roomId });
    }
  }, [addMemberMutation.isIdle, roomId]);

  return (
    <>
      <PairRoom 
        isShared={roomDetails?.room?.isShared || false}
        onShared={refetchRoomData}
        isCreator={roomDetails?.isCreator || false}
        id={roomId} 
        localAudioTrack={localAudioTrack} 
        localVideoTrack={localVideoTrack} 
      />
    </>
  );
}