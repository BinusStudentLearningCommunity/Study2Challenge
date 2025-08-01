import axios from 'axios';
import { config } from '../config';
import { triggerLogout } from '../contexts/AuthContext';

const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.log('Authentication error detected. Triggering logout.');
      triggerLogout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;