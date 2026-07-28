import axios from 'axios';

const userApi = axios.create({
  baseURL: '/api/users',
  timeout: 10000,
});

export const getUsers = async () => {
  return userApi.get('/');
};

export const getUserById = async (id) => {
  return userApi.get(`/${id}`);
};
