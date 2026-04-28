import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import userRoutes from './routes/userRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import ratingRoutes from './routes/ratingRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Load environment variables
dotenv.config();

// Connect database
connectDB();

const app = express();

// 1️⃣ CORS **BEFORE ANY ROUTES**
const allowedOrigins = [
	'http://localhost:5173',
	'https://borrow-box-five.vercel.app',
	'https://borrowbox-plum.vercel.app',
	process.env.CLIENT_URL
].filter(Boolean);

app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				console.log('CORS blocked origin:', origin);
				callback(new Error('Not allowed by CORS'));
			}
		},
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
		credentials: true,
	})
);

// 2️⃣ Parse JSON body
app.use(express.json());

// 3️⃣ Handle preflight (OPTIONS) requests
app.options('*', cors());

// HTTP server wrapper for WebSockets
const httpServer = createServer(app);

// 4️⃣ WebSocket server CORS
const io = new Server(httpServer, {
	cors: {
		origin: allowedOrigins,
		methods: ['GET', 'POST'],
		credentials: true,
	},
});

// --- SOCKET HANDLERS ---------------------------------------------------------
io.on('connection', (socket) => {
	console.log('🔥 New WebSocket client connected:', socket.id);

	socket.on('join_room', (roomId) => {
		socket.join(roomId);
		console.log(`📌 Client ${socket.id} joined room ${roomId}`);
	});

	socket.on('send_message', (data) => {
		io.to(data.roomId).emit('receive_message', data);
	});

	socket.on('disconnect', () => {
		console.log('❌ Client disconnected:', socket.id);
	});
});
// ------------------------------------------------------------------------------

// 5️⃣ ROUTES (now after CORS)
app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/chat', chatRoutes);

// Test route
app.get('/api/test', (req, res) => {
	res.json({ success: true, message: 'BorrowBox API is running!' });
});

// 6️⃣ Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start server
httpServer.listen(PORT, () => {
	console.log(`🚀 Server running on port ${PORT}`);
});
