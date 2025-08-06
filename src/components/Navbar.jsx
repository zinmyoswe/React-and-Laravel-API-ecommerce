import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';
import API_BASE_URL from '../config';
import BottomBarCarousel from './BottomBarCarousel';
import SearchModal from './SearchModal';
import TopNavbar from './TopNavbar';
import { useCart } from './../context/CartContext';

const Navbar = () => {
  const [userName, setUserName] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  // const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);
  const { totalItems } = useCart();

  const handleLogout = async () => {
  try {
    console.log('Logging out... token:', token);
    if (token) {
      const response = await axios.post(`${API_BASE_URL}/api/logout`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Logout response:', response.data);
    }

    localStorage.removeItem('token');
    if (!localStorage.getItem('session_id')) {
      const newSessionId = crypto.randomUUID();
      localStorage.setItem('session_id', newSessionId);
    }

    // Use React Router navigation to reload current page
    navigate(location.pathname);

    // Or force reload (if navigate doesn't work)
    // window.location.reload();

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

  const fetchUser = async () => {
    try {
      if (token) {
        const response = await axios.get(`${API_BASE_URL}/api/user`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserName(response.data.name);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  fetchCart();
  fetchUser();
}, [token]);

  return (
    <div>
     <TopNavbar />

    <nav className="bg-white text-dark px-4 md:px-10 border border-b-gray-200">
      <div className="flex items-center justify-between h-16 relative">
        {/* Logo */}
        <div className="text-xl font-bold">
          <Link to="/">
            <svg aria-hidden="true" class="swoosh-svg" focusable="false" viewBox="0 0 24 24" role="img" width="79" height="79" fill="none">
              <path fill="currentColor" fill-rule="evenodd" d="M21 8.719L7.836 14.303C6.74 14.768 5.818 15 5.075 15c-.836 0-1.445-.295-1.819-.884-.485-.76-.273-1.982.559-3.272.494-.754 1.122-1.446 1.734-2.108-.144.234-1.415 2.349-.025 3.345.275.2.666.298 1.147.298.386 0 .829-.063 1.316-.19L21 8.719z" clip-rule="evenodd"></path>
            </svg>
          </Link>
        </div>

        {/* Desktop Center Menu */}
        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-6 text-lg font-medium">
        <Link to="/products?subcategory_id=13&subcategory_id=14">Shoes</Link>
          <Link to="/products?gender=Men" className="hover:text-black hover:underline">Men</Link>
          <Link to="/products?gender=Women" className="hover:text-black hover:underline">Women</Link>
          <Link to="/products?gender=Kids" className="hover:text-black hover:underline">Kids</Link>
        </div>

        

        {/* Desktop Right Auth Menu */}
        <div className="hidden md:flex items-center space-x-4">

          {/* Small Search input */}
        <div className="relative w-40 sm:w-46">
  <svg
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 24 24"
    role="img"
    width="23"
    height="23"
    fill="none"
    className="absolute left-2 top-2 text-gray-950"
  >
    <path
      stroke="currentColor"
      strokeWidth="1.5"
      d="M13.962 16.296a6.716 6.716 0 01-3.462.954 6.728 6.728 0 01-4.773-1.977A6.728 6.728 0 013.75 10.5c0-1.864.755-3.551 1.977-4.773A6.728 6.728 0 0110.5 3.75c1.864 0 3.551.755 4.773 1.977A6.728 6.728 0 0117.25 10.5a6.726 6.726 0 01-.921 3.407c-.517.882-.434 1.988.289 2.711l3.853 3.853"
    ></path>
  </svg>
  <input
    type="text"
    className="w-full border pl-8 pr-2 py-2 rounded-full bg-[#f5f5f5] text-[16px]  cursor-pointer"
    placeholder="Search..."
    onFocus={() => setShowSearch(true)}
    readOnly
  />
</div>

        
           {token ? (
            <>
              <Link to="/my-favourites">
                <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" role="img" width="24px" height="24px" fill="none"><path stroke="currentColor" stroke-width="1.5" d="M16.794 3.75c1.324 0 2.568.516 3.504 1.451a4.96 4.96 0 010 7.008L12 20.508l-8.299-8.299a4.96 4.96 0 010-7.007A4.923 4.923 0 017.205 3.75c1.324 0 2.568.516 3.504 1.451l.76.76.531.531.53-.531.76-.76a4.926 4.926 0 013.504-1.451"></path></svg>
              </Link>
            </>
          ) : (
            <Link to="">
              <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" role="img" width="24px" height="24px" fill="none"><path stroke="currentColor" stroke-width="1.5" d="M16.794 3.75c1.324 0 2.568.516 3.504 1.451a4.96 4.96 0 010 7.008L12 20.508l-8.299-8.299a4.96 4.96 0 010-7.007A4.923 4.923 0 017.205 3.75c1.324 0 2.568.516 3.504 1.451l.76.76.531.531.53-.531.76-.76a4.926 4.926 0 013.504-1.451"></path></svg>
          </Link>
          )}
          
          {/* <Link to="/cart" className="hover:underline">
          <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" role="img" width="24px" height="24px" fill="none"><path stroke="currentColor" stroke-width="1.5" d="M8.25 8.25V6a2.25 2.25 0 012.25-2.25h3a2.25 2.25 0 110 4.5H3.75v8.25a3.75 3.75 0 003.75 3.75h9a3.75 3.75 0 003.75-3.75V8.25H17.5"></path></svg>
          </Link> */}
          <Link to="/cart" className="relative hover:underline">
  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" role="img" width="24px" height="24px" fill="none">
    <path stroke="currentColor" strokeWidth="1.5" d="M8.25 8.25V6a2.25 2.25 0 012.25-2.25h3a2.25 2.25 0 110 4.5H3.75v8.25a3.75 3.75 0 003.75 3.75h9a3.75 3.75 0 003.75-3.75V8.25H17.5" />
  </svg>
  {totalItems > 0 && (
    <span className="absolute -top-1 -right-2 bg-zinc-100 text-zinc-950 text-xs px-1.5 py-0.5 rounded-full">
      {totalItems}
    </span>
  )}
</Link>
          {token ? (
            <>
              <Link to="/orders" className="hover:underline hidden">
                <svg aria-hidden="true" class="icon-btn" focusable="false" viewBox="0 0 24 24" role="img" width="24px" height="24px" fill="none" aria-label="Profile"><path stroke="currentColor" stroke-width="2" d="M3.75 21v-3a3.75 3.75 0 013.75-3.75h9A3.75 3.75 0 0120.25 18v3m-4.5-13.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"></path></svg>
              </Link>
              <button onClick={handleLogout} className="text-zinc-900 px-3 py-1 hidden">Log Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline hidden">Sign In</Link> 
              
              <Link to="/register" className="hover:underline hidden">Join Us</Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden">

          <div className='flex items-end gap-6'>
 {/* Small Search input */}
       {/* Small Search input for mobile */}
<div className="relative w-8 h-8">
  <button
    onClick={() => setShowSearch(true)}
    className="absolute inset-0 flex items-center justify-center"
  >
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      role="img"
      width="25"
      height="25"
      fill="none"
      className="text-gray-950 mt-2"
    >
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        d="M13.962 16.296a6.716 6.716 0 01-3.462.954 6.728 6.728 0 01-4.773-1.977A6.728 6.728 0 013.75 10.5c0-1.864.755-3.551 1.977-4.773A6.728 6.728 0 0110.5 3.75c1.864 0 3.551.755 4.773 1.977A6.728 6.728 0 0117.25 10.5a6.726 6.726 0 01-.921 3.407c-.517.882-.434 1.988.289 2.711l3.853 3.853"
      />
    </svg>
  </button>

  {/* Hidden input just to capture focus if needed */}
  <input
    type="text"
    className="absolute opacity-0 pointer-events-none"
    readOnly
  />
</div>
            

          {token ? (
            <>

            
             

              <Link to="/my-favourites">
              <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" role="img" width="24px" height="24px" fill="none"><path stroke="currentColor" stroke-width="1.5" d="M16.794 3.75c1.324 0 2.568.516 3.504 1.451a4.96 4.96 0 010 7.008L12 20.508l-8.299-8.299a4.96 4.96 0 010-7.007A4.923 4.923 0 017.205 3.75c1.324 0 2.568.516 3.504 1.451l.76.76.531.531.53-.531.76-.76a4.926 4.926 0 013.504-1.451"></path></svg>
          </Link>
            </>
          ) : (
            <Link to="">
              <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" role="img" width="24px" height="24px" fill="none"><path stroke="currentColor" stroke-width="1.5" d="M16.794 3.75c1.324 0 2.568.516 3.504 1.451a4.96 4.96 0 010 7.008L12 20.508l-8.299-8.299a4.96 4.96 0 010-7.007A4.923 4.923 0 017.205 3.75c1.324 0 2.568.516 3.504 1.451l.76.76.531.531.53-.531.76-.76a4.926 4.926 0 013.504-1.451"></path></svg>
          </Link>
          )}

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

    <SearchModal show={showSearch} onClose={() => setShowSearch(false)} />

    
    <BottomBarCarousel />
    </div>
  );
};

export default Navbar;