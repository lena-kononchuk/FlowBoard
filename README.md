# FlowBoard

Modern project and task management application with intuitive kanban board and table views. Built with Vue 3, TypeScript, and Pinia for efficient task organization.

🔗 **[Live Demo](https://lena-kononchuk.github.io/FlowBoard/)**

## Features

- 📊 **Project Management** - Create and organize multiple projects
- ✅ **Task Tracking** - Add, edit, and manage tasks within projects
- 📋 **Dual View Modes**
  - **Kanban Board** - Visual drag-and-drop interface
  - **Table View** - Sortable list with quick actions
- 🎯 **Drag & Drop** - Intuitive task reordering and status changes
- 🏷️ **Task Statuses** - Todo, In Progress, Done
- 💾 **Local Storage** - Automatic data persistence
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🎨 **Clean UI** - Modern interface with FontAwesome icons

## Tech Stack

- **Vue 3** - Composition API
- **TypeScript** - Type-safe development
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **Vite** - Fast build tool and dev server
- **SCSS** - Advanced styling with variables
- **vuedraggable** - Drag and drop functionality
- **Flexboxgrid** - Responsive grid system

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/lena-kononchuk/FlowBoard.git
cd FlowBoard

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## Build for Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

```bash
# Deploy to GitHub Pages
npm run deploy
```

## Project Structure

```
FlowBoard/
├── src/
│   ├── api/              # API service layer
│   ├── components/       # Vue components
│   │   ├── common/       # Shared components (Header, Notification)
│   │   ├── projects/     # Project-related components
│   │   └── tasks/        # Task components (Modal, Column, Table)
│   ├── composables/      # Reusable composition functions
│   ├── router/           # Vue Router configuration
│   ├── stores/           # Pinia state stores
│   │   ├── projects.store.ts
│   │   └── tasks.store.ts
│   ├── styles/           # Global SCSS styles
│   ├── types/            # TypeScript type definitions
│   ├── views/            # Page components
│   │   ├── ProjectsList.vue
│   │   └── ProjectDetail.vue
│   ├── App.vue
│   └── main.ts
├── public/               # Static assets
└── vite.config.ts        # Vite configuration
```

## Key Features Explained

### Project Management
- Create projects with names and descriptions
- Track project status (Planned, Pending, Active, Completed)
- View task count per project
- Navigate to detailed project view

### Task Views

**Kanban Board:**
- Visual columns for each status (Todo, In Progress, Done)
- Drag tasks between columns to change status
- Drag within columns to reorder
- Add tasks directly to specific columns
- Task count per column

**Table View:**
- List all tasks in a sortable table
- Quick inline editing
- Bulk actions
- Status updates

### Task Management
- Create tasks with:
  - Name (3-120 characters)
  - Description
  - Assignee selection
  - Status
  - Due date (with validation)
- Edit existing tasks
- Delete tasks
- Automatic task ordering

### Data Persistence
- All data stored in browser's localStorage
- Automatic save on every change
- Data persists across sessions
- No backend required

## Scripts

- `npm run dev` - Start development server (port 5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run deploy` - Deploy to GitHub Pages

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

---

**Note:** This is an educational project created for learning Vue 3, TypeScript, and modern web development practices.
