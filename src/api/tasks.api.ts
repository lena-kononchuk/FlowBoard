// tasks.api.ts
import apiClient from './axios.config';
import type { Task } from '@/types/task.types';

export const tasksApi = {
  getAll() {
    return apiClient.get<{ tasks: Task[] }>('/tasks.json');
  },

  getByProjectId(/* projectId: number */) {
    return apiClient.get<{ tasks: Task[] }>('/tasks.json');
  },

  create(task: Omit<Task, 'id'>) {
    return apiClient.post('/tasks.json', task);
  },


update(_id: number | string, task: Partial<Task>) {
  return apiClient.patch('/tasks.json', task);
},

delete(_id: number | string) {
  return apiClient.delete('/tasks.json');
}
};
