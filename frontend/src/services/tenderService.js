import api from './api';

export const getTenders = async () => {
  return api.get('/api/tenders');
};

export const getTenderById = async (id) => {
  return api.get(`/api/tenders/${id}`);
};

export const createTender = async (payload) => {
  return api.post('/api/tenders', payload);
};

export const updateTender = async (id, payload) => {
  return api.put(`/api/tenders/${id}`, payload);
};

export const deleteTender = async (id) => {
  return api.delete(`/api/tenders/${id}`);
};
