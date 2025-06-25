import axios from 'axios';

export const getAllCategories = () => {
  return axios.get('/api/categories');
};
