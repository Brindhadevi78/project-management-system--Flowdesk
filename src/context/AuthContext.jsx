import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('pms_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    // Validate token against the server
    api.me()
      .then(u => {
        if (u && u.id) setUser(u);
        else {
          localStorage.removeItem('pms_token');
          setUser(null);
        }
      })
      .catch(() => {
        // Server down or token invalid — clear it and show login
        localStorage.removeItem('pms_token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { token, user } = await api.login(email, password);
    localStorage.setItem('pms_token', token);
    setUser(user);
  };

  const register = async (email, password, name) => {
    const { token, user } = await api.register(email, password, name);
    localStorage.setItem('pms_token', token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('pms_token');
    setUser(null);
  };

  const updateProfile = async (data) => {
    const updated = await api.updateProfile(data);
    setUser(updated);
    return updated;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
