import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const RespondedSurveys = () => {
  const [respondedSurveys, setRespondedSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [surveyResults, setSurveyResults] = useState([]);

  useEffect(() => {
    const fetchRespondedSurveys = async () => {
      const { data } = await axiosInstance.get('/api/surveys/responded');
      setRespondedSurveys(data);
    };
    fetchRespondedSurveys();
  }, []);

  const viewSurveyResults = async (surveyId) => {
    const { data } = await axiosInstance.get(`/api/surveys/results/${surveyId}`);
    setSelectedSurvey(data.survey);
    setSurveyResults(data.results);
  };

  // Função para encontrar o número máximo de opções em todas as perguntas
  const maxOptionsCount = () => {
    return selectedSurvey?.questions.reduce((max, question) => Math.max(max, question.choices.length), 0) || 0;
  };

  return (
    <div>
      
      {selectedSurvey ? (
        <div>
          <h3>{selectedSurvey.title}</h3>
          <table>
            <thead>
              <tr>
                <th>Pergunta</th>
                {[...Array(maxOptionsCount())].map((_, index) => (
                  <th key={index}>Opção {index + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {surveyResults.map((result, index) => (
                <tr key={index}>
                  {/* <td>{result.text}</td> */}
                  <td>Pergunta {index + 1}</td>
                  {[...Array(maxOptionsCount())].map((_, cIndex) => {
                    // Verifica se existe a escolha para aquela coluna, caso contrário renderiza "N/A"
                    const choiceResult = result.choices[cIndex];
                    return (
                      <td key={cIndex}>
                        {choiceResult ? choiceResult.count : 'N/A'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => setSelectedSurvey(null)}>Voltar às Surveys</button>
          <br />
          <br />
          <p>Perguntas e Opções</p>
          <br />
          <br />
          {selectedSurvey.questions.map((question, index) => (
            <div key={index}>
              <p>{index + 1}. {question.text}</p>
              {question.choices.map((choice, choiceIndex) => (
                <p key={choiceIndex}>{choice}</p>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h2>Surveys Respondidas</h2>
          <ul>
            {respondedSurveys.map(survey => (
              <li key={survey._id} onClick={() => viewSurveyResults(survey._id)}>{survey.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RespondedSurveys;