import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChatMessage from '../components/ChatMessage';
import { sendMessage, getMessages } from '../services/chatApi';
import {
	createSocket,
	joinRoom,
	emitSavedMessage,
	onReceiveMessage,
	offReceiveMessage,
	disconnectSocket,
} from '../services/chatSocket';
import { useAuth } from '../context/AuthContext.jsx';
import './chat.css';

const ChatPage = () => {
	const { user } = useAuth();
	const { requestId } = useParams();
	const navigate = useNavigate();

	const [input, setInput] = useState('');
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(false);
	const containerRef = useRef(null);
	const receiveHandlerRef = useRef(null);

	useEffect(() => {
		// initialize socket once
		createSocket();
		return () => {
			// keep socket alive across pages if you prefer; if you want to fully disconnect uncomment below
			// disconnectSocket();
		};
	}, []);

	useEffect(() => {
		if (requestId) {
			loadMessages();
			joinRoom(requestId);

			// set up receive handler
			const handler = (data) => {
				if (!data) return;
				const incoming = data.message || data; // support both shapes
				// ensure we only add messages for this room
				if (data.roomId && String(data.roomId) !== String(requestId)) return;
				// deduplicate by _id when possible
				setMessages((prev) => {
					if (!incoming._id) {
						// no id available, just append
						return [...prev, normalizeMessage(incoming)];
					}
					const exists = prev.some(
						(m) => String(m._id) === String(incoming._id)
					);
					if (exists) return prev;
					return [...prev, normalizeMessage(incoming)];
				});
			};
			receiveHandlerRef.current = handler;
			onReceiveMessage(handler);
		}

		return () => {
			if (receiveHandlerRef.current)
				offReceiveMessage(receiveHandlerRef.current);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [requestId]);

	const loadMessages = async () => {
		if (!requestId) return;
		setLoading(true);
		try {
			const msgs = await getMessages(requestId);
			// normalize incoming messages so sender name and id shape are consistent
			const normalized = (msgs || []).map((m) => normalizeMessage(m));
			setMessages(normalized);
		} catch (err) {
			console.error('Failed to load messages', err);
		} finally {
			setLoading(false);
		}
	};

	const handleSend = async () => {
		if (!input.trim() || !requestId) return;

		try {
			// persist via REST
			const res = await sendMessage(input, requestId);
			if (res && res.success && res.data) {
				// emit saved message via socket so other clients receive it instantly
				emitSavedMessage(requestId, res.data);
				// append locally (optimistic)
				setMessages((prev) => [...prev, normalizeMessage(res.data)]);
				setInput('');
			}
		} catch (err) {
			console.error('Send failed', err);
		}
	};

	// auto-scroll to bottom when messages change
	useEffect(() => {
		if (!containerRef.current) return;
		containerRef.current.scrollTop = containerRef.current.scrollHeight;
	}, [messages]);

	// Suggestions UI when no request selected
	const suggestions = [
		'Hi, is this item still available?',
		'Can I borrow this for a week?',
		'Where can we meet to pick this up?',
	];

	function normalizeMessage(m) {
		if (!m) return m;
		// clone to avoid mutation
		const msg = { ...m };
		// createdAt might be in timestamps
		msg.createdAt =
			msg.createdAt || msg.created_at || msg.updatedAt || msg.created_at;

		// if senderId is populated object with name, keep it
		if (msg.senderId && typeof msg.senderId === 'object') {
			// make sure _id exists
			msg.senderId = {
				_id: msg.senderId._id || msg.senderId.id,
				name: msg.senderId.name,
			};
		} else if (msg.senderId) {
			// senderId is likely an ObjectId string. If it matches current user, attach user's name
			msg.senderId = {
				_id: msg.senderId,
				name:
					String(msg.senderId) === String(user?._id)
						? user?.name || 'You'
						: undefined,
			};
		}

		// if sender field exists as direct id
		if (!msg.senderId && msg.sender) {
			msg.senderId = {
				_id: msg.sender,
				name:
					String(msg.sender) === String(user?._id)
						? user?.name || 'You'
						: undefined,
			};
		}

		// derive displayName
		msg.displayName =
			msg.senderId?.name ||
			(String(msg.senderId?._id) === String(user?._id)
				? user?.name || 'You'
				: 'Unknown');

		// isMine
		msg.isMine = !!(
			user &&
			msg.senderId &&
			String(msg.senderId._id) === String(user._id)
		);

		return msg;
	}

	return (
		<div className='container py-4'>
			<div className='d-flex justify-content-between align-items-center mb-3'>
				<h2 className='mb-0'>
					Chat {requestId ? `— Request ${requestId}` : ''}
				</h2>
				<button
					className='btn btn-sm btn-outline-secondary'
					onClick={() => navigate('/main')}
				>
					Back
				</button>
			</div>

			{!requestId && (
				<div className='mb-3'>
					<p className='text-muted'>
						Start a conversation — navigate from a request to chat
					</p>
					<div className='d-flex gap-2'>
						{suggestions.map((s, i) => (
							<button
								key={i}
								className='btn btn-light btn-sm'
								onClick={() => setInput(s)}
							>
								{s}
							</button>
						))}
					</div>
				</div>
			)}

			<div className='card'>
				<div className='card-body p-0'>
					<div ref={containerRef} className='messages p-3'>
						{loading ? (
							<div className='text-center py-4'>Loading messages…</div>
						) : (
							messages.map((msg, index) => (
								<ChatMessage
									key={msg._id || index}
									text={msg.message}
									sender={msg.displayName || msg.senderId?.name || 'Unknown'}
									isMine={!!msg.isMine}
									createdAt={msg.createdAt}
								/>
							))
						)}
					</div>

					<div className='p-3 border-top d-flex gap-2'>
						<input
							value={input}
							onChange={(e) => setInput(e.target.value)}
							className='form-control'
							placeholder={
								requestId
									? 'Type a message...'
									: 'Select a request to start chatting'
							}
							disabled={!requestId}
							onKeyDown={(e) => {
								if (e.key === 'Enter') handleSend();
							}}
						/>
						<button
							className='btn btn-primary'
							onClick={handleSend}
							disabled={!requestId || !input.trim()}
						>
							Send
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChatPage;
