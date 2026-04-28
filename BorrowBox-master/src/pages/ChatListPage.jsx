import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyChats } from '../services/chatListApi';
import { useAuth } from '../context/AuthContext';

const ChatListPage = () => {
	const [chats, setChats] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const { user } = useAuth();

	useEffect(() => {
		const fetchChats = async () => {
			setLoading(true);
			try {
				const data = await getMyChats();
				setChats(data || []);
			} catch (err) {
				setChats([]);
			} finally {
				setLoading(false);
			}
		};
		fetchChats();
	}, []);

	return (
		<div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-white'>
			<div className='w-full max-w-xl bg-white rounded-xl shadow-lg p-6 mt-8 mb-8 border border-blue-100'>
				<h2 className='text-2xl font-bold text-blue-700 mb-4'>Your Chats</h2>
				{loading ? (
					<p className='text-blue-500'>Loading chats…</p>
				) : chats.length === 0 ? (
					<p className='text-gray-500'>No chats found.</p>
				) : (
					<ul className='divide-y divide-blue-100'>
						{chats.map((chat) => {
							// Show the other user's name
							let otherUser = chat.users.find((u) => u._id !== user._id);
							return (
								<li
									key={chat.requestId}
									className='py-3 flex items-center justify-between hover:bg-blue-50 rounded-lg px-2 cursor-pointer'
									onClick={() => navigate(`/chat/${chat.requestId}`)}
								>
									<span className='font-semibold text-blue-900'>
										{otherUser ? otherUser.name : 'Unknown User'}
									</span>
									<span className='text-xs text-gray-400'>
										{chat.lastMessage ? chat.lastMessage.message : ''}
									</span>
								</li>
							);
						})}
					</ul>
				)}
				<button
					className='mt-6 px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition'
					onClick={() => navigate('/main')}
				>
					Back to Main
				</button>
			</div>
		</div>
	);
};

export default ChatListPage;
