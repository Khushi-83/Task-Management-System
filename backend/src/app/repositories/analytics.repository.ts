import { pool } from '../config/db';

export class AnalyticsRepository {
  async getDashboardMetrics(userId: string) {
    const metrics: any = {};

    // 1. Total & Completed
    const basicQuery = await pool.query(
      `SELECT 
        (SELECT COUNT(*)::int FROM tasks WHERE user_id = $1) as total_tasks,
        (SELECT COUNT(*)::int FROM tasks WHERE user_id = $1 AND status = 'Completed') as completed_tasks`,
      [userId]
    );
    metrics.total = basicQuery.rows[0].total_tasks || 0;
    metrics.completed = basicQuery.rows[0].completed_tasks || 0;
    metrics.completionPercentage = metrics.total > 0 ? Math.round((metrics.completed / metrics.total) * 100) : 0;

    // 2. Tasks per timeframe (last 7 days)
    const completionsDaily = await pool.query(
      `SELECT DATE(timestamp) as date, COUNT(*)::int as count 
       FROM task_history 
       WHERE action_type = 'completed' AND task_id IN (SELECT id FROM tasks WHERE user_id = $1)
         AND timestamp > CURRENT_DATE - INTERVAL '7 days'
       GROUP BY DATE(timestamp) ORDER BY date ASC`,
      [userId]
    );
    metrics.completionsPerDay = completionsDaily.rows;

    // 3. Most productive day
    const productiveDay = await pool.query(
      `SELECT trim(to_char(timestamp, 'Day')) as day_of_week, COUNT(*)::int as count 
       FROM task_history 
       WHERE action_type = 'completed' AND task_id IN (SELECT id FROM tasks WHERE user_id = $1)
       GROUP BY day_of_week ORDER BY count DESC LIMIT 1`,
      [userId]
    );
    metrics.mostProductiveDay = productiveDay.rows[0] ? productiveDay.rows[0].day_of_week : 'N/A';

    // 4. Average completion time (hours)
    const avgTime = await pool.query(
      `WITH task_times AS (
         SELECT task_id,
                MIN(timestamp) FILTER (WHERE action_type = 'created') as created_at,
                MAX(timestamp) FILTER (WHERE action_type = 'completed') as completed_at
         FROM task_history
         WHERE task_id IN (SELECT id FROM tasks WHERE user_id = $1)
         GROUP BY task_id
       )
       SELECT AVG(EXTRACT(EPOCH FROM (completed_at - created_at))) as avg_seconds
       FROM task_times
       WHERE created_at IS NOT NULL AND completed_at IS NOT NULL`,
      [userId]
    );
    const seconds = avgTime.rows[0].avg_seconds;
    metrics.averageCompletionHours = seconds ? parseFloat((seconds / 3600).toFixed(1)) : 0;

    // 5. Priority distribution
    const priorityDist = await pool.query(
      `SELECT priority, COUNT(*)::int as count FROM tasks WHERE user_id = $1 GROUP BY priority`,
      [userId]
    );
    metrics.priorityDistribution = priorityDist.rows;

    // 6. Productivity Score calculation inputs
    const highPriorityCompleted = await pool.query(
      `SELECT COUNT(*)::int as count FROM tasks WHERE user_id = $1 AND status = 'Completed' AND priority = 'High'`,
      [userId]
    );
    const overduePending = await pool.query(
      `SELECT COUNT(*)::int as count FROM tasks WHERE user_id = $1 AND status = 'Pending' AND created_at < CURRENT_DATE - INTERVAL '7 days'`,
      [userId]
    );
    
    // Score Formula: (Completed * 10) + (High Priority Completed * 5) - (Stale Pending * 2)
    const baseScore = (metrics.completed * 10) + (highPriorityCompleted.rows[0].count * 5) - (overduePending.rows[0].count * 2);
    metrics.productivityScore = Math.max(0, baseScore); // Prevent negative score

    return metrics;
  }
}
