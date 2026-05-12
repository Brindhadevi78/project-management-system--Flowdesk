const BASE = import.meta.env.VITE_API_URL ?? '/api';

function getToken() {
  return localStorage.getItem('pms_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  // Auth
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  register: (email, password, name) => request('/auth/register', { method: 'POST', body: { email, password, name } }),
  me: () => request('/auth/me'),
  updateProfile: (data) => request('/auth/profile', { method: 'PUT', body: data }),

  // Projects
  getProjects: () => request('/projects'),
  createProject: (data) => request('/projects', { method: 'POST', body: data }),
  updateProject: (id, data) => request(`/projects/${id}`, { method: 'PUT', body: data }),
  deleteProject: (id) => request(`/projects/${id}`, { method: 'DELETE' }),

  // Tasks
  getTasks: () => request('/tasks'),
  createTask: (data) => request('/tasks', { method: 'POST', body: data }),
  updateTask: (id, data) => request(`/tasks/${id}`, { method: 'PUT', body: data }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
};
