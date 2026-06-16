import { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';

const WS_URL = process.env.REACT_APP_WEBSOCKET_URL;

export const useWebSocket = (deviceId = null) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    if (socket) {
      socket.disconnect();
    }

    const newSocket = io(WS_URL, {
      auth: {
        token: localStorage.getItem('token'),
        deviceId: deviceId
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      reconnectAttempts.current = 0;
      console.log('WebSocket connected');
      
      if (deviceId) {
        newSocket.emit('subscribe', deviceId);
      }
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      reconnectAttempts.current += 1;
      
      if (reconnectAttempts.current >= maxReconnectAttempts) {
        newSocket.disconnect();
      }
    });

    newSocket.on('message', (data) => {
      setMessages(prev => [...prev, data]);
    });

    setSocket(newSocket);

    return newSocket;
  }, [deviceId]);

  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  }, [socket]);

  const sendMessage = useCallback((event, data) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    }
  }, [socket, isConnected]);

  useEffect(() => {
    if (deviceId) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [deviceId, connect, disconnect]);

  return {
    socket,
    isConnected,
    messages,
    connect,
    disconnect,
    sendMessage
  };
};
