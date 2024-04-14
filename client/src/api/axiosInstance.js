import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://survey-api-app.vercel.app',
  withCredentials: true // Necessário para enviar e receber cookies
});

export default axiosInstance;