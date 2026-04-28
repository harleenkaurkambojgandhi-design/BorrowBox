import Rating from '../models/Rating.js';
import User from '../models/User.js';
import Request from '../models/Request.js';

/**
 * Add a rating for a completed request
 * POST /api/ratings
 */
export const addRating = async (req, res) => {
  try {
    const { requestId, rating, comment } = req.body;
    const raterId = req.user.id;

    // Check if request exists and is completed
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    if (request.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only rate completed requests'
      });
    }

    // Check if the user is the provider (only providers can rate requestors)
    if (request.provider.toString() !== raterId) {
      return res.status(403).json({
        success: false,
        message: 'Only the provider can rate this request'
      });
    }

    // Check if rating already exists
    const existingRating = await Rating.findOne({ request: requestId });
    if (existingRating) {
      return res.status(400).json({
        success: false,
        message: 'This request has already been rated'
      });
    }

    // Create new rating
    const newRating = new Rating({
      request: requestId,
      ratedUser: request.requestor,
      raterUser: raterId,
      rating,
      comment
    });

    await newRating.save();

    // Update user's rating
    const ratedUser = await User.findById(request.requestor);
    ratedUser.updateRating(rating);
    await ratedUser.save();

    res.status(201).json({
      success: true,
      message: 'Rating added successfully',
      data: { rating: newRating }
    });
  } catch (error) {
    console.error('Add rating error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error adding rating'
    });
  }
};

/**
 * Get ratings for a user
 * GET /api/ratings/user/:userId
 */
export const getUserRatings = async (req, res) => {
  try {
    const userId = req.params.userId;

    const ratings = await Rating.find({ ratedUser: userId })
      .populate('raterUser', 'name')
      .populate('request', 'type itemName topic')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { ratings }
    });
  } catch (error) {
    console.error('Get user ratings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching ratings'
    });
  }
};