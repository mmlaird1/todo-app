import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getTodos = () => api.get('/todos').then((res) => res.data);

export const createTodo = (text) =>
  api.post('/todos', { text }).then((res) => res.data);

export const updateTodo = (id, updates) =>
  api.patch(`/todos/${id}`, updates).then((res) => res.data);

export const deleteTodo = (id) =>
  api.delete(`/todos/${id}`).then((res) => res.data);
