import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const SocketContext = createContext({
  socket: null,
  onlineUsers: []
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children, userId }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!userId) {
      if (socket) {
        socket.close();
        setSocket(null);
      }
      return;
    }

    // Connect to Backend Socket.io server
    const newSocket = io('http://localhost:9092', {
      query: { userId },
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling']
    });

    setSocket(newSocket);

    // listeners
    newSocket.on('connect', () => {
      console.log('✅ Connected to Real-time server');
    });

    newSocket.on('notification', (data) => {
      if (data.type === 'CONNECTION_ACCEPTED') {
        toast.success(data.message || "Request Accepted!", {
          duration: 6000,
          icon: '🤝',
          style: {
            borderRadius: '10px',
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #334155'
          },
        });
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket Connection Error:', error);
    });

    return () => {
      newSocket.close();
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
