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

export function login(password) {
  return api.post('/auth/login', { password });
}

// ---------- Todos ----------

export function getTodos() {
  return api.get('/todos');
}

export function createTodo(text) {
  return api.post('/todos', { text });
}

export function updateTodo(id, updates) {
  return api.patch(`/todos/${id}`, updates);
}

export function deleteTodo(id) {
  return api.delete(`/todos/${id}`);
}

export default api;
