import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true // Necessário para enviar e receber cookies
});

export default axiosInstance;