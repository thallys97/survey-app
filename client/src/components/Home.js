import React, { useContext } from 'react';
import authService from '../services/authService';
import LogoutButton from './LogoutButton';
import DashboardButton from './DashboardButton';

const Home = () => {
  //const { user, login } = useContext(AuthContext);

  const login = () => {
    authService.login();
  };

  if (localStorage.getItem('token')) {
    const user = authService.validateToken();
  } else {
    const user = null;
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      {user ? (
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Bem-vindo, {user.displayName}!</h1>
          <DashboardButton />
          <LogoutButton />
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Bem-vindo, visitante!</h1>
          <button
            onClick={login}
            className="text-white bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Login com Google
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
