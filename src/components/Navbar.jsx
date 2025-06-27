import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      if (token) {
        await axios.post('http://localhost:8080/api/logout', null, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }

      localStorage.removeItem('token');
      if (!localStorage.getItem('session_id')) {
        const newSessionId = crypto.randomUUID();
        localStorage.setItem('session_id', newSessionId);
      }

      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <nav className="bg-white text-dark px-4 md:px-10">
      <div className="flex items-center justify-between h-16 relative">
        {/* Logo */}
        <div className="text-xl font-bold">
          <Link to="/">SHOP</Link>
        </div>

        {/* Desktop Center Menu */}
        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-6 text-lg font-medium">
          <Link to="/products?gender=Men" className="hover:text-black hover:underline">Men</Link>
          <Link to="/products?gender=Women" className="hover:text-black hover:underline">Women</Link>
          <Link to="/products?gender=Kid" className="hover:text-black hover:underline">Kid</Link>
        </div>

        {/* Desktop Right Auth Menu */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/cart" className="hover:underline">Cart</Link>
          {token ? (
            <>
              <Link to="/orders" className="hover:underline">My Orders</Link>
              <button onClick={handleLogout} className="text-zinc-900 px-3 py-1">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="hover:underline">Register</Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} size="lg" />

          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md mt-2 p-4 rounded space-y-2 text-base">
          <Link to="/products?gender=Men" className="block" onClick={() => setMenuOpen(false)}>Men</Link>
          <Link to="/products?gender=Women" className="block" onClick={() => setMenuOpen(false)}>Women</Link>
          <Link to="/products?gender=Kid" className="block" onClick={() => setMenuOpen(false)}>Kid</Link>
          <hr />
          <Link to="/cart" className="block" onClick={() => setMenuOpen(false)}>Cart</Link>
          {token ? (
            <>
              <Link to="/orders" className="block" onClick={() => setMenuOpen(false)}>My Orders</Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="w-full text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="block" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
