import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const RespondedSurveys = () => {
  const [respondedSurveys, setRespondedSurveys] = useState([]);

  useEffect(() => {
    const fetchRespondedSurveys = async () => {
      // Substitua '/api/surveys/responded' pela rota correta conforme sua implementação no backend
      const { data } = await axiosInstance.get('/api/surveys/responded');
      setRespondedSurveys(data);
    };
    fetchRespondedSurveys();
  }, []);

  return (
    <div>
      <h2>Surveys Respondidas</h2>
      <ul>
        {respondedSurveys.map(survey => (
          <li key={survey._id}>{survey.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default RespondedSurveys;