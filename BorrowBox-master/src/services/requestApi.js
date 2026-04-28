// src/services/requestApi.js
import api from './api';

export const getRequestById = async (requestId) => {
	const res = await api.get(`/requests/${requestId}`);
	return res.data;
};
