<template>
  <div>
    <AppHeader />
    <div class="wrapper">
      <button class="button button--secondary box" @click="$router.push('/')">
        ← Back to Projects
      </button>

      <div v-if="loading">Loading...</div>
      <div v-else-if="!project">Project not found</div>

      <div v-else>
        <!-- Project Info -->
        <div class="card box2">
          <div class="flex middle-xs between-xs box">
            <h1 class="subtitle">{{ project.name }}</h1>
            <div class="flex gap middle-xs">
              <label class="text">Status:</label>
              <div class="relative">
                <select
                  v-model="project.status"
                  @change="updateProjectStatus"
                  class="select"
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="planned">Planned</option>
                </select>
                <i class="fas fa-chevron-down form__select-icon"></i>
              </div>
            </div>
          </div>
          <div>
            <h3 class="text box-small">Description</h3>
            <p>{{ project.fullDescription || 'No description' }}</p>
          </div>
        </div>

        <!-- View Mode Toggle -->
        <div class="flex middle-xs between-xs box2">
          <h2 class="subtitle">Tasks</h2>
          <div class="flex middle-xs gap">
            <button
              @click="viewMode = 'table'"
              :class="['button', viewMode === 'table' ? 'button--primary' : 'button--secondary']"
            >
              <i class="fas fa-table"></i> Table
            </button>
            <button
              @click="viewMode = 'kanban'"
              :class="['button', viewMode === 'kanban' ? 'button--primary' : 'button--secondary']"
            >
              <i class="fas fa-columns"></i> Kanban
            </button>
          </div>
        </div>

        <!-- Table View -->
        <TasksTable
          v-if="viewMode === 'table'"
          :tasks="projectTasks"
          @edit-task="editTask"
          @add-task="openTaskModal('todo')"
          @update-task-order="handleUpdateTaskOrder"
        />

        <!-- Kanban View -->
        <div v-else class="row box">
          <TaskColumn
            v-for="column in taskColumns"
            :key="column.status"
            :title="column.title"
            :status="column.status"
            :tasks="tasksByStatus[column.status as 'todo' | 'in-progress' | 'done']"
            @edit-task="editTask"
            @add-task="openTaskModal(column.status as Task['status'])"
            @task-moved="handleTaskMoved"
          />
        </div>
      </div>
    </div>

    <CreateTaskModal
      :is-open="isTaskModalOpen"
      :project-id="projectId"
      :initial-status="taskModalStatus"
      :edit-task="editingTask"
      @close="closeTaskModal"
      @submit="handleCreateTask"
      @update="handleUpdateTask"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useProjectsStore } from '@/stores/projects.store';
import { useTasksStore } from '@/stores/tasks.store';
import { UseNotifications } from '@/composables/UseNotifications';
import AppHeader from '@/components/common/AppHeader.vue';
import CreateTaskModal from '@/components/tasks/CreateTaskModal.vue';
import TaskColumn from '@/components/tasks/TaskColumn.vue';
import TasksTable from '@/components/tasks/TasksTable.vue';
import type { Task } from '@/types/task.types';

// -------------------------
// Stores
// -------------------------
const route = useRoute();
const projectsStore = useProjectsStore();
const tasksStore = useTasksStore();
const { success, error } = UseNotifications();

// -------------------------
// Reactive state (назви як у template)
// -------------------------
const loading = ref(true);
const project = computed(() =>
  projectsStore.projects.find(p => p.id === Number(route.params.id))
);
const projectId = Number(route.params.id);

const isTaskModalOpen = ref(false);
const taskModalStatus = ref<'todo' | 'in-progress' | 'done'>('todo');
const editingTask = ref<Task | null>(null);

// -------------------------
// View mode
// -------------------------
const viewMode = ref<'table' | 'kanban'>(
  (localStorage.getItem('tasks-view-mode') as 'table' | 'kanban') || 'kanban'
);
watch(viewMode, mode => localStorage.setItem('tasks-view-mode', mode));

// -------------------------
// Kanban columns
// -------------------------
const taskColumns = [
  { status: 'todo', title: 'To Do' },
  { status: 'in-progress', title: 'In Progress' },
  { status: 'done', title: 'Done' }
];

const projectTasks = computed(() =>
  tasksStore.tasks.filter(t => t.projectId === projectId)
);

const tasksByStatus = computed(() => {
  const result: Record<'todo' | 'in-progress' | 'done', Task[]> = {
    'todo': [],
    'in-progress': [],
    'done': []
  };
  projectTasks.value.forEach(t => result[t.status].push(t));
  Object.keys(result).forEach(key => {
    const status = key as keyof typeof result;
    result[status].sort((a, b) => a.order - b.order);
  });
  return result;
});

