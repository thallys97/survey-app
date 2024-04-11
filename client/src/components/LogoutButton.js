import React from 'react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/');
    window.location.reload();
  };

  return (
    <button
      onClick={handleLogout}
      className="text-white bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
