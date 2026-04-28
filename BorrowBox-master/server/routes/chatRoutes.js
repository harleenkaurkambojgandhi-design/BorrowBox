import express from 'express';
import { sendMessage, getMessages } from '../controllers/chatController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.post('/send', protect, sendMessage);
router.get('/messages/:id', protect, getMessages);

export default router;
