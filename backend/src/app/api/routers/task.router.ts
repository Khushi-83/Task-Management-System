import express from 'express';
import { TaskController } from '../controllers/task.controller';
import { requireAuth } from '../../core/middleware/auth';

const router = express.Router();
const taskController = new TaskController();

// Apply auth middleware to all task routes
router.use(requireAuth);

router.get('/', taskController.getTasks.bind(taskController));
router.post('/', taskController.createTask.bind(taskController));
router.get('/:id', taskController.getTask.bind(taskController));
router.put('/:id', taskController.updateTask.bind(taskController));
router.delete('/:id', taskController.deleteTask.bind(taskController));

export default router;
