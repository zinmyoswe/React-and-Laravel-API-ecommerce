import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';
import axios from 'axios';

const TopNavbar = () => {

    const token = localStorage.getItem('token');
    const [userName, setUserName] = useState('');


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


  fetchUser();
}, [token]);

  return (
    <div className='zinbordernone'>
       <div
  className="hidden sm:flex w-full h-8 bg-[#f5f5f5] text-zinc-900 items-center justify-end px-4 md:px-10 topbar-font"
  style={{
    font: "500 .75rem/1.5 'Helvetica Now Text Medium', Helvetica, Arial, sans-serif",
  }}
>
  {token ? (
   <div className="relative">
  <div className="flex items-center gap-3 text-[12px]">
    <Link to="/orders" className="hover:underline">
      Order Tracker
    </Link>
    <span>|</span>

    <span className="text-[12px] text-zinc-900 font-medium"> Hi! {userName}</span>

    {/* Group starts here: only on the icon */}
    <div className="relative group">
      <button className="flex items-center gap-1">
        <svg
          aria-hidden="true"
          className="icon-btn"
          focusable="false"
          viewBox="0 0 24 24"
          role="img"
          width="20px"
          height="20px"
          fill="none"
        >
          <path
            stroke="currentColor"
            strokeWidth="1.5"
            d="M3.75 21v-3a3.75 3.75 0 013.75-3.75h9A3.75 3.75 0 0120.25 18v3m-4.5-13.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
          ></path>
        </svg>
      </button>

      {/* Dropdown only shows on hover over icon */}
      <div className="absolute right-0 top-full mt-2 w-32 bg-white shadow-lg border rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <Link
          to="/orders"
          className="block px-4 py-2 text-[12px] text-[#707072] hover:bg-zinc-100"
        >
          Orders
        </Link>
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 text-[12px] text-[#707072] hover:bg-zinc-100"
        >
          Log Out
        </button>
      </div>
    </div>
  </div>
</div>

  ) : (
    <div className="flex items-center gap-3 text-[12pz] ">
      <Link to="/register" className="hover:underline">
        Join Us
      </Link>
      <span>|</span>
      <Link to="/login" className="hover:underline">
        Sign In
      </Link>
    </div>
  )}
</div>
    </div>
  )
}

export default TopNavbar
