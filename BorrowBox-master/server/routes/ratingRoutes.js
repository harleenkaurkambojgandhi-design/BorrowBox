import express from 'express';
import { addRating, getUserRatings } from '../controllers/ratingController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// All rating routes require authentication
router.use(authenticate);

router.post('/', addRating);
router.get('/user/:userId', getUserRatings);

export default router;