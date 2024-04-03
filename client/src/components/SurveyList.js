import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const SurveyList = () => {
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    axiosInstance.get('/surveys')
      .then(response => {
        setSurveys(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the surveys', error);
      });
  }, []);

  // O render da lista de surveys vai aqui
};

export default SurveyList;