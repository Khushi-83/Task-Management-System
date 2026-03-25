import express from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { requireAuth } from '../../core/middleware/auth';

const router = express.Router();
const analyticsController = new AnalyticsController();

router.use(requireAuth);
router.get('/dashboard', analyticsController.getDashboard.bind(analyticsController));

export default router;
