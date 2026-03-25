import api from '../lib/api';

export interface TaskData {
  title: string;
  description?: string;
  priority?: string;
  status?: string;
  due_date?: string | null;
}

export const getTasks = async () => {
  const response = await api.get('/tasks');
  return response.data;
};

export const createTask = async (data: TaskData) => {
  const response = await api.post('/tasks', data);
  return response.data;
};

export const updateTask = async (id: string, data: Partial<TaskData>) => {
  const response = await api.put(`/tasks/${id}`, data);
  return response.data;
};

export const deleteTask = async (id: string) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};
