import axios from 'axios';

const BASE_URL = import.meta.env.DEV
  ? '/api'
  : '/FlowBoard/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default apiClient;
