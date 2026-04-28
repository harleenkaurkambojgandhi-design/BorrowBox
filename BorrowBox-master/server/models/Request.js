import mongoose from 'mongoose';

/**
 * Request Schema for BorrowBox system
 * Handles both Item and Guidance requests
 */
const requestSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Request type is required'],
    enum: ['item', 'guidance']
  },
  requestor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Requestor is required']
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'completed'],
    default: 'pending'
  },
  // Item-specific fields
  itemName: {
    type: String,
    required: function() { return this.type === 'item'; }
  },
  quantity: {
    type: Number,
    required: function() { return this.type === 'item'; },
    min: [1, 'Quantity must be at least 1']
  },
  requestedTime: {
    type: Date,
    required: function() { return this.type === 'item'; }
  },
  // Guidance-specific fields
  topic: {
    type: String,
    required: function() { return this.type === 'guidance'; }
  },
  timeNeeded: {
    type: String,
    required: function() { return this.type === 'guidance'; }
  },
  description: {
    type: String,
    maxLength: [500, 'Description cannot exceed 500 characters']
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for better query performance
requestSchema.index({ type: 1, status: 1 });
requestSchema.index({ requestor: 1 });
requestSchema.index({ provider: 1 });

export default mongoose.model('Request', requestSchema);