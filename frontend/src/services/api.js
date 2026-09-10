import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global Error Interception without hard redirect loops
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error for debugging, but don't kick user out to login page in demo mode
    if (error.response && error.response.status === 401) {
      console.warn('Backend API returned 401 Unauthorized:', error.config?.url);
    }
    return Promise.reject(error);
  }
);

export default api;
