import axios from 'axios';

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, ''),
  timeout: 10000,
});

api.interceptors.request.use((request) => {
  const token = localStorage.getItem('admin_token');
  if (token) request.headers.Authorization = `Bearer ${token}`;
  return request;
});

export default api;
