import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import LogoutButton from './LogoutButton';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCreateSurvey = () => {
    navigate('/create-survey');
  };

   
   const handleRespondToSurvey = () => {
    navigate('/respond-survey'); 
  };

  const handleWaitingSurveys = () => {
    navigate('/waiting-surveys');
  };

  const handleCheckSurveyResults = () => {
    navigate('/responded-surveys');
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {user && <p>Welcome, {user.displayName}!</p>}
      <button onClick={handleCreateSurvey}>Criar survey</button>
      <button onClick={handleWaitingSurveys}>Surveys em Espera</button>
      <button onClick={handleRespondToSurvey}>Checar surveys abertas</button>
      <button onClick={handleCheckSurveyResults}>Checar resultados de surveys</button>
      {user.role === 'SurveyAdmin' && (
        <button onClick={() => navigate('/user-management')} className="p-2 bg-blue-500 text-white rounded mt-4">
          Gerenciar Usuários
        </button>
      )}
      <LogoutButton />
    </div>
  );
};

export default Dashboard;