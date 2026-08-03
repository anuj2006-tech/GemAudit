import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const authApi = axios.create({
  baseURL: `${API_BASE_URL}/api/auth`,
  timeout: 10000,
});

export const loginUser = async (payload) => {
  return authApi.post('/login', payload);
};

export const logoutUser = async () => {
  return authApi.post('/logout');
};
