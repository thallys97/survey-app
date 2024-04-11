import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const SurveyCreator = () => {
  const navigate = useNavigate(); // Inicializar useNavigate
  const [survey, setSurvey] = useState({
    title: '',
    questions: [{ text: '', choices: [''] }]
  });

  const handleTitleChange = (e) => {
    setSurvey({ ...survey, title: e.target.value });
  };

  const handleQuestionChange = (index, e) => {
    const newQuestions = [...survey.questions];
    newQuestions[index].text = e.target.value;
    setSurvey({ ...survey, questions: newQuestions });
  };

  const handleChoiceChange = (questionIndex, choiceIndex, e) => {
    const newQuestions = [...survey.questions];
    newQuestions[questionIndex].choices[choiceIndex] = e.target.value;
    setSurvey({ ...survey, questions: newQuestions });
  };

  const addQuestion = () => {
    if (survey.questions.length < 10) {
      setSurvey({
        ...survey,
        questions: [...survey.questions, { text: '', choices: [''] }]
      });
    }
  };

  const removeQuestion = (index) => {
    if (survey.questions.length > 1) {
      const newQuestions = [...survey.questions];
      newQuestions.splice(index, 1);
      setSurvey({ ...survey, questions: newQuestions });
    }
  };

  const addChoice = (questionIndex) => {
    const newQuestions = [...survey.questions];
    if (newQuestions[questionIndex].choices.length < 5) {
      newQuestions[questionIndex].choices.push('');
      setSurvey({ ...survey, questions: newQuestions });
    }
  };

  const removeChoice = (questionIndex, choiceIndex) => {
    const newQuestions = [...survey.questions];
    if (newQuestions[questionIndex].choices.length > 1) {
      newQuestions[questionIndex].choices.splice(choiceIndex, 1);
      setSurvey({ ...survey, questions: newQuestions });
    }
  };

  
  const isFormValid = () => {
    if (!survey.title.trim()) {
      alert("O título da survey não pode estar vazio.");
      return false;
    }
  
    for (let question of survey.questions) {
      if (!question.text.trim()) {
        alert("Cada pergunta deve ter um texto.");
        return false;
      }
      if (question.choices.length < 2) {
        alert("Cada pergunta deve ter pelo menos duas opções.");
        return false;
      }
      for (let choice of question.choices) {
        if (!choice.trim()) {
          alert("Todas as opções de resposta devem conter texto.");
          return false;
        }
      }
    }
  
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!isFormValid()) {
      return; // Se a validação falhar, não prosseguir com a submissão
    }
    try {
      const response = await axiosInstance.post('/api/surveys', survey);
      console.log(response.data);
  
      // Reset form after successful submission
      resetForm();
      alert('Survey criada com sucesso!');
  
    } catch (error) {
      console.error('Erro ao criar survey', error);
      // Handle the error state
    }
  };
  
  const resetForm = () => {
    setSurvey({
      title: '',
      questions: [{ text: '', choices: [''] }]
    });
  };

  const handleCancel = () => {
    setSurvey({
      title: '',
      questions: [{ text: '', choices: [''] }]
    }); // Limpar o estado do formulário
    navigate('/dashboard'); // Redirecionar para o dashboard
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 flex justify-center">
      <div className="w-full max-w-3xl bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-3xl font-bold leading-tight text-gray-900">Criar Survey</h2>
        <form onSubmit={handleSubmit} className="mt-8">
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
              Título da Survey:
            </label>
            <input
              type="text"
              id="title"
              value={survey.title}
              onChange={handleTitleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          {survey.questions.map((question, qIndex) => (
            <div key={`question-${qIndex}`} className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor={`question-${qIndex}`} className="text-sm font-medium text-gray-700">Pergunta {qIndex + 1}:</label>
                {survey.questions.length > 1 && (
                <button type="button" onClick={() => removeQuestion(qIndex)} className="text-xs text-red-600 hover:text-red-700">
                  Remover Pergunta
                </button>
                )}
              </div>
              <input
                type="text"
                id={`question-${qIndex}`}
                value={question.text}
                onChange={(e) => handleQuestionChange(qIndex, e)}
                className="block w-full border-gray-300 shadow-sm rounded-md"
              />
              {question.choices.map((choice, cIndex) => (
                <div key={`choice-${qIndex}-${cIndex}`} className="flex items-center space-x-2">
                <label htmlFor={`choice-${qIndex}-${cIndex}`} className="block text-sm font-medium text-gray-700">Opção {cIndex + 1}:</label>
                <div key={`choice-${qIndex}-${cIndex}`} className="flex items-center space-x-2">
                  <input
                    type="text"
                    id={`choice-${qIndex}-${cIndex}`}
                    value={choice}
                    onChange={(e) => handleChoiceChange(qIndex, cIndex, e)}
                    className="block w-full border-gray-300 shadow-sm rounded-md"
                  />
                  {question.choices.length > 1 && (
                    <button type="button" onClick={() => removeChoice(qIndex, cIndex)} className="text-xs text-red-600 hover:text-red-700">
                      Remover Opção
                    </button>
                  )}
                </div>
              </div>
              ))}
              {question.choices.length < 5 && (
                <button type="button" onClick={() => addChoice(qIndex)} className="text-sm text-blue-600 hover:text-blue-700">
                  Adicionar Opção
                </button>
              )}
            </div>
          ))}
            <div className="flex items-center justify-between mt-8">
              {survey.questions.length < 10 && (
                <button
                  type="button"
                  onClick={addQuestion}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Adicionar Pergunta
                </button>
              )}
            <div>
            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
              >
                Salvar Survey
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="inline-block align-baseline font-bold text-sm text-red-500 hover:text-red-800"
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>  
  );
};

export default SurveyCreator;
