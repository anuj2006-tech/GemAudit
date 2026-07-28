import axios from 'axios';

const authApi = axios.create({
  baseURL: '/api/auth',
  timeout: 10000,
});

export const loginUser = async (payload) => {
  return authApi.post('/login', payload);
};

export const logoutUser = async () => {
  return authApi.post('/logout');
};
