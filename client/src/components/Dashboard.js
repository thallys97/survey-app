
import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import LogoutButton from './LogoutButton';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  window.location.reload();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Função para navegar entre rotas
  const handleNavigation = (path) => {
    navigate(path);
  };

  // Renderiza o dashboard apenas se o usuário estiver definido
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Dashboard</h1>
          {user && <p className="mb-6">Bem-vindo, {user.displayName}!</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {user.role !== 'SurveyRespondent' && (
            <>   
              <button onClick={() => handleNavigation('/create-survey')} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 font-bold">Criar Survey</button>   
              <button onClick={() => handleNavigation('/waiting-surveys')} className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300 font-bold">Surveys em Espera</button>
            </>  
          ) }
            <button onClick={() => handleNavigation('/respond-survey')} className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition duration-300 font-bold">Checar Surveys Abertas</button>
            <button onClick={() => handleNavigation('/responded-surveys')} className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition duration-300 font-bold">Checar Resultados de Surveys</button>
          </div>
          {user.role === 'SurveyAdmin' && (
            <button onClick={() => handleNavigation('/user-management')} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300 font-bold">Gerenciar Usuários</button>
          )}
          <div className="mt-4">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;