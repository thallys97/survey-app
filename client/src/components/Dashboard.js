import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import LogoutButton from './LogoutButton';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h1>Dashboard</h1>
      {user && <p>Welcome, {user.displayName}!</p>}
      <LogoutButton />
    </div>
  );
};

export default Dashboard;