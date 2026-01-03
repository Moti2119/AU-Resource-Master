import express from 'express';
import { createUser, getAllUsers, deleteUser } from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require Admin authentication
router.get('/', authenticate, authorize('Admin'), getAllUsers);
router.post('/', authenticate, authorize('Admin'), createUser);
router.delete('/:id', authenticate, authorize('Admin'), deleteUser);

export default router;

