import { useEffect, useState } from 'react';
import { socket } from './socket';

const useSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      console.log('WebSocket connected.');
      setIsConnected(true);
    }

    function onDisconnect() {
      console.log('WebSocket connection closed.');
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return { isConnected, socket };
};

export default useSocket;
