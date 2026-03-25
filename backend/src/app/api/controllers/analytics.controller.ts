import { Request, Response } from 'express';
import { AnalyticsService } from '../../services/analytics.service';

const analyticsService = new AnalyticsService();

export class AnalyticsController {
  async getDashboard(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const result = await analyticsService.getDashboardAnalytics(userId);
      return res.json(result);
    } catch (error: any) {
      console.error('Analytics Error:', error);
      return res.status(500).json({ error: 'Internal server error processing analytics' });
    }
  }
}
