import mongoose from 'mongoose';

/**
 * Rating Schema for BorrowBox system
 * Stores ratings given by providers to requestors after completion
 */
const ratingSchema = new mongoose.Schema({
  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request',
    required: true
  },
  ratedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  raterUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  comment: {
    type: String,
    maxLength: [200, 'Comment cannot exceed 200 characters']
  }
}, {
  timestamps: true
});

// Ensure one rating per request
ratingSchema.index({ request: 1 }, { unique: true });

export default mongoose.model('Rating', ratingSchema);