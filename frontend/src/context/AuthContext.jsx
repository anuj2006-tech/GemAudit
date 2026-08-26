import { createContext, useContext, useMemo, useState } from 'react';
import { loginUser } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('auth_user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem('auth_role') || null;
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
      console.error('Login request failed:', error);
      throw error;
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
