import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// ---------- Auth ----------

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

export async function login(password) {
  const response = await api.post('/auth/login', { password });
  return response.data;
}

// ---------- Todos ----------

export async function getTodos() {
  const response = await api.get('/todos');
  return response.data;
}

export async function createTodo(text) {
  const response = await api.post('/todos', { text });
  return response.data;
}

export async function updateTodo(id, updates) {
  const response = await api.patch(`/todos/${id}`, updates);
  return response.data;
}

export async function deleteTodo(id) {
  const response = await api.delete(`/todos/${id}`);
  return response.data;
}

export default api;
