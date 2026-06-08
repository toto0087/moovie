import axios from 'axios';

export const TOKEN_KEY = 'moovi-token';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      const isPublic = ['/', '/sign-in', '/join-us'].includes(window.location.pathname);
      if (!isPublic) {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
