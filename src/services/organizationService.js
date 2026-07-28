import axios from 'axios';

const organizationApi = axios.create({
  baseURL: '/api/organizations',
  timeout: 10000,
});

export const getOrganizations = async () => {
  return organizationApi.get('/');
};
