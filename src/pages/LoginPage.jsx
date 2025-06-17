import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Get redirect path from query string
  const redirectTo = new URLSearchParams(location.search).get('redirect') || '/';

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // ✅ Get guest session ID from localStorage (used in Laravel cart migration)
      const session_id = localStorage.getItem('session_id');

      const res = await axios.post(
        'http://localhost:8080/api/login',
        { email, password, session_id }, // 👈 include session_id in request
        { withCredentials: true }
      );

      // ✅ Save the user token to localStorage
      localStorage.setItem('token', res.data.token);

      // ✅ Redirect to homepage (or wherever)
      // navigate('/');

      // ✅ Redirect to intended page
      navigate(redirectTo);
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
