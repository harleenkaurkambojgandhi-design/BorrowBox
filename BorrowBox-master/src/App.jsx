import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MainPage from './pages/MainPage';
import AddRequestPage from './pages/AddRequestPage';
import RequestsPage from './pages/RequestsPage';
import ProfilePage from './pages/ProfilePage';
import LoadingSpinner from './components/LoadingSpinner';
import ChatPage from './pages/ChatPage'; // ✔ only once

/**
 * Main App component with routing
 * Handles protected routes and authentication state
 */
function App() {
	const { user, loading } = useAuth();

	if (loading) {
		return <LoadingSpinner />;
	}

	return (
		<div className='App'>
			<Routes>
				{/* Public Routes */}
				<Route
					path='/login'
					element={user ? <Navigate to='/main' replace /> : <LoginPage />}
				/>
				<Route
					path='/signup'
					element={user ? <Navigate to='/main' replace /> : <SignupPage />}
				/>

				{/* Protected Routes */}
				<Route
					path='/main'
					element={user ? <MainPage /> : <Navigate to='/login' replace />}
				/>
				<Route
					path='/add-request'
					element={user ? <AddRequestPage /> : <Navigate to='/login' replace />}
				/>
				<Route
					path='/requests'
					element={user ? <RequestsPage /> : <Navigate to='/login' replace />}
				/>
				<Route
					path='/profile'
					element={user ? <ProfilePage /> : <Navigate to='/login' replace />}
				/>

				{/* Chat Routes */}
				<Route
					path='/chat'
					element={user ? <ChatPage /> : <Navigate to='/login' replace />}
				/>
				<Route
					path='/chat/:requestId'
					element={user ? <ChatPage /> : <Navigate to='/login' replace />}
				/>

				{/* Default redirect */}
				<Route
					path='/'
					element={<Navigate to={user ? '/main' : '/login'} replace />}
				/>
			</Routes>
		</div>
	);
}

export default App;
