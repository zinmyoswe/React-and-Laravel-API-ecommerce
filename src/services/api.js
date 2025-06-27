import axios from 'axios';
import API_BASE_URL from '../config';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`, // Your Laravel API base URL
  headers: {
    Accept: 'application/json',
  },
});

export default api;
