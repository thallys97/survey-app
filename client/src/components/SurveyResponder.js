// Em algum lugar no topo do seu componente, junto aos outros imports
import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const SurveyResponder = () => {
  const [surveysList, setSurveysList] = useState([]);
  const [loading, setLoading] = useState(true);
  // State para a survey selecionada e suas perguntas
const [selectedSurvey, setSelectedSurvey] = useState(null);
const [answers, setAnswers] = useState({});

const selectSurvey = async (surveyId) => {
  try {
    const response = await axiosInstance.get(`/api/surveys/${surveyId}`);
    setSelectedSurvey(response.data);
    setAnswers(
      response.data.questions.reduce((acc, question) => {
        acc[question._id] = '';
        return acc;
      }, {})
    );
  } catch (error) {
    console.error('Erro ao selecionar survey', error);
  }
};

const handleAnswerChange = (questionId, choice) => {
  setAnswers({ ...answers, [questionId]: choice });
};

const isSurveyComplete = () => {
  return Object.values(answers).every((answer) => answer !== '');
};

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

  const handleSubmit = async () => {
    if (!isSurveyComplete()) {
      alert('Por favor, responda a todas as perguntas antes de submeter.');
      return;
    }
  
    try {
      const response = await axiosInstance.post('/api/surveys/response', {
        surveyId: selectedSurvey._id,
        responses: answers
      });
      console.log(response.data);
      // Aqui você pode redirecionar para uma página de agradecimento ou exibir uma mensagem de sucesso.
    } catch (error) {
      console.error('Erro ao submeter respostas', error);
    }
  };

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
