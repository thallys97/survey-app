import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService'; // Importe seu authService

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const fetchedUser = await authService.fetchCurrentUser();
      setUser(fetchedUser);
      setLoading(false);
    };

    fetchCurrentUser();
  }, []);

  // Use as funções do authService diretamente
  const login = authService.login;
  const logout = async () => {
    await authService.logout();
    setUser(null); // Atualize o estado do usuário no contexto
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};