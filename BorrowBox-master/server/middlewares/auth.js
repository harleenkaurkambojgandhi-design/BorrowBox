import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Authentication middleware
 * Verifies JWT token and adds user to request object
 */
export const authenticate = async (req, res, next) => {
	try {
		const authHeader = req.header('Authorization');

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return res.status(401).json({
				success: false,
				message: 'Access denied. No token provided.',
			});
		}

		const token = authHeader.substring(7); // Remove 'Bearer ' prefix

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.userId).select('-password');

		if (!user) {
			return res.status(401).json({
				success: false,
				message: 'Token is not valid.',
			});
		}

		req.user = user;
		next();
	} catch (error) {
		console.error('Authentication error:', error.message);
		res.status(401).json({
			success: false,
			message: 'Token is not valid.',
		});
	}
};

/**
 * 👉 Chat module expects "protect"
 * So we export protect = authenticate
 */
export const protect = authenticate;
