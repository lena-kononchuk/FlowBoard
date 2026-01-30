// projects.api.ts
import apiClient from './axios.config';
import type { Project } from '@/types/project.types';

export const projectsApi = {
  getAll() {
    return apiClient.get<{ projects: Project[] }>('/projects.json');
  },

  getById(/* id: number */) {
    return apiClient.get<Project>('/projects.json');
  },

  create(project: Omit<Project, 'id' | 'createdAt'>) {
    return apiClient.post('/projects.json', {
      ...project,
      createdAt: new Date().toISOString()
    });
  },

update(_id: number, project: Partial<Project>) {
  return apiClient.patch('/projects.json', project);
},

delete(_id: number) {
  return apiClient.delete('/projects.json');
}
};
