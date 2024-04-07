import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../api/axiosInstance';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user.role === 'SurveyAdmin') {
      fetchUsers();
    } else {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários', error);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axiosInstance.put(`/api/users/${userId}/role`, { role: newRole });
      fetchUsers(); // Refresh the list of users
    } catch (error) {
      console.error('Erro ao atualizar role do usuário', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <input
        type="text"
        placeholder="Procurar usuário"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 mb-4"
      />
      <ul>
        {users
          .filter((u) => u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) && u._id !== user._id)
          .map((u) => (
            <li key={u._id} className="mb-2">
              {u.displayName} - {u.role}
              <button onClick={() => handleRoleChange(u._id, 'SurveyCoordinator')} className="ml-2">
                Tornar Coordenador
              </button>
              <button onClick={() => handleRoleChange(u._id, 'SurveyRespondent')} className="ml-2">
                Tornar Respondente
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default UserManagement;