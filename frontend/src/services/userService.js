import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const userApi = axios.create({
  baseURL: `${API_BASE_URL}/api/users`,
  timeout: 10000,
});

// Interceptor to inject JWT token into requests
userApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const getUsers = async () => {
  return userApi.get('/');
};

export const getUserById = async (id) => {
  return userApi.get(`/${id}`);
};

export const getLegalAdmins = async () => {
  return userApi.get('/legal-admins');
};

export const createLegalAdmin = async (payload) => {
  return userApi.post('/legal-admin', payload);
};
