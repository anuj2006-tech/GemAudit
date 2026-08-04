import api from './api';

export const askAI = async (question, sessionId = null) => {
  return api.post('/api/ai/query', { question, sessionId });
};

export const getHistory = async (sessionId) => {
  return api.get(`/api/ai/history/${sessionId}`);
};
