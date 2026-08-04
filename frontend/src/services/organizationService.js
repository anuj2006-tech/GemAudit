import api from './api';

// --- User Management ---
export const getUsers = async () => {
  return api.get('/api/org/users');
};

export const createUser = async (payload) => {
  return api.post('/api/org/users', payload);
};

export const updateUser = async (id, payload) => {
  return api.put(`/api/org/users/${id}`, payload);
};

export const deleteUser = async (id) => {
  return api.delete(`/api/org/users/${id}`);
};

// --- Departments ---
export const getDepartments = async () => {
  return api.get('/api/org/departments');
};

export const createDepartment = async (payload) => {
  return api.post('/api/org/departments', payload);
};

export const deleteDepartment = async (id) => {
  return api.delete(`/api/org/departments/${id}`);
};

// --- Company Profile / Settings ---
export const getCompanySettings = async () => {
  return api.get('/api/org/settings');
};

export const updateCompanySettings = async (payload) => {
  return api.put('/api/org/settings', payload);
};

// --- Billing ---
export const getSubscription = async () => {
  return api.get('/api/billing/subscription');
};

export const getInvoices = async () => {
  return api.get('/api/billing/invoices');
};

export const upgradeSubscription = async (planName) => {
  return api.post('/api/billing/upgrade', { planName });
};
