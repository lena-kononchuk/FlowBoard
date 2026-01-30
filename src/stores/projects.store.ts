import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Project } from '@/types/project.types';

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<Project[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // -------------------------
  // Save to localStorage
  // -------------------------
  function saveToLocalStorage(): void {
    localStorage.setItem('projects', JSON.stringify(projects.value));
  }

  // -------------------------
  // Load from localStorage
  // -------------------------
  function loadFromLocalStorage(): void {
    const stored = localStorage.getItem('projects');
    if (stored) {
      projects.value = JSON.parse(stored);
    }
  }

  // -------------------------
  // Fetch projects
  // -------------------------
  function fetchProjects() {
    loading.value = true;
    error.value = null;
    
    try {
      loadFromLocalStorage();
    } catch (err) {
      error.value = 'Failed to load projects';
      console.error(err);
    } finally {
      loading.value = false;
    }
  }

  // -------------------------
  // Create project
  // -------------------------
  function createProject(data: Omit<Project, 'id'>) {
    loading.value = true;
    
    try {
      const newProject: Project = {
        id: Date.now(),
        ...data,
        createdAt: new Date().toISOString()
      };
      projects.value.push(newProject);
      saveToLocalStorage();
      return newProject;
    } catch (err) {
      error.value = 'Failed to create project';
      console.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // -------------------------
  // Update project
  // -------------------------
  function updateProject(id: number, updates: Partial<Project>) {
    loading.value = true;
    
    try {
      const index = projects.value.findIndex(p => p.id === id);
      if (index === -1) {
        throw new Error('Project not found');
      }
      
      projects.value[index] = { ...projects.value[index], ...updates };
      saveToLocalStorage();
      return projects.value[index];
    } catch (err) {
      error.value = 'Failed to update project';
      console.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // -------------------------
  // Delete project
  // -------------------------
  function deleteProject(id: number) {
    loading.value = true;
    
    try {
      projects.value = projects.value.filter(p => p.id !== id);
      saveToLocalStorage();
    } catch (err) {
      error.value = 'Failed to delete project';
      console.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    loadFromLocalStorage,
    saveToLocalStorage
  };
});
