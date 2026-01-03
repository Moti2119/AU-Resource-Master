import express from 'express';
import {
  getAllResources,
  getResource,
  createResource,
  updateResource,
  deleteResource,
  getLowStock
} from '../controllers/resourceController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getAllResources);
router.get('/low-stock', authenticate, getLowStock);
router.get('/:id', authenticate, getResource);
router.post('/', authenticate, authorize('Admin', 'Inventory Manager'), createResource);
router.put('/:id', authenticate, authorize('Admin', 'Inventory Manager'), updateResource);
router.delete('/:id', authenticate, authorize('Admin'), deleteResource);

export default router;

