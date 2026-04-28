import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
	baseURL: API_BASE_URL,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
	const token = localStorage.getItem('token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

// Handle response errors
api.interceptors.response.use(
	(response) => response.data,
	(error) => {
		if (error.response?.status === 401) {
			localStorage.removeItem('token');
			window.location.href = '/login';
		}
		return Promise.reject(error);
	}
);

// User API calls
export const loginUser = (credentials) => api.post('/users/login', credentials);
export const registerUser = (userData) => api.post('/users/signup', userData);
export const getUserProfile = () => api.get('/users/profile');
export const updateUserProfile = (userData) =>
	api.put('/users/profile', userData);

// Request API calls
export const createRequest = (requestData) =>
	api.post('/requests', requestData);
export const getAllRequests = (params) => api.get('/requests', { params });
export const getUserRequests = () => api.get('/requests/user');
export const acceptRequest = (requestId) =>
	api.put(`/requests/${requestId}/accept`);
export const completeRequest = (requestId) =>
	api.put(`/requests/${requestId}/complete`);

// Rating API calls
export const addRating = (ratingData) => api.post('/ratings', ratingData);
export const getUserRatings = (userId) => api.get(`/ratings/user/${userId}`);

export default api;
