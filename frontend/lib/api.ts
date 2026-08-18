const API_URL = 'https://task-management-system-1v9v.onrender.com';

export async function getTasks() {
  const response = await fetch(`${API_URL}/tasks`);

  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }

  return response.json();
}

export async function guestLogin() {
  const response = await fetch(`${API_URL}/auth/guest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Guest login failed');
  }

  return response.json();
}

export async function createTask(task: {
  title: string;
  description?: string;
  status?: 'TODO' | 'DOING' | 'COMPLETED' | 'ON_HOLD';
  priority?: 'NO_PRIORITY' | 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  dueDate?: string;
}) {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error('Failed to create task');
  }

  return response.json();
}

export async function updateTask(
  id: number,
  task: {
    title?: string;
    description?: string;
    status?: 'TODO' | 'DOING' | 'COMPLETED' | 'ON_HOLD';
    priority?: 'NO_PRIORITY' | 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
    dueDate?: string;
  },
) {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error('Failed to update task');
  }

  return response.json();
}

export async function deleteTask(id: number) {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete task');
  }

  return response.json();
}