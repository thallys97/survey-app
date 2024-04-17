import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();  // Logout através do AuthContext
    //navigate('/');   // Redireciona para a página inicial após o logout
    //window.location.reload(); // Se necessário, descomente para forçar a recarga da página
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
