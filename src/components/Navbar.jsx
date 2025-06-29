import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import API_BASE_URL from '../config';

const Navbar = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      if (token) {
        await axios.post(`${API_BASE_URL}/api/logout`, null, {
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

  useEffect(() => {
  const fetchCart = async () => {
    try {
      if (token) {
        // Logged-in user
        const response = await axios.get(`${API_BASE_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCartItems(response.data);
      } else {
        // Guest user
        const session_id = localStorage.getItem('session_id');
        const response = await axios.get(`${API_BASE_URL}/api/cart/session/${session_id}`);
        setCartItems(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  fetchCart();
}, [token]);

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
          <Link to="">
              <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" role="img" width="24px" height="24px" fill="none"><path stroke="currentColor" stroke-width="1.5" d="M16.794 3.75c1.324 0 2.568.516 3.504 1.451a4.96 4.96 0 010 7.008L12 20.508l-8.299-8.299a4.96 4.96 0 010-7.007A4.923 4.923 0 017.205 3.75c1.324 0 2.568.516 3.504 1.451l.76.76.531.531.53-.531.76-.76a4.926 4.926 0 013.504-1.451"></path></svg>
          </Link>
          {/* <Link to="/cart" className="hover:underline">
          <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" role="img" width="24px" height="24px" fill="none"><path stroke="currentColor" stroke-width="1.5" d="M8.25 8.25V6a2.25 2.25 0 012.25-2.25h3a2.25 2.25 0 110 4.5H3.75v8.25a3.75 3.75 0 003.75 3.75h9a3.75 3.75 0 003.75-3.75V8.25H17.5"></path></svg>
          </Link> */}
          <Link to="/cart" className="relative hover:underline">
  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" role="img" width="24px" height="24px" fill="none">
    <path stroke="currentColor" strokeWidth="1.5" d="M8.25 8.25V6a2.25 2.25 0 012.25-2.25h3a2.25 2.25 0 110 4.5H3.75v8.25a3.75 3.75 0 003.75 3.75h9a3.75 3.75 0 003.75-3.75V8.25H17.5" />
  </svg>
  {totalItems > 0 && (
    <span className="absolute -top-1 -right-2 bg-yellow-400 text-zinc-950 text-xs px-1.5 py-0.5 rounded-full">
      {totalItems}
    </span>
  )}
</Link>
          {token ? (
            <>
              <Link to="/orders" className="hover:underline">
                <svg aria-hidden="true" class="icon-btn" focusable="false" viewBox="0 0 24 24" role="img" width="24px" height="24px" fill="none" aria-label="Profile"><path stroke="currentColor" stroke-width="2" d="M3.75 21v-3a3.75 3.75 0 013.75-3.75h9A3.75 3.75 0 0120.25 18v3m-4.5-13.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"></path></svg>
              </Link>
              <button onClick={handleLogout} className="text-zinc-900 px-3 py-1">Log Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Sign In</Link> 
              
              <Link to="/register" className="hover:underline">Join Us</Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden">

          <div className='flex items-end gap-4'>

            <Link to="">
              <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" role="img" width="24px" height="24px" fill="none"><path stroke="currentColor" stroke-width="1.5" d="M16.794 3.75c1.324 0 2.568.516 3.504 1.451a4.96 4.96 0 010 7.008L12 20.508l-8.299-8.299a4.96 4.96 0 010-7.007A4.923 4.923 0 017.205 3.75c1.324 0 2.568.516 3.504 1.451l.76.76.531.531.53-.531.76-.76a4.926 4.926 0 013.504-1.451"></path></svg>
          </Link>

          {/* <Link to="/cart" className="block" onClick={() => setMenuOpen(false)}>
            <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" role="img" width="24px" height="24px" fill="none"><path stroke="currentColor" stroke-width="1.5" d="M8.25 8.25V6a2.25 2.25 0 012.25-2.25h3a2.25 2.25 0 110 4.5H3.75v8.25a3.75 3.75 0 003.75 3.75h9a3.75 3.75 0 003.75-3.75V8.25H17.5"></path></svg>
          </Link> */}

          <Link to="/cart" className="relative hover:underline">
  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" role="img" width="24px" height="24px" fill="none">
    <path stroke="currentColor" strokeWidth="1.5" d="M8.25 8.25V6a2.25 2.25 0 012.25-2.25h3a2.25 2.25 0 110 4.5H3.75v8.25a3.75 3.75 0 003.75 3.75h9a3.75 3.75 0 003.75-3.75V8.25H17.5" />
  </svg>
  {totalItems > 0 && (
    <span className="absolute -top-1 -right-2 bg-yellow-400 text-zinc-950 text-xs px-1.5 py-0.5 rounded-full">
      {totalItems}
    </span>
  )}
</Link>

            {token ? (
            <>
              <Link to="/orders" className="block" onClick={() => setMenuOpen(false)}>
                <svg aria-hidden="true" class="icon-btn" focusable="false" viewBox="0 0 24 24" role="img" width="24px" height="24px" fill="none" aria-label="Profile"><path stroke="currentColor" stroke-width="2" d="M3.75 21v-3a3.75 3.75 0 013.75-3.75h9A3.75 3.75 0 0120.25 18v3m-4.5-13.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"></path></svg>
              </Link>
              
            </>
          ) : (
            <>
              
            </>
          )}
            
          

          <button onClick={() => setMenuOpen(!menuOpen)}>
            <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} size="lg" />

          </button>

          
          
          </div>
          

          
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md mt-2 p-4 rounded space-y-2 text-base">
          <Link to="/products?gender=Men" className="block" onClick={() => setMenuOpen(false)}>Men</Link>
          <Link to="/products?gender=Women" className="block" onClick={() => setMenuOpen(false)}>Women</Link>
          <Link to="/products?gender=Kid" className="block" onClick={() => setMenuOpen(false)}>Kid</Link>
          <hr />
          {/* <Link to="/cart" className="block" onClick={() => setMenuOpen(false)}>
            <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" role="img" width="24px" height="24px" fill="none"><path stroke="currentColor" stroke-width="1.5" d="M8.25 8.25V6a2.25 2.25 0 012.25-2.25h3a2.25 2.25 0 110 4.5H3.75v8.25a3.75 3.75 0 003.75 3.75h9a3.75 3.75 0 003.75-3.75V8.25H17.5"></path></svg>
          </Link> */}
          {token ? (
            <>
              {/* <Link to="/orders" className="block" onClick={() => setMenuOpen(false)}>
                <svg aria-hidden="true" class="icon-btn" focusable="false" viewBox="0 0 24 24" role="img" width="24px" height="24px" fill="none" aria-label="Profile"><path stroke="currentColor" stroke-width="2" d="M3.75 21v-3a3.75 3.75 0 013.75-3.75h9A3.75 3.75 0 0120.25 18v3m-4.5-13.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"></path></svg>
              </Link> */}
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="w-full text-left"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block" onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link to="/register" className="block" onClick={() => setMenuOpen(false)}>Join Us</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;