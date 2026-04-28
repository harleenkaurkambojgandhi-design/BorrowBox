import { io } from 'socket.io-client';

// Simple singleton wrapper around socket.io client
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const createSocket = () => {
	if (socket) return socket;
	socket = io(SOCKET_URL, {
		withCredentials: true,
	});

	socket.on('connect', () => {
		console.log('Socket connected', socket.id);
	});

	socket.on('disconnect', () => {
		console.log('Socket disconnected');
	});

	return socket;
};

export const joinRoom = (roomId) => {
	if (!socket) createSocket();
	socket.emit('join_room', roomId);
};

// Emit a message object (saved by server) to the room so other clients receive it
export const emitSavedMessage = (roomId, savedMessage) => {
	if (!socket) createSocket();
	socket.emit('send_message', { roomId, message: savedMessage });
};

export const onReceiveMessage = (handler) => {
	if (!socket) createSocket();
	socket.on('receive_message', (data) => {
		// `data` is expected to have { roomId, message }
		handler(data);
	});
};

export const offReceiveMessage = (handler) => {
	if (!socket) return;
	socket.off('receive_message', handler);
};

export const disconnectSocket = () => {
	if (socket) {
		socket.disconnect();
		socket = null;
	}
};

export default {
	createSocket,
	joinRoom,
	emitSavedMessage,
	onReceiveMessage,
	offReceiveMessage,
	disconnectSocket,
};
