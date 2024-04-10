import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService'; // Importe seu authService

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const fetchedUser = await authService.fetchCurrentUser();
        if (fetchedUser) {
          setUser(fetchedUser);
        }
      } catch (error) {
        console.error('Erro ao buscar o usuário atual', error);
      }
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