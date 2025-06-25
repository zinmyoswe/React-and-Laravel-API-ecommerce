import api from './api';
import qs from 'qs'; // ✅ import qs

export const getAllProducts = () => api.get('/products');

export const getProductById = (id) => api.get(`/products/${id}`);

export const getProductsByCategory = (categoryId) =>
  api.get(`/products/category/${categoryId}`);

export const getProductsBySubcategory = (subcategoryId) =>
  api.get(`/products/subcategory/${subcategoryId}`);

export const getFilteredProducts = (filters) => {
  const params = {};

  // Map frontend keys to backend expected keys
  Object.keys(filters).forEach(key => {
    const val = filters[key];

    if ((Array.isArray(val) && val.length > 0) || (typeof val === 'string' && val !== '')) {
      if (key === 'clothingSize') {
        params['clothing_size_ids'] = val;
      } else if (key === 'shoeSize') {
        params['shoe_size_ids'] = val;
      } else if (key === 'minPrice') {
        params['min_price'] = val;
      } else if (key === 'maxPrice') {
        params['max_price'] = val;
      } else if (key === 'gender') {
        params['gender'] = val;
      } else if (key === 'color') {
        params['color'] = val;
      } else if (key === 'sort') {
        params['sort'] = val;
      } else if (key === 'subcategoryId') {
        params['subcategory_id'] = val;
      } else {
        params[key] = val;
      }
    }
  });

  return api.get('/products', {
    params,
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }) // ✅ handles arrays properly
  });
};

export const getAllCategories = () => api.get('/categories');

export const getAllSubcategories = () => api.get('/subcategories');
