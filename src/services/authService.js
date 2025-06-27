import API_BASE_URL from "../config";

// services/authService.js
export const login = async (email, password) => {
  const session_id = localStorage.getItem('session_id'); // 👈 your guest session ID

  const response = await axios.post(`${API_BASE_URL}/api/login`, {
    email,
    password,
    session_id, // 👈 send to Laravel
  });

  localStorage.setItem('token', response.data.token);
  return response;
};
