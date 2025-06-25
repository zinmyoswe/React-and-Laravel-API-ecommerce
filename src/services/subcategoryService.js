import api from './api';

export const getAllSubcategories = () => api.get('/subcategories');

export const getSubcategoryById = (id) => api.get(`/subcategories/${id}`);

export const createSubcategory = (data) => api.post('/subcategories', data);

export const updateSubcategory = (id, data) => api.put(`/subcategories/${id}`, data);

export const deleteSubcategory = (id) => api.delete(`/subcategories/${id}`);
