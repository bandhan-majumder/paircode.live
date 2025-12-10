"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { io, Socket } from "socket.io-client";
import { NEXT_PUBLIC_SERVER_URL } from "../../config";

interface UseSocketIOProps {
  roomId: string;
  onMessageReceived: (content: string) => void;
  onUserJoined?: (socketId: string) => void;
  onUserLeft?: (socketId: string) => void;
}

export function useSocketIO({ 
  roomId, 
  onMessageReceived,
  onUserJoined,
  onUserLeft 
}: UseSocketIOProps) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    if (!roomId) {
      console.error("No roomId provided, skipping Socket.IO connection");
      return;
    }

    try {
      const socket = io(NEXT_PUBLIC_SERVER_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 3000,
        reconnectionAttempts: Infinity,
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("Socket.IO connected:", socket.id);
        setIsConnected(true);
        socket.emit("join-room", roomId);
      });

      socket.on("receive-message", (data: { content: string; senderId: string; timestamp: number }) => {
        try {
          if (data.content) {
            onMessageReceived(data.content);
          }
        } catch (error) {
          console.error("Error processing received message:", error);
        }
      });

      socket.on("user-joined", (data: { socketId: string; timestamp: number }) => {
        console.log("User joined:", data.socketId);
        if (onUserJoined) {
          onUserJoined(data.socketId);
        }
      });

      socket.on("user-left", (data: { socketId: string; timestamp: number }) => {
        console.log("User left:", data.socketId);
        if (onUserLeft) {
          onUserLeft(data.socketId);
        }
      });

      socket.on("error", (error: { message: string }) => {
        console.error("Socket.IO error:", error);
      });

      socket.on("disconnect", (reason) => {
        console.log("Socket.IO disconnected:", reason);
        setIsConnected(false);
      });

      socket.on("connect_error", (error) => {
        console.error("Socket.IO connection error:", error);
        setIsConnected(false);
      });

    } catch (error) {
      console.error("Error creating Socket.IO connection:", error);
      setIsConnected(false);
    }
  }, [roomId, onMessageReceived, onUserJoined, onUserLeft]);

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
        console.warn("Cannot send message: Socket not connected or no roomId");
      }
    },
    [roomId]
  );

  const leaveRoom = useCallback(() => {
    if (socketRef.current && socketRef.current.connected && roomId) {
      socketRef.current.emit("leave-room", roomId);
    }
  }, [roomId]);

  useEffect(() => {
    if (roomId) {
      connect();
    } else {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setIsConnected(false);
    }

    return () => {
      if (socketRef.current) {
        if (socketRef.current.connected && roomId) {
          socketRef.current.emit("leave-room", roomId);
        }
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setIsConnected(false);
    };
  }, [roomId, connect]);

  return { sendMessage, leaveRoom, isConnected };
}