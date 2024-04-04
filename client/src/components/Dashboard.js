import React from 'react';
import LogoutButton from './LogoutButton';

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <LogoutButton /> {/* Inclua o botão de logout */}
      {/* Restante do seu componente */}
    </div>
  );
};

export default Dashboard;