// src/services/axiosConfig.js
import axios from 'axios';

const axiosConfig = axios.create({
  baseURL: 'https://backlec-production.up.railway.app/api', // Configura la URL base aquí
  timeout: 1000,
});

export default axiosConfig;
