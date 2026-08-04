import api from './api';

export const getCompanies = async () => {
  return api.get('/api/platform/companies');
};

export const getCompanyAdmins = async () => {
  return api.get('/api/platform/admins');
};

export const getCompanyUsers = async () => {
  return api.get('/api/platform/users');
};

export const createCompanyAdmin = async (companyId, adminData) => {

  return api.post(`/api/platform/companies/${companyId}/admins`, adminData);
};

export const getPlatformAudits = async () => {
  return api.get('/api/platform/audits');
};

export const getPlans = async () => {
  return api.get('/api/platform/plans');
};
