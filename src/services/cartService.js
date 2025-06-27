import axios from 'axios';
import API_BASE_URL from '../config';

export const addToCart = async (productId, size) => {
  const token = localStorage.getItem('token'); // Set during login
  const session_id = getOrCreateSessionId(); // Custom helper

  const data = {
    product_id: productId,
    size: size,
    quantity: 1
  };

  if (token) {
    // Logged-in user
    return axios.post(`${API_BASE_URL}/api/cart`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } else {
    // Guest
    return axios.post(`${API_BASE_URL}/api/cart/session-store`, { ...data, session_id });
  }
};

// Helper to get or create session_id
function getOrCreateSessionId() {
  let id = localStorage.getItem('session_id');
  if (!id) {
    id = 'guest-' + Math.random().toString(36).substring(2, 10);
    localStorage.setItem('session_id', id);
  }
  return id;
}
