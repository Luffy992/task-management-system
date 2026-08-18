# 🚀 Task Management System

A modern, full-stack **Task Management System** designed to help users organize, track, and manage tasks efficiently.

The application provides an intuitive workspace where tasks can be created, updated, filtered, searched, organized by status, and managed through a clean dashboard interface.

The project follows a modern full-stack architecture with a separate frontend and backend, RESTful API communication, validation, and production deployment.

## 🌐 Live Demo

🔗 **Frontend:**  
https://task-management-frontend-g4in.onrender.com

🔗 **Backend API:**  
https://task-management-system-1v9v.onrender.com

---

## 📸 Preview

<!-- Add screenshots to the screenshots folder and update the paths below -->

### Dashboard

![Task Management Dashboard](./screenshots/dashboard.png)

### Task Management Board

![Task Management Board](./screenshots/task-board.png)

---

## ✨ Features

### 📋 Task Management

- Create new tasks
- View existing tasks
- Update task details
- Delete tasks
- Organize tasks by workflow status
- Manage task priorities
- Add due dates
- Assign members
- Add labels to tasks

### 📊 Task Organization

Tasks are organized into different workflow stages:

- 📝 **To Do**
- ⚡ **Doing**
- ✅ **Completed**

### 🔍 Search & Filtering

- Search tasks
- Filter tasks
- Organize tasks based on available fields
- Easily navigate and manage large numbers of tasks

### 🎨 User Interface

- Clean and modern dashboard
- Responsive layout
- Task board interface
- Table-based task organization
- Light/Dark mode support

### 🔗 Frontend–Backend Integration

- RESTful API communication
- Cross-Origin Resource Sharing (CORS) configuration
- Environment-based configuration
- Production-ready deployment

---

# 🛠️ Tech Stack

## Frontend

- **React**
- **TypeScript**
- **HTML5**
- **CSS**
- REST API Integration

## Backend

- **NestJS**
- **Node.js**
- **TypeScript**
- RESTful APIs
- ValidationPipe
- CORS

## Deployment

- **Render**

---

# 🏗️ Architecture

The application follows a separated frontend and backend architecture.

```text
                    ┌─────────────────────┐
                    │      Frontend       │
                    │   React + TypeScript│
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │       Backend       │
                    │ NestJS + TypeScript │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Database       │
                    └─────────────────────┘
