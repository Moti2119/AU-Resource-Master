import express from 'express';
import { register, login, getMe, forgotPassword, adminResetPassword } from '../controllers/authController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/admin/reset-password', authenticate, authorize('Admin'), adminResetPassword);
router.get('/me', authenticate, getMe);

export default router;

