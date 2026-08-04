import api from './api';

export const loginUser = async (payloadOrEmail, password) => {
  if (typeof payloadOrEmail === 'object' && payloadOrEmail !== null) {
    const { email, password: pwd } = payloadOrEmail;
    return api.post('/api/auth/login', { email, password: pwd });
  }
  return api.post('/api/auth/login', { email: payloadOrEmail, password });
};

export const logoutUser = async () => {
  return api.post('/api/auth/logout');
};

export const registerCompany = async (registrationData) => {
  return api.post('/api/auth/register', registrationData);
};
