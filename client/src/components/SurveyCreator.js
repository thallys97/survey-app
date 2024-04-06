import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const SurveyCreator = () => {
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
    setSurvey({
      ...survey,
      questions: [...survey.questions, { text: '', choices: [''] }]
    });
  };

  const removeQuestion = (index) => {
    const newQuestions = [...survey.questions];
    newQuestions.splice(index, 1);
    setSurvey({ ...survey, questions: newQuestions });
  };

  const addChoice = (questionIndex) => {
    const newQuestions = [...survey.questions];
    newQuestions[questionIndex].choices.push('');
    setSurvey({ ...survey, questions: newQuestions });
  };

  const removeChoice = (questionIndex, choiceIndex) => {
    const newQuestions = [...survey.questions];
    newQuestions[questionIndex].choices.splice(choiceIndex, 1);
    setSurvey({ ...survey, questions: newQuestions });
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
      // Redirect or inform the user of success
    } catch (error) {
      console.error('Erro ao criar survey', error);
      // Handle the error state
    }
  };

  const handleCancel = () => {
    // Reset the state or redirect the user
  };

  return (
    <div>
      <h2>Criar Survey</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Título da Survey:</label>
        <input
          type="text"
          id="title"
          value={survey.title}
          onChange={handleTitleChange}
        />

        {survey.questions.map((question, qIndex) => (
          <div key={`question-${qIndex}`}>
            <label htmlFor={`question-${qIndex}`}>Pergunta {qIndex + 1}:</label>
            <input
              type="text"
              id={`question-${qIndex}`}
              value={question.text}
              onChange={(e) => handleQuestionChange(qIndex, e)}
            />
            <button type="button" onClick={() => removeQuestion(qIndex)}>Remover Pergunta</button>
            {question.choices.map((choice, cIndex) => (
              <div key={`choice-${qIndex}-${cIndex}`}>
                <label htmlFor={`choice-${qIndex}-${cIndex}`}>Opção {cIndex + 1}:</label>
                <input
                  type="text"
                  id={`choice-${qIndex}-${cIndex}`}
                  value={choice}
                  onChange={(e) => handleChoiceChange(qIndex, cIndex, e)}
                />
                <button type="button" onClick={() => removeChoice(qIndex, cIndex)}>Remover Opção</button>
              </div>
            ))}
            <button type="button" onClick={() => addChoice(qIndex)}>Adicionar Opção</button>
          </div>
        ))}
        <button type="button" onClick={addQuestion}>Adicionar Pergunta</button>
        <button type="submit">Salvar Survey</button>
        <button type="button" onClick={handleCancel}>Cancelar</button>
      </form>
    </div>
  );
};

export default SurveyCreator;
