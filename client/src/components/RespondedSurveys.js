import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import DashboardButton from './DashboardButton';
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
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        return;
      }
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const { data } = await axiosInstance.get('/api/surveys/responded', config);
      setRespondedSurveys(data);
    };
    fetchRespondedSurveys();
  }, []);

  const viewSurveyResults = async (surveyId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found');
      return;
    }
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const { data } = await axiosInstance.get(`/api/surveys/results/${surveyId}`, config);
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
                <div className="p-2 bg-white rounded-lg shadow-md">
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        {selectedSurvey ? (
          <div className="container mx-auto p-4 space-y-8">
            <h2 className="text-3xl font-semibold text-center">{selectedSurvey.title}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pergunta</th>
                    {[...Array(maxOptionsCount())].map((_, index) => (
                      <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opção {index + 1}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {surveyResults.map((result, index) => (
                    <tr key={index}>
                      {/* <td>{result.text}</td> */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Pergunta {index + 1}</td>
                      {[...Array(maxOptionsCount())].map((_, cIndex) => {
                        // Verifica se existe a escolha para aquela coluna, caso contrário renderiza "N/A"
                        const choiceResult = result.choices[cIndex];
                        return (
                          <td key={cIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {choiceResult ? choiceResult.count : 'N/A'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
              {renderPieCharts()}
            
            <div className="text-center">
              <button onClick={() => setSelectedSurvey(null)}  className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Voltar às Surveys</button>
            </div>
            
            <h2 className="text-3xl font-semibold text-center my-8">Perguntas e Opções</h2>
            <div className="container mx-auto p-4 space-y-8">
              {selectedSurvey.questions.map((question, index) => (
                <div key={index} className="my-4 p-4 bg-white rounded shadow">
                  <p className="text-lg font-semibold">{index + 1}. {question.text}</p>
                  {question.choices.map((choice, choiceIndex) => (
                    <p key={choiceIndex} className="ml-4 pl-4 py-2 border-l-2 border-gray-200">{choice}</p>
                  ))}
                </div>
              ))}
             </div> 
          </div>
        ) : (
          <div className="min-h-screen bg-gray-100 flex justify-center items-center">
            <div className="container mx-auto p-4">
                <div className="bg-white rounded shadow-md max-w-2xl mx-auto p-6">
                  <DashboardButton />
                  <h2 className="text-2xl font-bold text-center mb-4">Surveys Respondidas</h2>
                  {respondedSurveys.length > 0 ? (
                    <ul className="space-y-4">
                      {respondedSurveys.map(survey => (
                        <li key={survey._id} 
                            className="list-none bg-blue-100 rounded hover:bg-blue-200 cursor-pointer p-4 text-center"
                            onClick={() => viewSurveyResults(survey._id)}>
                          {survey.title}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-center text-gray-600">Não há surveys respondidas.</p>
                  )}
                </div>
            </div>  
          </div>
        )}
    </div>
  );
};

export default RespondedSurveys;