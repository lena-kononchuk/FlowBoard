<template>
  <div>
    <AppHeader />
    <div class="wrapper">
      <div class="flex center-xs box" v-if="projectsStore.loading">Loading...</div>
      <div class="flex center-xs box" v-else-if="projectsStore.error">{{ projectsStore.error }}</div>
      <ProjectsTable
        v-else
        :projects="projectsStore.projects"
        :task-counts="taskCounts"
        @project-click="goToProject"
        @create-project="createProject"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useProjectsStore } from '@/stores/projects.store';
import { useTasksStore } from '@/stores/tasks.store';
import { UseNotifications } from '@/composables/UseNotifications.ts';
import AppHeader from '@/components/common/AppHeader.vue';
import ProjectsTable from '@/components/projects/ProjectsTable.vue';

const router = useRouter();
const projectsStore = useProjectsStore();
const tasksStore = useTasksStore();
const { success, error } = UseNotifications();

/**
 * Calculate task counts per project
 */
const taskCounts = computed(() => {
  const counts: Record<number, number> = {};
  tasksStore.tasks.forEach(task => {
    counts[task.projectId] = (counts[task.projectId] || 0) + 1;
  });
  return counts;
});

/**
 * Load data on mount
 */
onMounted(async () => {
  projectsStore.loadFromLocalStorage();
  tasksStore.loadFromLocalStorage();
  
  try {
    await Promise.all([
      projectsStore.fetchProjects(),
      tasksStore.fetchTasks()
    ]);
  } catch (err) {
    error('Failed to load data');
  }
});

/**
 * Navigate to project detail page
 */
function goToProject(id: number) {
  router.push({ name: 'project-detail', params: { id } });
}

/**
 * Create new project with notification
 */
async function createProject(data: { name: string; shortDescription?: string }) {
  try {
    await projectsStore.createProject({ ...data, status: 'planned' });
    success('Project created successfully');
  } catch (err) {
    error('Failed to create project');
  }
}
</script>