import express from 'express';
import { getAdminDashboard, getInventoryDashboard } from '../controllers/dashboardController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/admin', authenticate, authorize('Admin'), getAdminDashboard);
router.get('/inventory', authenticate, authorize('Admin', 'Inventory Manager'), getInventoryDashboard);

export default router;

