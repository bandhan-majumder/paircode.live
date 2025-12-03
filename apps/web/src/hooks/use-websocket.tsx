"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { NEXT_PUBLIC_SERVER_URL } from "../../config";

interface UseWebSocketProps {
  roomId: string;
  onMessageReceived: (content: string) => void;
}

export function useWebSocket({ roomId, onMessageReceived }: UseWebSocketProps) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    if (!roomId) {
      console.error("No roomId provided, skipping WebSocket connection");
      return;
    }

    try {
      const ws = new WebSocket(NEXT_PUBLIC_SERVER_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        ws.send(
          JSON.stringify({
            roomId: roomId,
            type: "join",
          })
        );
      };

      ws.onmessage = (event) => {
        try {
          const parsedData = JSON.parse(event.data);
          
          if (parsedData.content) {
            onMessageReceived(parsedData.content);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);

        // Only attempt to reconnect if we still have a roomId
        if (roomId) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log("Attempting to reconnect...");
            connect();
          }, 3000);
        }
      };
    } catch (error) {
      console.error("Error creating WebSocket:", error);
      setIsConnected(false);
    }
  }, [roomId, onMessageReceived]);

  const sendMessage = useCallback(
    (content: string) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && roomId) {
        try {
          wsRef.current.send(
            JSON.stringify({
              roomId: roomId,
              content: content,
              type: "message",
            })
          );
        } catch (error) {
          console.error("Error sending message:", error);
        }
      }
    },
    [roomId]
  );

  useEffect(() => {
    if (roomId) {
      connect();
    } else {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setIsConnected(false);
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        if (wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(
            JSON.stringify({
              roomId: roomId,
              type: "leave",
            })
          );
        }
        wsRef.current.close();
        wsRef.current = null;
      }
      setIsConnected(false);
    };
  }, [roomId, connect]);

  return { sendMessage, isConnected };
}