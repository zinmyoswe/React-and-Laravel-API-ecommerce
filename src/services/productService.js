import api from './api';

export const getAllProducts = () => api.get('/products');

export const getProductById = (id) => api.get(`/products/${id}`);

export const getProductsByCategory = (categoryId) =>
  api.get(`/products/category/${categoryId}`);

export const getProductsBySubcategory = (subcategoryId) =>
  api.get(`/products/subcategory/${subcategoryId}`);
