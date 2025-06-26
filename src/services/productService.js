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

    // if ((Array.isArray(val) && val.length > 0) || (typeof val === 'string' && val !== '')) {
        if (
      (Array.isArray(val) && val.length > 0) ||
      (typeof val === 'string' && val !== '') ||
      (typeof val === 'number') // ✅ include numbers like subcategory_id
    ) {  
    if (key === 'clothingSize' || key === 'shoeSize') {
        // Combine both into one array for `sizevalue`
        if (!params['sizevalue']) params['sizevalue'] = [];
        params['sizevalue'] = [...(params['sizevalue'] || []), ...val];
      } else if (key === 'price') {
        params['price'] = val;
      } else if (key === 'subcategory_id') {
        params['subcategory_id'] = val;
      } else {
        params[key] = val;
      }
    }
  });

  return api.get('/products', {
    params,
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'brackets' }) // ✅ handles arrays properly
  });
};

export const getAllCategories = () => api.get('/categories');

export const getAllSubcategories = () => api.get('/subcategories');
