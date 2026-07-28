import axios from 'axios';

const reportApi = axios.create({
  baseURL: '/api/reports',
  timeout: 10000,
});

export const getReports = async () => {
  return reportApi.get('/');
};
