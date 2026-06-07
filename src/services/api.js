import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('moovi-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Only redirect on 401 if there was a token (expired/invalid), not for public endpoints
    if (err.response?.status === 401 && localStorage.getItem('moovi-token')) {
      localStorage.removeItem('moovi-token');
      window.location.href = '/';
    }
    return Promise.reject(err);
  },
);

export default api;
