import api from './api';

export const getAllProducts = () => api.get('/products');

export const getProductById = (id) => api.get(`/products/${id}`);

export const getProductsByCategory = (categoryId) =>
  api.get(`/products/category/${categoryId}`);

export const getProductsBySubcategory = (subcategoryId) =>
  api.get(`/products/subcategory/${subcategoryId}`);


// export const getFilteredProducts = (sortOption) => {
//   return api.get(`/products/filter?sort=${sortOption}`);
// };

export const getFilteredProducts = (filters) => {
  // Prepare query params: remove empty values, stringify arrays correctly
  const params = {};

  Object.keys(filters).forEach(key => {
    const value = filters[key];
    if (Array.isArray(value) && value.length > 0) {
      params[key] = value; // Axios handles arrays like ?key[]=val1&key[]=val2
    } else if (value !== '' && value !== null && value !== undefined) {
      params[key] = value;
    }
  });

  return api.get('/products/filter', { params });
};

export const getAllCategories = () => api.get('/categories');

export const getAllSubcategories = () => api.get('/subcategories');


