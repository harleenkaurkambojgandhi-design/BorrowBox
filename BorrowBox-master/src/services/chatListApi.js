// src/services/chatListApi.js
import api from './api';

export const getMyChats = async () => {
	const res = await api.get('/chat/my-chats');
	return res.data;
};
