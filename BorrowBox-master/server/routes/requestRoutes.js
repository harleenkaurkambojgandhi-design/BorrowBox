import express from 'express';
import {
  createRequest,
  getAllRequests,
  getUserRequests,
  acceptRequest,
  completeRequest
} from '../controllers/requestController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// All request routes require authentication
router.use(authenticate);

router.post('/', createRequest);
router.get('/', getAllRequests);
router.get('/user', getUserRequests);
router.put('/:id/accept', acceptRequest);
router.put('/:id/complete', completeRequest);

export default router;