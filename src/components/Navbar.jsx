import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const token = localStorage.getItem('token');
  console.log(token);
  const navigate = useNavigate();

  

  const handleLogout = () => {
    // Optional: Call Laravel /api/logout endpoint if you want to invalidate the token
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-zinc-900 text-white">
      <Link to="/" className="text-xl font-bold">MyShop</Link>
      <div className="space-x-4">
        {token ? (
          <>
            <Link to="/orders">My Orders</Link>
            <button onClick={handleLogout} className="bg-white text-zinc-900 px-3 py-1 rounded">
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
