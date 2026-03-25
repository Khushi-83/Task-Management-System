import { pool } from '../config/db';

export interface TaskFilter {
  status?: string;
  priority?: string;
  page?: number;
  limit?: number;
}

export class TaskRepository {
  async findAll(userId: string, filter: TaskFilter) {
    const { status, priority, page = 1, limit = 10 } = filter;
    const offset = (page - 1) * limit;

    let queryStr = 'SELECT * FROM tasks WHERE user_id = $1';
    const params: any[] = [userId];
    let paramCount = 2;

    if (status) {
      queryStr += ` AND status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (priority) {
      queryStr += ` AND priority = $${paramCount}`;
      params.push(priority);
      paramCount++;
    }

    queryStr += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await pool.query(queryStr, params);

    let countQueryStr = 'SELECT COUNT(*) FROM tasks WHERE user_id = $1';
    const countParams: any[] = [userId];
    let countParamCount = 2;
    if (status) { countQueryStr += ` AND status = $${countParamCount}`; countParams.push(status); countParamCount++; }
    if (priority) { countQueryStr += ` AND priority = $${countParamCount}`; countParams.push(priority); countParamCount++; }
    
    const countResult = await pool.query(countQueryStr, countParams);

    return {
      data: result.rows,
      meta: {
        total: parseInt(countResult.rows[0].count),
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
      }
    };
  }

  async findById(taskId: string, userId: string) {
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [taskId, userId]);
    return result.rows[0] || null;
  }

  async create(userId: string, data: any) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const insertTask = await client.query(
        `INSERT INTO tasks (user_id, title, description, priority, status, due_date)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [userId, data.title, data.description || null, data.priority || 'Medium', data.status || 'Pending', data.due_date || null]
      );
      
      const task = insertTask.rows[0];

      await client.query(
        `INSERT INTO task_history (task_id, action_type, previous_state) VALUES ($1, $2, $3)`,
        [task.id, 'created', null]
      );

      await client.query('COMMIT');
      return task;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  async update(taskId: string, userId: string, data: any) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const existing = await client.query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2 FOR UPDATE', [taskId, userId]);
      if (existing.rows.length === 0) throw new Error('Task not found');
      
      const previousState = existing.rows[0];

      const updateTask = await client.query(
        `UPDATE tasks 
         SET title = COALESCE($1, title), 
             description = COALESCE($2, description), 
             priority = COALESCE($3, priority), 
             status = COALESCE($4, status), 
             due_date = COALESCE($5, due_date),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $6 AND user_id = $7
         RETURNING *`,
        [data.title, data.description, data.priority, data.status, data.due_date, taskId, userId]
      );
      
      const updatedTask = updateTask.rows[0];

      let action = 'updated';
      if (data.status === 'Completed' && previousState.status !== 'Completed') action = 'completed';

      await client.query(
        `INSERT INTO task_history (task_id, action_type, previous_state) VALUES ($1, $2, $3)`,
        [taskId, action, JSON.stringify(previousState)]
      );

      await client.query('COMMIT');
      return updatedTask;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  async delete(taskId: string, userId: string) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const existing = await client.query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [taskId, userId]);
      if (existing.rows.length === 0) throw new Error('Task not found');
      
      // Depending on schema constraints, ON DELETE CASCADE will erase the history.
      // However, we write the record beforehand to accurately log intent inside transaction timeline.
      await client.query(
        `INSERT INTO task_history (task_id, action_type, previous_state) VALUES ($1, $2, $3)`,
        [taskId, 'deleted', JSON.stringify(existing.rows[0])]
      );

      await client.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2', [taskId, userId]);
      await client.query('COMMIT');
      return true;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
}
