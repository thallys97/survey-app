// Em algum lugar no topo do seu componente, junto aos outros imports
import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const SurveyResponder = () => {
  const [surveysList, setSurveysList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurveys = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/api/surveys');
        setSurveysList(response.data); // Assumindo que o backend envia as surveys abertas na resposta
      } catch (error) {
        console.error('Erro ao buscar surveys', error);
      }
      setLoading(false);
    };

    fetchSurveys();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      {/* Exibir surveys aqui */}
    </div>
  );
};

export default SurveyResponder;
