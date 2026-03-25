import express from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { query } from '../config/db';

const router = express.Router();

router.use(requireAuth);

// Get all tasks for the logged in user
router.get('/', async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const result = await query(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new task
router.post('/', async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const { title, description, priority, status, due_date } = req.body;

    if (!title) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }

    const result = await query(
      `INSERT INTO tasks (user_id, title, description, priority, status, due_date)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [userId, title, description || null, priority || 'MEDIUM', status || 'TODO', due_date || null]
    );

    // Also record history
    await query(
      `INSERT INTO task_history (task_id, action_type) VALUES ($1, $2)`,
      [result.rows[0].id, 'CREATED']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a task
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const taskId = req.params.id;
    const { title, description, priority, status, due_date } = req.body;

    // Check if task exists and belongs to user
    const checkResult = await query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [taskId, userId]);
    if (checkResult.rows.length === 0) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    const previousState = checkResult.rows[0];

    const result = await query(
      `UPDATE tasks 
       SET title = COALESCE($1, title), 
           description = COALESCE($2, description), 
           priority = COALESCE($3, priority), 
           status = COALESCE($4, status), 
           due_date = COALESCE($5, due_date),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [title, description, priority, status, due_date, taskId, userId]
    );

    await query(
      `INSERT INTO task_history (task_id, action_type, previous_state) VALUES ($1, $2, $3)`,
      [taskId, 'UPDATED', JSON.stringify(previousState)]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a task
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const taskId = req.params.id;

    const result = await query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
      [taskId, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
