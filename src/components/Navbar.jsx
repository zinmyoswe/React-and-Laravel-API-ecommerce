import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      if (token) {
        await axios.post('http://localhost:8080/api/logout', null, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }

      // ✅ Remove token and session_id from localStorage
      localStorage.removeItem('token');
      // localStorage.removeItem('session_id');

      // ✅ Optional: regenerate session_id if you want a fresh guest cart
    if (!localStorage.getItem('session_id')) {
      const newSessionId = crypto.randomUUID();
      localStorage.setItem('session_id', newSessionId);
    }

      // ✅ Navigate to login instead of hard reload
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-white text-dark">
      <Link to="/" className="text-xl font-bold">MyShop</Link>
      <div className="space-x-4">
        {/* ✅ Cart visible for both guests and logged-in users */}
        <Link to="/cart" className="hover:underline">Cart</Link>

        {token ? (
          <>
            <Link to="/orders">My Orders</Link>
            <button onClick={handleLogout} className="text-zinc-900 px-3 py-1">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
