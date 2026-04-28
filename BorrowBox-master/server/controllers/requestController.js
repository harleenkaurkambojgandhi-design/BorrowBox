import Request from '../models/Request.js';
import User from '../models/User.js';

/**
 * Create a new request
 * POST /api/requests
 */
export const createRequest = async (req, res) => {
	try {
		const requestData = {
			...req.body,
			requestor: req.user.id,
		};

		const request = new Request(requestData);
		await request.save({ validateModifiedOnly: true });

		// Populate requestor details
		await request.populate('requestor', 'name rating area');

		res.status(201).json({
			success: true,
			message: 'Request created successfully',
			data: { request },
		});
	} catch (error) {
		console.error('Create request error:', error);
		res.status(500).json({
			success: false,
			message: error.message || 'Error creating request',
		});
	}
};

/**
 * Get all requests with filters
 * GET /api/requests
 */
export const getAllRequests = async (req, res) => {
	try {
		const {
			type,
			status,
			sortBy = 'createdAt',
			sortOrder = 'desc',
		} = req.query;

		// Build filter query
		const filter = {};
		if (type) filter.type = type;
		if (status) filter.status = status;

		// Build sort query
		const sort = {};
		sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

		const requests = await Request.find(filter)
			.populate('requestor', 'name rating area')
			.populate('provider', 'name rating area')
			.sort(sort);

		res.status(200).json({
			success: true,
			data: { requests },
		});
	} catch (error) {
		console.error('Get requests error:', error);
		res.status(500).json({
			success: false,
			message: 'Error fetching requests',
		});
	}
};

/**
 * Get user's requests (both requested and provided)
 * GET /api/requests/user
 */
export const getUserRequests = async (req, res) => {
	try {
		const userId = req.user.id;

		// Get requests where user is requestor
		const requestedItems = await Request.find({ requestor: userId })
			.populate('provider', 'name rating area')
			.sort({ createdAt: -1 });

		// Get requests where user is provider
		const providedItems = await Request.find({ provider: userId })
			.populate('requestor', 'name rating area')
			.sort({ createdAt: -1 });

		res.status(200).json({
			success: true,
			data: {
				requested: requestedItems,
				provided: providedItems,
			},
		});
	} catch (error) {
		console.error('Get user requests error:', error);
		res.status(500).json({
			success: false,
			message: 'Error fetching user requests',
		});
	}
};

/**
 * Accept a request
 * PUT /api/requests/:id/accept
 */
export const acceptRequest = async (req, res) => {
	try {
		const requestId = req.params.id;
		const providerId = req.user.id;

		const request = await Request.findById(requestId);

		if (!request) {
			return res.status(404).json({
				success: false,
				message: 'Request not found',
			});
		}

		if (request.requestor.toString() === providerId) {
			return res.status(400).json({
				success: false,
				message: 'You cannot accept your own request',
			});
		}

		if (request.status !== 'pending') {
			return res.status(400).json({
				success: false,
				message: 'Request is no longer available',
			});
		}

		request.provider = providerId;
		request.status = 'accepted';

		// Only validate modified fields
		await request.save({ validateModifiedOnly: true });

		await request.populate('requestor', 'name rating area');
		await request.populate('provider', 'name rating area');

		res.status(200).json({
			success: true,
			message: 'Request accepted successfully',
			data: { request },
		});
	} catch (error) {
		console.error('Accept request error:', error);
		res.status(500).json({
			success: false,
			message: 'Error accepting request',
		});
	}
};

/**
 * Complete a request
 * PUT /api/requests/:id/complete
 */
export const completeRequest = async (req, res) => {
	try {
		const requestId = req.params.id;
		const userId = req.user.id;

		const request = await Request.findById(requestId);

		if (!request) {
			return res.status(404).json({
				success: false,
				message: 'Request not found',
			});
		}

		// Only the provider can complete the request
		if (request.provider?.toString() !== userId) {
			return res.status(403).json({
				success: false,
				message: 'Only the provider can complete this request',
			});
		}

		if (request.status !== 'accepted') {
			return res.status(400).json({
				success: false,
				message: 'Request must be accepted before completion',
			});
		}

		request.status = 'completed';
		request.completedAt = new Date();
		await request.save();

		await request.populate('requestor', 'name rating area');
		await request.populate('provider', 'name rating area');

		res.status(200).json({
			success: true,
			message: 'Request completed successfully',
			data: { request },
		});
	} catch (error) {
		console.error('Complete request error:', error);
		res.status(500).json({
			success: false,
			message: 'Error completing request',
		});
	}
};
