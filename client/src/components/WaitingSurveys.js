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

  const surveyListContent = waitingSurveys.length > 0 ? (
    waitingSurveys.map((survey) => (
      <button
        key={survey._id}
        onClick={() => handleSelectSurvey(survey._id)}
        className="block w-full text-left px-4 py-2 mb-2 bg-blue-100 rounded hover:bg-blue-200 focus:outline-none focus:bg-blue-300 transition duration-300"
      >
        {survey.title}
      </button>
    ))
  ) : (
    <p className="text-gray-700">Não tem surveys em espera.</p>
  );

  if (selectedSurvey) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4">
            <h2 className="text-xl font-bold text-center mb-4">{selectedSurvey.title}</h2>
            <div className="space-y-3">
              {selectedSurvey.questions.map((question, index) => (
                <div key={index} className="text-left">
                  <h4 className="text-lg font-medium">{question.text}</h4>
                  <ul className="my-2 list-disc list-inside">
                    {question.choices.map((choice, choiceIndex) => (
                      <li key={choiceIndex} className="text-gray-700">{choice}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-evenly py-4 bg-gray-100">
            <button onClick={handleBackToList} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition duration-300">
              Voltar
            </button>
            <button onClick={() => handlePublishSurvey(selectedSurvey._id)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300">
              Publicar
            </button>
            <button onClick={() => handleDeleteSurvey(selectedSurvey._id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300">
              Apagar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Surveys em Espera</h2>
        <DashboardButton />
        <div className="mt-4">
          {surveyListContent}
        </div>
      </div>
    </div>
  );
};

export default WaitingSurveys;
