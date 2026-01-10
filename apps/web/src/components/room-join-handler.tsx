"use client";

import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import PairRoom from "@/components/pair-room";
import { ShareRoomDialog } from "@/components/share-room-dialog";
import { getRoomData } from "@/app/actions/room";

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

  const addMemberMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/room/member", {
        roomId
      });
      return response;
    },
    onSuccess: async () => {
      await refetchRoomData();
    },
    onError: (error) => {
      console.error("Error joining room:", error);
      toast.error("Failed to join room. Please try again.");
    },
    retry: 2
  });

  useEffect(() => {
    addMemberMutation.mutate();
  }, []);

  return (
    <>
      {roomDetails && roomDetails?.isCreator && (
        <div className="absolute top-20 right-4 z-50">
          <ShareRoomDialog 
            roomId={roomId} 
            isShared={roomDetails.room.isShared || false} 
            onShared={refetchRoomData} 
          />
        </div>
      )}
      <PairRoom 
        id={roomId} 
        localAudioTrack={localAudioTrack} 
        localVideoTrack={localVideoTrack} 
      />
    </>
  );
}