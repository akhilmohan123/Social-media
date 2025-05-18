import { io } from 'socket.io-client';

const socket = io('http://localhost:8800', {
  autoConnect: false, // we will connect manually
});

export default socket;
