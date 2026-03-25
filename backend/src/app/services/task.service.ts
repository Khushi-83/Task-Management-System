import { TaskRepository, TaskFilter } from '../repositories/task.repository';

const taskRepository = new TaskRepository();

export class TaskService {
  async getTasks(userId: string, filter: TaskFilter) {
    return await taskRepository.findAll(userId, filter);
  }

  async getTaskById(taskId: string, userId: string) {
    const task = await taskRepository.findById(taskId, userId);
    if (!task) throw new Error('Task not found');
    return task;
  }

  async createTask(userId: string, data: any) {
    return await taskRepository.create(userId, data);
  }

  async updateTask(taskId: string, userId: string, data: any) {
    return await taskRepository.update(taskId, userId, data);
  }

  async deleteTask(taskId: string, userId: string) {
    return await taskRepository.delete(taskId, userId);
  }
}
