import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema(
	{
		requestId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Request',
			required: true,
		},
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		message: { type: String, required: true },
	},
	{ timestamps: true }
);

export default mongoose.model('ChatMessage', chatMessageSchema);
