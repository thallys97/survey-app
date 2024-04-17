import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const fetchCurrentUser = async () => {
        const fetchedUser = await authService.fetchCurrentUser();
        setUser(fetchedUser);
        setLoading(false);
      };

      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);


  const login = () => {
    authService.login();
  };

  const logout = async () => {
    //await authService.logout();
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/';
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};