// -------------------------
// Lifecycle
// -------------------------
onMounted(async () => {
  try {
    await Promise.all([projectsStore.fetchProjects(), tasksStore.fetchTasks()]);
  } catch {
    error('Failed to load data');
  } finally {
    loading.value = false;
  }
});

// -------------------------
// Project status
// -------------------------
async function updateProjectStatus() {
  if (!project.value) return;
  try {
    await projectsStore.updateProject(projectId, { status: project.value.status });
    success('Project status updated');
  } catch {
    error('Failed to update project status');
  }
}

// -------------------------
// Task modal
// -------------------------
function openTaskModal(status: Task['status']) {
  taskModalStatus.value = status;
  editingTask.value = null;
  isTaskModalOpen.value = true;
}
function closeTaskModal() {
  isTaskModalOpen.value = false;
  editingTask.value = null;
}
function editTask(task: Task) {
  editingTask.value = task;
  taskModalStatus.value = task.status;
  isTaskModalOpen.value = true;
}

// -------------------------
// Task CRUD
// -------------------------
async function handleCreateTask(data: {
  projectId: number;
  name: string;
  status: string; // <- string від CreateTaskModal
  dueDate: string;
  description?: string;
  assignee?: string;
}) {

  if (!['todo', 'in-progress', 'done'].includes(data.status)) {
    data.status = 'todo';
  }
  const status = data.status as Task['status'];

  const tasksInStatus = projectTasks.value.filter(t => t.status === status);
  const maxOrder = tasksInStatus.length ? Math.max(...tasksInStatus.map(t => t.order)) : -1;

  try {
    await tasksStore.createTask({ ...data, status, order: maxOrder + 1 });
    success('Task created successfully');
  } catch {
    error('Failed to create task');
  }
}



async function handleUpdateTask(taskId: string | number, data: { name: string; description?: string; assignee?: string; status: string; dueDate: string }) {
  const id = Number(taskId);
  const status = ['todo', 'in-progress', 'done'].includes(data.status) ? data.status as Task['status'] : 'todo';

  try {
    await tasksStore.updateTask(id, { ...data, status });
    success('Task updated successfully');
  } catch {
    error('Failed to update task');
  }
}


// -------------------------
// Drag & Drop / Reorder
// -------------------------
async function handleTaskMoved(taskId: string | number, newStatus: string, newOrder: number) {
  const id = Number(taskId);
  const movedTask = projectTasks.value.find(t => t.id === id);
  if (!movedTask) return error('Task not found');

  // привести newStatus до Task['status'] безпечним способом
  if (!['todo', 'in-progress', 'done'].includes(newStatus)) return;
  const status = newStatus as Task['status'];

  if (movedTask.status === status && movedTask.order === newOrder) return;

  const updatePromises: Promise<Task>[] = [];

  // Update moved task
  updatePromises.push(tasksStore.updateTask(id, { status, order: newOrder }));

  // Reorder new column
  const tasksInNewStatus = projectTasks.value
    .filter(t => t.status === status && t.id !== id)
    .sort((a, b) => a.order - b.order);

  tasksInNewStatus.forEach((t, index) => {
    const calculatedOrder = index >= newOrder ? index + 1 : index;
    if (t.order !== calculatedOrder) updatePromises.push(tasksStore.updateTask(Number(t.id), { order: calculatedOrder }));
  });

  // Reorder old column if changed status
  if (movedTask.status !== status) {
    const tasksInOldStatus = projectTasks.value
      .filter(t => t.status === movedTask.status && t.id !== id)
      .sort((a, b) => a.order - b.order);
    tasksInOldStatus.forEach((t, index) => {
      if (t.order !== index) updatePromises.push(tasksStore.updateTask(Number(t.id), { order: index }));
    });
  }

  try {
    await Promise.all(updatePromises);
    success('Task moved successfully');
  } catch {
    error('Failed to move task');
  }
}


// -------------------------
// Table task order update
// -------------------------
async function handleUpdateTaskOrder(tasks: Task[]) {
  const promises = tasks.map((t, index) => {
    if (t.order !== index) return tasksStore.updateTask(Number(t.id), { order: index });
    return Promise.resolve(t);
  });

  try {
    await Promise.all(promises);
    success('Task order updated');
  } catch {
    error('Failed to update task order');
  }
}
</script>
