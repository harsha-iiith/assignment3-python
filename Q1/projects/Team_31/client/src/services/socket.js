import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5001";

const socket = io(SOCKET_URL);

socket.on('connect', () => {
    console.log('Successfully connected to WebSocket server with ID:', socket.id);
});

socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket server');
});

export default socket;
