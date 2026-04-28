const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
	requestId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Request',
		required: true,
	},
	sender: { type: String, enum: ['user', 'admin'], required: true },
	message: { type: String, required: true },
	timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
