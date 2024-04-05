import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import LogoutButton from './LogoutButton';

const Home = () => {
  const { user, login } = useContext(AuthContext);

  return (
    <div>
      {user ? (
        <>
          <p>Bem-vindo, {user.displayName}!</p>
          <LogoutButton /> {/* Renderize o LogoutButton se o usuário estiver logado */}
        </>
      ) : (
        <button onClick={login}>Login com Google</button>
      )}
    </div>
  );
};

export default Home;
