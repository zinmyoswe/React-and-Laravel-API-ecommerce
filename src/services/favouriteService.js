import api from './api'; // Adjust path if needed

export const addToFavourite = async (product_id, size = null) => {
  const token = localStorage.getItem('token');

  return await api.post(
    '/favourites',
    { product_id, size },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getFavourites = async () => {
  const token = localStorage.getItem('token');

  return await api.get('/favourites', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const removeFromFavourite = async (product_id) => {
  const token = localStorage.getItem('token');

  return await api.delete(`/favourites/${product_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


