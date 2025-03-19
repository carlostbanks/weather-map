import axios from 'axios';
import { getToken } from '../utils/token';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Adding auth token to request');
    } else {
      console.log('No token available for request');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;