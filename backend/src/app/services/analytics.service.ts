import { AnalyticsRepository } from '../repositories/analytics.repository';

const analyticsRepository = new AnalyticsRepository();

export class AnalyticsService {
  async getDashboardAnalytics(userId: string) {
    return await analyticsRepository.getDashboardMetrics(userId);
  }
}
