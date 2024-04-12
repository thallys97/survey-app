// Em algum lugar no topo do seu componente, junto aos outros imports
import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
// import { useNavigate } from 'react-router-dom';
import DashboardButton from './DashboardButton';
import ErrorMessage from './ErrorMessage';

const SurveyResponder = () => {
  const [surveysList, setSurveysList] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // const navigate = useNavigate();

  

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
        const response = await axiosInstance.get('/api/surveys/open');
        setSurveysList(response.data); // Assumindo que o backend envia as surveys abertas na resposta
      } catch (error) {
        console.error('Erro ao buscar surveys', error);
      }
      setLoading(false);
    };

    fetchSurveys();
  }, []);

  const handleCloseSurvey = async (surveyId) => {
    try {
      await axiosInstance.put(`/api/surveys/close/${surveyId}`);
      // Atualize a lista de surveys para remover a survey fechada
      const updatedSurveysList = surveysList.filter(survey => survey._id !== surveyId);
      setSurveysList(updatedSurveysList);
    } catch (error) {
      console.error('Erro ao fechar survey', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form action
    if (!isSurveyComplete()) {
      setError('Por favor, responda a todas as perguntas antes de enviar o survey.');
      
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

  const handleCancel = () => {
    setSelectedSurvey(null);
    setAnswers({});
    // navigate('/dashboard'); // Use o useNavigate para redirecionar
  };

  

  if (selectedSurvey) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <ErrorMessage message={error} visible={!!error} onClose={() => setError('')} />
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-6">{selectedSurvey.title}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {selectedSurvey.questions.map((question) => (
              <div key={question._id} className="text-gray-700">
                <p className="font-semibold mb-2">{question.text}</p>
                <div className="flex flex-col">
                  {question.choices.map((choice) => (
                    <label key={choice} className="flex items-center my-2">
                      <input
                        type="radio"
                        className="form-radio text-indigo-600"
                        name={question._id}
                        value={choice}
                        onChange={() => handleAnswerChange(question._id, choice)}
                        checked={answers[question._id] === choice}
                      />
                      <span className="ml-3">{choice}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex justify-center mt-6 space-x-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded shadow"
                onClick={handleCancel}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded shadow"
                // disabled={!isSurveyComplete()} // Disable button if not all questions are answered
              >
                Submeter
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const renderSurveysList = () => {
    if (loading) return <div className="text-center text-lg">Carregando...</div>;
    
    if (surveysList.length === 0) return <div className="text-center text-lg">Nenhuma survey disponível para resposta.</div>;

    return surveysList.map((survey) => (
      <div key={survey._id} className="flex flex-col items-center mb-4">
        <button
          onClick={() => selectSurvey(survey._id)}
          className="text-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-6 py-2 rounded-lg shadow my-2 w-full text-center"
        >
          {survey.title}
        </button>
        <span className="text-sm text-gray-600">{`Quantidade de vezes respondida: ${survey.responsesCount}`}</span>
        <button
          onClick={() => handleCloseSurvey(survey._id)}
          className="text-white bg-red-500 hover:bg-red-600 rounded-lg shadow px-4 py-2 my-2"
        >
          Fechar Survey
        </button>
      </div>
    ));
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100 px-4">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow p-6">
        <DashboardButton />
        <h2 className="text-2xl font-bold text-center mb-6">Surveys Disponíveis</h2>
        <div className="mt-6">
          {renderSurveysList()}
        </div>
      </div>
    </div>
  );


};

export default SurveyResponder;
