import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const WaitingSurveys = () => {
  const [waitingSurveys, setWaitingSurveys] = useState([]);

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

  return (
    <div>
      <h2>Surveys em Espera</h2>
      <ul>
        {waitingSurveys.map((survey) => (
          <li key={survey._id}>{survey.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default WaitingSurveys;
