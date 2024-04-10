import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
);

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h4>Something went wrong with the chart rendering.</h4>;
    }

    return this.props.children;
  }
}

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

  const renderPieCharts = () => {
    return (
      <div className="flex flex-wrap -mx-2">
        {surveyResults.map((result, index) => {
          const data = {
            // labels: result.choices.map(choice => choice.choice),
            labels: result.choices.map((_, choiceIndex) => `Opção ${choiceIndex + 1}`),
            datasets: [
              {
                data: result.choices.map(choice => choice.count),
                backgroundColor: [
                  '#FF6384', // vermelho
                  '#36A2EB', // azul
                  '#FFCE56', // amarelo
                  '#4BC0C0', // turquesa
                  '#9966FF', // roxo
                ],
                borderWidth: 1,
              },
            ],
          };
  
          return (
            <div key={index} className="p-2 w-full sm:w-1/3 lg:w-1/5">
              <ErrorBoundary>
                <div className="p-4 bg-white rounded-lg shadow-md">
                  <h4 className="text-center mb-4">{result.text}</h4>
                  <Pie data={data} />
                </div>
              </ErrorBoundary>
            </div>
          );
        })}
      </div>
    );
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
          {renderPieCharts()}
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