import api from './api';

// Note: `api` response interceptor already returns response.data
// which is the API payload { success, data }.
export const sendMessage = async (message, requestId) => {
	// server expects { requestId, message }
	const res = await api.post('/chat/send', { requestId, message });
	return res; // returns { success, data }
};

export const getMessages = async (requestId) => {
	const res = await api.get(`/chat/messages/${requestId}`);
	// res is { success, data: [...] } because api interceptor unwraps response
	return res.data; // return array of messages
};
