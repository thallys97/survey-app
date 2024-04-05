import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const Home = () => {
  const { user, login } = useContext(AuthContext);

  return (
    <div>
      {user ? (
        <p>Bem-vindo, {user.displayName}!</p>
      ) : (
    
        <button onClick={login}>Login com Google</button>
      )}
    </div>
  );
};

export default Home;
