import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://survey-api-app.vercel.app'
});

export default axiosInstance;