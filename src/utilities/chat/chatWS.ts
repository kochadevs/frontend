/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState, useCallback } from "react";

export interface ConversationUpdate {
  // shape left flexible; page handles details
  [key: string]: any;
}

export interface ActionMessage {
  action: string;
  room_id?: number;
  recipient_id?: number;
  content?: string;
  token?: string;
  message?: {
    id?: string;
    content?: string;
    sender_id?: number;
    timestamp?: string;
  };
  message_id?: number;
  // Legacy compatibility
  type?: string;
  data?: any;
}

interface UseChatWSOptions {
  accessToken: string | null | undefined;
  recipientId: number;
  currentUserId?: number | null;
  onMessage: (msg: ActionMessage) => void;
}

export function useChatWS({
  accessToken,
  recipientId,
  currentUserId,
  onMessage,
}: UseChatWSOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [roomId, setRoomId] = useState<number | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingSendsRef = useRef<Set<string>>(new Set());

  const baseUrl = process.env.NEXT_PUBLIC_CHAT_WS_URL;

  const cleanup = () => {
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = null;
    }
    if (wsRef.current) {
      try { wsRef.current.close(); } catch {}
      wsRef.current = null;
    }
  };

  const connect = useCallback(() => {
    if (!accessToken) {
      return;
    }

    const fullUrl = `${baseUrl}?token=${encodeURIComponent(accessToken)}`;
    const ws = new WebSocket(fullUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      const joinMsg: ActionMessage = {
        action: "join_room",
        recipient_id: recipientId,
        token: accessToken,
      };
      ws.send(JSON.stringify(joinMsg));
    };

    ws.onmessage = (event) => {
      try {
        const data: ActionMessage = JSON.parse(event.data);
        if (typeof data.room_id === "number") {
          setRoomId(data.room_id);
        }

        // Deduplicate echo for sent messages
        if (data.action === "message" && data.message?.content) {
          const senderMatches = typeof currentUserId === "number" && data.message.sender_id === currentUserId;
          const sig = `${data.room_id}|${data.message.content.trim()}`;
          if (senderMatches && pendingSendsRef.current.has(sig)) {
            pendingSendsRef.current.delete(sig);
            return; // skip echo
          }
        }

        onMessage(data);
      } catch (e) {
        // swallow parse error, could log
        console.error("WS parse error", e);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      // attempt reconnect
      reconnectTimer.current = setTimeout(() => connect(), 3000);
    };

    ws.onerror = () => {
      setIsConnected(false);
    };
  }, [accessToken, baseUrl, recipientId, currentUserId, onMessage]);

  useEffect(() => {
    connect();
    return () => {
      cleanup();
    };
  }, [connect]);

  const sendMessage = (content: string, targetRoomId?: number) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return false;
    }
    const rid = typeof targetRoomId === 'number' ? targetRoomId : roomId;
    if (!rid) {
      return false;
    }
    const payload: ActionMessage = {
      action: "send_message",
      room_id: rid,
      content,
    };

    try {
      const sig = `${rid}|${content.trim()}`;
      pendingSendsRef.current.add(sig);
      setTimeout(() => pendingSendsRef.current.delete(sig), 5000);

      wsRef.current.send(JSON.stringify(payload));
      return true;
    } catch (error) {
      console.error("Failed to send message:", error);
      return false;
    }
  };

  const sendTyping = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN || !roomId) return;
    const payload: ActionMessage = { action: "typing", room_id: roomId };
    wsRef.current.send(JSON.stringify(payload));
  };

  const markRead = (messageId: number) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    const payload: ActionMessage = { action: "read", message_id: messageId };
    wsRef.current.send(JSON.stringify(payload));
  };

  const disconnect = () => {
    cleanup();
    setIsConnected(false);
  };

  return { isConnected, roomId, sendMessage, sendTyping, markRead, disconnect };
}
