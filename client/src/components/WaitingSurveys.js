import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import DashboardButton from './DashboardButton';

const WaitingSurveys = () => {
  const [waitingSurveys, setWaitingSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null); // Estado para a survey selecionada

  useEffect(() => {
    const fetchWaitingSurveys = async () => {
      try {
        const response = await axiosInstance.get('/api/surveys/waiting');
        setWaitingSurveys(response.data);
      } catch (error) {
        console.error("Error fetching waiting surveys: ", error);
      }
    };

    fetchWaitingSurveys();
  }, []);

  const handleSelectSurvey = async (surveyId) => {
    try {
      const response = await axiosInstance.get(`/api/surveys/${surveyId}`);
      setSelectedSurvey(response.data);
    } catch (error) {
      console.error("Error selecting survey: ", error);
    }
  };

  const handleBackToList = () => {
    setSelectedSurvey(null);
  };

  const handlePublishSurvey = async (surveyId) => {
    try {
      await axiosInstance.put(`/api/surveys/open/${surveyId}`);
      setWaitingSurveys(waitingSurveys.filter(survey => survey._id !== surveyId));
      setSelectedSurvey(null);
    } catch (error) {
      console.error("Error publishing survey: ", error);
    }
  };

  const handleDeleteSurvey = async (surveyId) => {
    try {
      await axiosInstance.delete(`/api/surveys/${surveyId}`);
      setWaitingSurveys(waitingSurveys.filter(survey => survey._id !== surveyId));
      setSelectedSurvey(null);
    } catch (error) {
      console.error("Error deleting survey: ", error);
    }
  };

  if (selectedSurvey) {
    return (
      <div>
        <h2>{selectedSurvey.title}</h2>
        {selectedSurvey.questions.map((question, index) => (
          <div key={index}>
            <p>{question.text}</p>
            {question.choices.map((choice, choiceIndex) => (
              <p key={choiceIndex}>{choice}</p>
            ))}
          </div>
        ))}
        <button onClick={handleBackToList}>Voltar</button>
        <button onClick={() => handlePublishSurvey(selectedSurvey._id)}>Publicar</button>
        <button onClick={() => handleDeleteSurvey(selectedSurvey._id)}>Apagar</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Surveys em Espera</h2>
      <DashboardButton />
      <ul>
        {waitingSurveys.map((survey) => (
          <li key={survey._id} onClick={() => handleSelectSurvey(survey._id)}>{survey.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default WaitingSurveys;
