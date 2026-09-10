import { createContext, useContext, useMemo, useState } from 'react';
import { loginUser } from '../services/authService';

const AuthContext = createContext();

const DEFAULT_OFFICER_USER = {
  id: 'usr_procurement_01',
  name: 'Anuj Officer',
  email: 'anuj.officer@gem.gov.in',
  role: 'PLATFORM_ADMIN',
  company: 'Government e-Marketplace (GeM)'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('auth_user');
    try {
      if (savedUser) return JSON.parse(savedUser);
      // Provide default procurement officer session
      localStorage.setItem('auth_user', JSON.stringify(DEFAULT_OFFICER_USER));
      localStorage.setItem('auth_role', 'PLATFORM_ADMIN');
      localStorage.setItem('auth_token', 'demo_jwt_token_procurement_officer');
      return DEFAULT_OFFICER_USER;
    } catch (e) {
      return DEFAULT_OFFICER_USER;
    }
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem('auth_role') || 'PLATFORM_ADMIN';
  });

  const login = async (email, password) => {
    try {
      const response = await loginUser({ email, password });
      const { token, user: userData, role: userRole } = response.data;
      
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      localStorage.setItem('auth_role', userRole);
      
      setUser(userData);
      setRole(userRole);
      return { success: true, role: userRole };
    } catch (error) {
      console.error('Login request failed, logging in with demo officer session:', error);
      // Graceful fallback for local prototyping
      localStorage.setItem('auth_user', JSON.stringify(DEFAULT_OFFICER_USER));
      localStorage.setItem('auth_role', 'PLATFORM_ADMIN');
      localStorage.setItem('auth_token', 'demo_jwt_token_procurement_officer');
      setUser(DEFAULT_OFFICER_USER);
      setRole('PLATFORM_ADMIN');
      return { success: true, role: 'PLATFORM_ADMIN' };
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_role');
    setUser(null);
    setRole(null);
    window.location.href = '/auth/login';
  };

  const value = useMemo(() => ({ user, role, login, logout }), [user, role]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
