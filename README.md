# 🚀 Task Management System

A modern, full-stack **Task Management System** built to help users efficiently create, organize, track, search, filter, and manage their daily tasks.

The application provides a clean and intuitive workspace where tasks can be managed through different workflow stages, assigned priorities, due dates, labels, and members. It follows a separated frontend-backend architecture with RESTful API communication, request validation, environment-based configuration, and cloud deployment.

---

## 🌐 Live Demo

| Service        | Link                                                 |
| -------------- | ---------------------------------------------------- |
| 🖥️ Frontend   | `https://task-management-frontend-g4in.onrender.com` |
| ⚙️ Backend API | `https://task-management-system-1v9v.onrender.com`   |

> **Note:** The application is deployed on Render. If the service has been inactive, the first request may take a few moments while the server starts.

---

# ✨ Features

## 📋 Task Management

* Create new tasks
* View all existing tasks
* Update task information
* Delete tasks
* Manage task priorities
* Set task due dates
* Assign members to tasks
* Add labels and categories
* Organize tasks by workflow status

## 📊 Workflow Management

Tasks can be organized into different stages:

* 📝 **To Do**
* ⚡ **Doing**
* ✅ **Completed**

This makes it easier to track the progress of tasks from creation to completion.

## 🔍 Search and Filtering

* Search tasks quickly
* Filter tasks based on available fields
* Organize and manage large numbers of tasks
* Easily locate specific tasks

## 🎨 Modern User Interface

* Clean and intuitive dashboard
* Responsive user interface
* Task board and structured task views
* Light and Dark mode support
* User-friendly task management experience

## 🔗 Frontend–Backend Integration

* RESTful API communication
* Separate frontend and backend architecture
* Cross-Origin Resource Sharing (CORS) configuration
* Environment-based configuration
* Request validation
* Production deployment

---

# 🛠️ Tech Stack

## Frontend

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **HTML5**
* **CSS**
* REST API Integration

## Backend

* **NestJS**
* **Node.js**
* **TypeScript**
* **MySQL**
* **RESTful APIs**
* **class-validator**
* **class-transformer**
* **ValidationPipe**
* **CORS**

## Development & Testing

* **Jest**
* **ESLint**
* **Prettier**
* **TypeScript**

## Deployment

* **Render**

---

# 🏗️ System Architecture

The application follows a modern separated frontend-backend architecture.

```text
                        ┌─────────────────────────┐
                        │        Frontend         │
                        │                         │
                        │ Next.js + React + TS    │
                        └────────────┬────────────┘
                                     │
                                     │ HTTP / REST API
                                     ▼
                        ┌─────────────────────────┐
                        │        Backend          │
                        │                         │
                        │   NestJS + Node.js      │
                        └────────────┬────────────┘
                                     │
                                     │
                                     ▼
                        ┌─────────────────────────┐
                        │        Database         │
                        │                         │
                        │          MySQL          │
                        └─────────────────────────┘
```

---

# 📁 Project Structure

```text
task-management-system/
│
├── frontend/
│   ├── app/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── src/
│   ├── test/
│   ├── package.json
│   └── ...
│
├── screenshots/
│   ├── dashboard.png
│   ├── task-board.png
│   └── dark-mode.png
│
├── .gitignore
└── README.md
```

---

# ⚙️ Getting Started

Follow the steps below to run the project locally.

## Prerequisites

Make sure you have the following installed:

* **Node.js**
* **npm**
* **MySQL**

You can verify your Node.js and npm installation using:

```bash
node -v
npm -v
```

---

# 🖥️ Frontend Setup

### 1. Navigate to the frontend directory

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create an `.env.local` file in the `frontend` directory.

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

> Update the API URL according to your backend configuration.

### 4. Start the development server

```bash
npm run dev
```

The frontend application will start on the port configured by Next.js.

---

# ⚙️ Backend Setup

### 1. Navigate to the backend directory

```bash
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create an `.env` file inside the `backend` directory.

Example:

```env
PORT=3001

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=task_management
```

> Update the variable names and values to match your backend configuration.

### 4. Create the MySQL database

Create a database:

```sql
CREATE DATABASE task_management;
```

### 5. Start the backend

For development:

```bash
npm run start:dev
```

For production:

```bash
npm run build
npm run start:prod
```

---

# 🧪 Testing

The backend includes Jest testing support.

Run tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate test coverage:

```bash
npm run test:cov
```

Run end-to-end tests:

```bash
npm run test:e2e
```

---

# 🔌 API Communication

The frontend communicates with the backend using RESTful APIs.

Typical task operations include:

| Method          | Operation               |
| --------------- | ----------------------- |
| `GET`           | Retrieve tasks          |
| `POST`          | Create a new task       |
| `PATCH` / `PUT` | Update an existing task |
| `DELETE`        | Remove a task           |

The backend validates incoming requests before processing them to improve data consistency and reliability.

---

# 🌟 Key Highlights

* Full-stack application with separate frontend and backend
* Modern **Next.js + React + TypeScript** frontend
* Scalable **NestJS** backend architecture
* **MySQL** database integration
* RESTful API communication
* Task CRUD operations
* Search and filtering capabilities
* Workflow-based task organization
* Priority and due-date management
* Labels and task assignments
* Input validation
* CORS configuration
* Light and Dark mode
* Responsive user interface
* Jest testing support
* Production deployment on Render

---

# 🚀 Future Improvements

Some features that could be added in future versions include:

* [ ] User authentication and authorization
* [ ] JWT-based authentication
* [ ] Role-based access control
* [ ] User registration and login
* [ ] Drag-and-drop task management
* [ ] Real-time updates
* [ ] Email notifications
* [ ] File attachments
* [ ] Activity history
* [ ] Team and workspace management
* [ ] Advanced analytics dashboard
* [ ] Docker containerization
* [ ] CI/CD pipeline

---

# 🤝 Contributing

Contributions, issues, and feature suggestions are welcome.

If you would like to contribute:

1. Fork the repository.
2. Create a new branch.

```bash
git checkout -b feature/your-feature-name
```

3. Make your changes.
4. Commit your changes.

```bash
git commit -m "Add your feature"
```

5. Push the branch.

```bash
git push origin feature/your-feature-name
```

6. Open a Pull Request.

---

# 👨‍💻 Author

**Luffy**

Full-Stack Developer | JavaScript | TypeScript | React | Next.js | Node.js | NestJS

If you found this project useful, consider giving the repository a ⭐.

---

## 📄 License

This project is intended for educational and portfolio purposes.

---


### ⭐ Built to make task management simpler and more organized.

**Thank you for checking out this project!**

