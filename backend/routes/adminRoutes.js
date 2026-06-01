import express from 'express';
import { getAllUsers, toggleBlockUser, getDashboardStats } from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/toggle-block', toggleBlockUser);

export default router;
