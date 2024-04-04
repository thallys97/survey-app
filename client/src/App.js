//import logo from './logo.svg';
import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import authService from './services/authService';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
// Importe outros componentes e serviços conforme necessário

const App = () => {
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await authService.fetchCurrentUser();
      if (user) {
        console.log('Usuário autenticado:', user);
        // Redirecione ou atualize o estado do aplicativo conforme necessário
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Outras rotas... */}
      </Routes>
    </Router>
  );
};

export default App;