import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../api/axiosInstance';
import DashboardButton from './DashboardButton';
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="container mx-auto p-4">
        <DashboardButton />
        <h1 className="text-3xl font-semibold text-center mb-6">Trocar cargo de usuário</h1>
        <input
          type="text"
          placeholder="Procurar usuário"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
        />
        <div className="mt-6">
          <ul className="space-y-4">
            {users
              .filter((u) => u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) && u._id !== user._id)
              .map((u) => (
                <li key={u._id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{u.displayName} - Cargo: {u.role}</span>
                    <div>
                      {u.role === 'SurveyRespondent' && (
                        <button
                          onClick={() => handleRoleChange(u._id, 'SurveyCoordinator')}
                          className="text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow px-4 py-2 mx-2"
                        >
                          Tornar Coordenador
                        </button>
                      )}             
                      {u.role === 'SurveyCoordinator' && (
                        <button
                          onClick={() => handleRoleChange(u._id, 'SurveyRespondent')}
                          className="text-white bg-green-500 hover:bg-green-600 rounded-lg shadow px-4 py-2 mx-2"
                        >
                          Tornar Respondente
                        </button>
                      )}
                    </div>
                  </div>      
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;