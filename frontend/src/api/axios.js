import axios from 'axios';
import { getApiBase } from '../utils/apiBase.js';

const api = axios.create({
  baseURL: getApiBase(),
  withCredentials: true,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
