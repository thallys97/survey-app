import React from 'react';
import authService from '../services/authService';

const Login = () => {
  const handleLogin = () => {
    authService.login();
  };

  return (
    <div>
      <button onClick={handleLogin}>Login com Google</button>
    </div>
  );
};

export default Login;
