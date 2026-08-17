# Task Management System

A full-stack Task Management System that allows users to manage projects and tasks through a modern web interface.

The application consists of a **Next.js frontend** and a **NestJS backend**, organized in a single repository.

## 🚀 Features

### Task Management

- Create tasks
- View tasks
- Edit tasks
- Delete tasks
- View task details
- Manage task information through an interactive dashboard

### Project Management

- Create projects
- View projects
- Update project information
- Manage tasks within projects

### User Interface

- Modern responsive interface
- Dashboard for managing tasks
- Project management page
- Login page
- Task creation modal
- Task editing modal
- Task details modal
- Theme and color mode controls

## 🛠️ Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- CSS

### Backend

- NestJS
- TypeScript
- Node.js

## 📁 Project Structure

```text
task-management-system/
│
├── frontend/
│   ├── app/
│   │   ├── dashboard/
│   │   ├── login/
│   │   ├── projects/
│   │   ├── globals.css
│   │   └── layout.tsx
│   │
│   ├── components/
│   │   └── tasks/
│   │       ├── AddTaskModal.tsx
│   │       ├── EditTaskModal.tsx
│   │       ├── TaskDetailsModal.tsx
│   │       ├── ThemeToggle.tsx
│   │       └── ColorMode.tsx
│   │
│   ├── lib/
│   │   ├── api.ts
│   │   └── auth.ts
│   │
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── database/
│   │   ├── projects/
│   │   ├── tasks/
│   │   ├── app.module.ts
│   │   └── main.ts
│   │
│   ├── test/
│   └── package.json
│
└── .gitignore
```

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/Luffy992/task-management-system.git
```

Navigate to the project directory:

```bash
cd task-management-system
```

## 🖥️ Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will typically run on:

```text
http://localhost:3000
```

## ⚙️ Backend Setup

Open a new terminal and navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create the required environment configuration if needed.

Example:

```env
PORT=3001
```

Start the backend:

```bash
npm run start:dev
```

The backend will typically run on:

```text
http://localhost:3001
```

## 🔌 API Integration

The frontend communicates with the NestJS backend through API requests.

The main backend modules include:

### Authentication

Handles application authentication functionality.

### Projects

Provides functionality for:

- Creating projects
- Retrieving projects
- Updating projects
- Managing project-related data

### Tasks

Provides functionality for:

- Creating tasks
- Retrieving tasks
- Updating tasks
- Deleting tasks

## 🧩 Main Components

The frontend includes reusable task-related components:

- `AddTaskModal`
- `EditTaskModal`
- `TaskDetailsModal`
- `ThemeToggle`
- `ColorMode`

These components help organize the user interface and improve code reusability.

## 📸 Screenshots

Screenshots of the application can be added here.

### Dashboard

![Dashboard Screenshot](./screenshots/dashboard.png)

### Projects

![Projects Screenshot](./screenshots/projects.png)

### Task Management

![Task Management Screenshot](./screenshots/tasks.png)

> Add screenshots to a `screenshots` folder in the root directory before using these image links.

## 🔮 Future Improvements

Possible improvements include:

- User registration
- JWT authentication
- Role-based access control
- Task priority levels
- Task deadlines
- Task status tracking
- Search and filtering
- Pagination
- Notifications
- Drag-and-drop task management
- Deployment

## 👨‍💻 Author

**Somesh**

GitHub: [Luffy992](https://github.com/Luffy992)

## 📄 License

This project is created for learning, development, and internship assignment purposes.
