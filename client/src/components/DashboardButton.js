import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardButton = () => {
  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <button
      onClick={goToDashboard}
      className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800 transition duration-300"
    >
      Dashboard
    </button>
  );
};

export default DashboardButton;