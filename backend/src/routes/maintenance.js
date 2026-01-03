import express from 'express';
import {
  getAllIssues,
  getIssue,
  createIssue,
  updateIssue,
  getIssuesByStatus
} from '../controllers/maintenanceController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getAllIssues);
router.get('/status/:status', authenticate, getIssuesByStatus);
router.get('/:id', authenticate, getIssue);
router.post('/', authenticate, createIssue);
router.put('/:id', authenticate, authorize('Admin', 'Inventory Manager'), updateIssue);

export default router;

