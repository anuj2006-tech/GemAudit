import axios from 'axios';

const tenderApi = axios.create({
  baseURL: '/api/tenders',
  timeout: 10000,
});

export const getTenders = async () => {
  return tenderApi.get('/');
};

export const getTenderById = async (id) => {
  return tenderApi.get(`/${id}`);
};
