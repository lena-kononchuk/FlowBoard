import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Task } from '@/types/task.types';

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // -------------------------
  // Save to localStorage
  // -------------------------
  function saveToLocalStorage(): void {
    localStorage.setItem('tasks', JSON.stringify(tasks.value));
  }

  // -------------------------
  // Load from localStorage
  // -------------------------
  function loadFromLocalStorage(): void {
    const stored = localStorage.getItem('tasks');
    if (stored) {
      tasks.value = JSON.parse(stored);
    }
  }

  // -------------------------
  // Fetch tasks
  // -------------------------
  async function fetchTasks(): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      loadFromLocalStorage();
    } catch (err) {
      error.value = 'Failed to load tasks';
      console.error(err);
    } finally {
      loading.value = false;
    }
  }

  // -------------------------
  // Create task
  // -------------------------
  async function createTask(data: Omit<Task, 'id'>): Promise<Task> {
    loading.value = true;
    try {
      const newTask: Task = {
        id: Date.now(),
        ...data,
        createdAt: new Date().toISOString()
      };
      tasks.value.push(newTask);
      saveToLocalStorage();
      return newTask;
    } catch (err) {
      error.value = 'Failed to create task';
      console.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // -------------------------
  // Update task
  // -------------------------
  async function updateTask(taskId: number, updates: Partial<Task>): Promise<Task> {
    loading.value = true;
    try {
      const index = tasks.value.findIndex(t => t.id === taskId);
      if (index === -1) throw new Error('Task not found');
      
      tasks.value[index] = { ...tasks.value[index], ...updates };
      saveToLocalStorage();
      
      return tasks.value[index];
    } catch (err) {
      error.value = 'Failed to update task';
      console.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // -------------------------
  // Delete task
  // -------------------------
  async function deleteTask(taskId: number): Promise<void> {
    loading.value = true;
    try {
      tasks.value = tasks.value.filter(t => t.id !== taskId);
      saveToLocalStorage();
    } catch (err) {
      error.value = 'Failed to delete task';
      console.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // -------------------------
  // Update task order (for drag-and-drop)
  // -------------------------
  function updateTaskOrder(projectId: number, reorderedTasks: Task[]): void {
    // Update only tasks from the specific project
    const otherTasks = tasks.value.filter(t => t.projectId !== projectId);
    tasks.value = [...otherTasks, ...reorderedTasks];
    saveToLocalStorage();
  }

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskOrder,
    loadFromLocalStorage,
    saveToLocalStorage
  };
});
