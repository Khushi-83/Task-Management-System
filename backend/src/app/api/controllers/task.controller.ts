import { Request, Response } from 'express';
import { TaskService } from '../../services/task.service';

const taskService = new TaskService();

export class TaskController {
  async getTasks(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { page, limit, status, priority } = req.query;
      
      const filter = {
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        status: status as string,
        priority: priority as string
      };

      const result = await taskService.getTasks(userId, filter);
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getTask(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const result = await taskService.getTaskById(req.params.id, userId);
      return res.json(result);
    } catch (error: any) {
      if (error.message === 'Task not found') return res.status(404).json({ error: error.message });
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createTask(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      if (!req.body.title) {
        return res.status(400).json({ error: 'Title is required' });
      }
      
      const result = await taskService.createTask(userId, req.body);
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateTask(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const result = await taskService.updateTask(req.params.id, userId, req.body);
      return res.json(result);
    } catch (error: any) {
      if (error.message === 'Task not found') return res.status(404).json({ error: error.message });
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteTask(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      await taskService.deleteTask(req.params.id, userId);
      return res.json({ message: 'Task deleted successfully' });
    } catch (error: any) {
      if (error.message === 'Task not found') return res.status(404).json({ error: error.message });
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
