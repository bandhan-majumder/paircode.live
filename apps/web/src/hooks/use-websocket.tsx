"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { io, Socket } from "socket.io-client";
import { NEXT_PUBLIC_SERVER_URL } from "../../config";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface UseSocketIOProps {
  token: string;
  roomId: string;
  onMessageReceived: (content: string) => void;
  onUserJoined?: (socketId: string) => void;
  onUserLeft?: () => void;
  onOffer?: (data: { roomId: string; sdp: RTCSessionDescriptionInit }) => void;
  onAnswer?: (data: { roomId: string; sdp: RTCSessionDescriptionInit }) => void;
  onIceCandidate?: (data: { candidate: RTCIceCandidate; type: "sender" | "receiver" }) => void;
  onLobby?: () => void;
  onSendOffer?: (data: { roomId: string }) => void;
  onError?: (error: { message: string }) => void;
}

export function useSocketIO({
  token,
  roomId,
  onMessageReceived,
  onUserJoined,
  onUserLeft,
  onOffer,
  onAnswer,
  onIceCandidate,
  onLobby,
  onSendOffer,
  onError
}: UseSocketIOProps) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const mountedRef = useRef(false);
  const hasJoinedRoom = useRef(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!token) {
      console.error("No token provided, skipping Socket.IO connection");
      return;
    };

    if (mountedRef.current) return;
    mountedRef.current = true;

    if (!roomId) {
      console.error("No roomId provided, skipping Socket.IO connection");
      return;
    }

    // Prevent duplicate connections
    if (socketRef.current?.connected) {
      return;
    }

    try {
      const socket = io(NEXT_PUBLIC_SERVER_URL, {
        query: { token }, // highly required
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 3000,
        reconnectionAttempts: Infinity,
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        setIsConnected(true);
        
        // once socket can join only one room
        if (!hasJoinedRoom.current) {
          hasJoinedRoom.current = true;
          socket.emit("join-room", roomId);
        }
      });

      // CHECK: changing state for correct rooms for concurrent connections
      socket.on("receive-message", (data: { content: string; senderId: string; timestamp: number }) => {
        try {
          if (data.content) {
            onMessageReceived(data.content);
          }
        } catch (error) {
          console.error("Error processing received message:", error);
        }
      });

      socket.on("user-joined", (data: { socketId: string }) => {
        if (onUserJoined) {
          onUserJoined(data.socketId);
        }
      });

      socket.on("user-left", (data: { socketId: string; timestamp: number }) => {
        if (onUserLeft) {
          onUserLeft();
        }
      });

      socket.on("send-offer", (data: { roomId: string }) => {
        if (onSendOffer) {
          onSendOffer(data);
        }
      });

      socket.on("offer", (data: { roomId: string; sdp: RTCSessionDescriptionInit }) => {
        if (onOffer) {
          onOffer(data);
        }
      });

      socket.on("answer", (data: { roomId: string; sdp: RTCSessionDescriptionInit }) => {
        if (onAnswer) {
          onAnswer(data);
        }
      });

      socket.on("add-ice-candidate", (data: { candidate: RTCIceCandidate; type: "sender" | "receiver" }) => {
        if (onIceCandidate) {
          onIceCandidate(data);
        }
      });

      socket.on("lobby", () => {
        if (onLobby) {
          onLobby();
        }
      });

      socket.on("error", (error: { message: string }) => {
        console.error("Socket.IO error:", error);
        if (onError) {
          onError(error);
        }
      });

      socket.on("leave-room", () => {
        // console.log("user left")
      })

      socket.on("disconnect", (reason: any) => {
        setIsConnected(false);
      });

      socket.on("connect_error", (error: any) => {
        console.error("Socket.IO connection error:", error);
        setIsConnected(false);
      });

    } catch (error) {
      console.error("Error creating Socket.IO connection:", error);
      setIsConnected(false);
    }

    return () => {
      mountedRef.current = false;
      hasJoinedRoom.current = false;
      
      if (socketRef.current) {
        if (socketRef.current.connected && roomId) {
          socketRef.current.emit("leave-room", roomId);
        }
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setIsConnected(false);
    };
  }, [token, roomId]);

  const mutation = useMutation({
    mutationFn: async (data: { currentRoomId: string }) => {
      return axios.put("/api/room/member", {
        roomId: data.currentRoomId
      });
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      return response;
    },
    onError: (error) => {
      console.error("Error creating room:", error);
    },
    retry: 2
  });

  const sendMessage = useCallback(
    (content: string) => {
      if (socketRef.current && socketRef.current.connected && roomId) {
        try {
          socketRef.current.emit("send-message", {
            roomId,
            content,
          });
        } catch (error) {
          console.error("Error sending message:", error);
        }
      } else {
        console.error("Cannot send message: Socket not connected or malformed data");
      }
    },
    [roomId]
  );

  const emitOffer = useCallback(
    (data: { sdp: RTCSessionDescriptionInit; roomId: string }) => {
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit("offer", data);
      }
    },
    []
  );

  const emitAnswer = useCallback(
    (data: { sdp: RTCSessionDescriptionInit; roomId: string }) => {
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit("answer", data);
      }
    },
    []
  );

  const emitIceCandidate = useCallback(
    (data: { candidate: RTCIceCandidate; type: "sender" | "receiver"; roomId: string }) => {
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit("add-ice-candidate", data);
      }
    },
    []
  );

  const leaveRoom = useCallback(async (currentRoomId: string) => {
    const socket = socketRef.current;

    if (socket && socket.connected && currentRoomId) {
      try {
        socket.emit("leave-room", currentRoomId);

        await mutation.mutateAsync({
          currentRoomId
        });
      } catch (error) {
        console.error("Failed to update room member status:", error);
      } finally {
        if (socket.connected) {
          socket.disconnect();
        }
      }
    } else {
      console.warn("Cannot leave room: Socket not available or not connected");
    }
  }, []);

  return {
    sendMessage,
    emitOffer,
    emitAnswer,
    emitIceCandidate,
    isLeaveMutationPending: mutation.isPending,
    isLeaveMutationErrror: mutation.isError,
    leaveRoom,
    isConnected,
    socket: socketRef.current,
  };
}