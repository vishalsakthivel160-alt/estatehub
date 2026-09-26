import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL || 'https://estatehub-1gip.vercel.app/api';
const cleanUrl = rawApiUrl.replace(/\/+$/, '');
// Ensure /api path prefix is attached if omitted in VITE_API_URL
const API_URL = cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;

const api = axios.create({
  baseURL: API_URL,
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('estatehub_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('estatehub_token');
      localStorage.removeItem('estatehub_user');
    }
    return Promise.reject(error);
  }
);

export const BASE_SERVER_URL = API_URL.endsWith('/api')
  ? API_URL.substring(0, API_URL.length - 4)
  : API_URL;

export default api;
