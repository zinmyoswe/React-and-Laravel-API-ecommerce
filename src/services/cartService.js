import axios from 'axios';

const API = 'http://localhost:8080/api/cart';

export const addToCart = async (product_id, size, quantity = 1) => {
  const sessionId = getSessionId();
  console.log(sessionId); // Always a valid session ID
  const headers = sessionId ? { 'Session-Id': sessionId } : {};

  const response = await axios.post(API, { product_id, size, quantity, session_id: sessionId, }, { headers });
  return response.data;
};

function getSessionId() {
  let sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = 'guest-' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('session_id', sessionId);
  }
  return sessionId;
}
