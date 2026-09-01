import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useChatStore } from '../stores/chatStore';
import { useNotificationStore } from '../stores/notificationStore';

export function useWebSocket(teamId: string | null) {
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttempts = useRef(0);
  const { token } = useAuthStore();
  const { addMessage, setTyping } = useChatStore();
  const { addNotification } = useNotificationStore();

  const connect = () => {
    if (!teamId || !token) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = import.meta.env.VITE_WS_URL || `${protocol}//${window.location.host}`;
    ws.current = new WebSocket(`${wsUrl}/ws/team/${teamId}?token=${token}`);

    ws.current.onopen = () => {
      setIsConnected(true);
      reconnectAttempts.current = 0;
    };

    ws.current.onmessage = (event) => {
      try {
        const { type, data } = JSON.parse(event.data);
        switch (type) {
          case 'message:new':
            addMessage(data);
            break;
          case 'message:typing':
            setTyping(data.username, data.isTyping);
            break;
          case 'notification:new':
            addNotification(data);
            break;
          // Other events like sentiment:update can be handled via custom events or stores
        }
      } catch (err) {
        console.error('Failed to parse websocket message', err);
      }
    };

    ws.current.onclose = () => {
      setIsConnected(false);
      const timeout = Math.min(500 * Math.pow(2, reconnectAttempts.current), 30000);
      reconnectAttempts.current += 1;
      reconnectTimeout.current = setTimeout(connect, timeout);
    };
  };

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      if (ws.current) ws.current.close();
    };
  }, [teamId, token]);

  const send = (type: string, data: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type, data }));
    }
  };

  return { send, isConnected };
}
