import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import { useLocation } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  
  
  useEffect(() => {
    
    const location = useLocation();
    const extractToken = () => {
      const query = new URLSearchParams(location.search);
      console.log(query);
      console.log(query.get('token'));
      return query.get('token');
    };
  
    const initializeAuth = async () => {
      const token = extractToken();
      if (token) {
        localStorage.setItem('token', token);
        const validatedUser = await authService.validateToken(token);
        if (validatedUser) {
          setUser(validatedUser);
        } else {
          console.error("Token validation failed");
        }
      } else {
        // Só tenta buscar o usuário se não estiver lidando com um novo token
        if (localStorage.getItem('token')) {
          try {
            const fetchedUser = await authService.fetchCurrentUser();
            setUser(fetchedUser);
          } catch (error) {
            console.error('Error fetching current user', error);
          }
        }
      }
      setLoading(false);
    };
  
    initializeAuth();
  }, [location]);

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
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};