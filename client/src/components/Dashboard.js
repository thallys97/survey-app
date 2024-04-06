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

  return (
    <div>
      <h1>Dashboard</h1>
      {user && <p>Welcome, {user.displayName}!</p>}
      <button onClick={handleCreateSurvey}>Criar Survey</button>
      <LogoutButton />
    </div>
  );
};

export default Dashboard;