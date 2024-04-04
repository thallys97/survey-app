//import logo from './logo.svg';
import './App.css';
import React, { useEffect } from 'react';
import authService from './services/authService';
import Login from './components/Login';
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
    <div>
      <Login />
      {/* Outros componentes do seu aplicativo */}
    </div>
  );
};

export default App;