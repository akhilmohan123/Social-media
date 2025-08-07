import { io } from 'socket.io-client';

const socket = io('http://localhost:8800', {
  autoConnect: false, // we will connect manually,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

export default socket;
