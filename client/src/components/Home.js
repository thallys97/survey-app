import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import authService from '../services/authService';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import DashboardButton from './DashboardButton';

const Home = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const urlToken = urlParams.get('token');
    const localStorageToken = localStorage.getItem('token');

    const authenticateUser = async (token) => {
      const validatedUser = await authService.validateToken(token);
      if (validatedUser) {
        setUser(validatedUser);
        localStorage.setItem('token', token);
        window.history.replaceState({}, document.title, '/');
      } else {
        console.error("Token validation failed");
        localStorage.removeItem('token');
        navigate('/');
      }
    };

    if (urlToken) {
      authenticateUser(urlToken);
    } else if (localStorageToken) {
      authenticateUser(localStorageToken);
    }
  }, [location, navigate, setUser]);

  const handleLogin = () => {
    authService.login();
  };


  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      {user ? (
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Bem-vindo!</h1>
          <DashboardButton />
          <LogoutButton />
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Bem-vindo, visitante!</h1>
          <button
            onClick={handleLogin}
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
