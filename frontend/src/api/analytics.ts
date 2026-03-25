import api from '../lib/api';

export interface AnalyticsData {
  total: number;
  completed: number;
  completionPercentage: number;
  completionsPerDay: Array<{ date: string; count: number }>;
  mostProductiveDay: string;
  averageCompletionHours: number;
  priorityDistribution: Array<{ priority: string; count: number }>;
  productivityScore: number;
}

export const getAnalytics = async (): Promise<AnalyticsData> => {
  const response = await api.get('/analytics/dashboard');
  return response.data;
};
