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

  return (
    <div>
      <h1>Dashboard</h1>
      {user && <p>Welcome, {user.displayName}!</p>}
      <button onClick={handleCreateSurvey}>Criar survey</button>
      <button onClick={handleRespondToSurvey}>Checar surveys abertas</button>
      <LogoutButton />
    </div>
  );
};

export default Dashboard;