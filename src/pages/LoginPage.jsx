import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import API_BASE_URL from './../config';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const location = useLocation();
  const redirectTo = new URLSearchParams(location.search).get('redirect') || '/';

  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const validatePassword = (value) => {
    return value.length >= 6 && !/^\d+$/.test(value); // not all numbers
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (validateEmail(value)) {
      setEmailError('');
    } else {
      setEmailError('Please enter a valid email address.');
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (validatePassword(value)) {
      setPasswordError('');
    } else {
      setPasswordError('Password must be at least 6 characters and not all numbers.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Run validation before submitting
    let valid = true;
    // if (!validateEmail(email)) {
    //   setEmailError('Please enter a valid email address.');
    //   valid = false;
    // }
    // if (!validatePassword(password)) {
    //   setPasswordError('Password must be at least 6 characters and not all numbers.');
    //   valid = false;
    // }

    if (!email.trim()) {
    setEmailError('Please enter a valid email address.');
    valid = false;
  } else if (!validateEmail(email)) {
    setEmailError('Please enter a valid email address.');
    valid = false;
  } else {
    setEmailError('');
  }

  if (!password.trim()) {
    setPasswordError('Password Required.');
    valid = false;
  } else if (!validatePassword(password)) {
    setPasswordError('Password must be at least 6 characters and not all numbers.');
    valid = false;
  } else {
    setPasswordError('');
  }

    if (!valid) return;

    try {
      const session_id = localStorage.getItem('session_id');

      const res = await axios.post(
        `${API_BASE_URL}/api/login`,
        { email, password, session_id },
        { withCredentials: true }
      );

      localStorage.setItem('token', res.data.token);
      window.location.href = redirectTo;
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl text-center ml-44 font-bold mb-4">
        <svg aria-hidden="true" class="swoosh-svg" focusable="false" viewBox="0 0 24 24" role="img" width="99" height="99" fill="none">
              <path fill="currentColor" fill-rule="evenodd" d="M21 8.719L7.836 14.303C6.74 14.768 5.818 15 5.075 15c-.836 0-1.445-.295-1.819-.884-.485-.76-.273-1.982.559-3.272.494-.754 1.122-1.446 1.734-2.108-.144.234-1.415 2.349-.025 3.345.275.2.666.298 1.147.298.386 0 .829-.063 1.316-.19L21 8.719z" clip-rule="evenodd"></path>
            </svg>
      </h1>
      <h6 className="text-lg mb-8 text-[#707072]">Singapore</h6>

      {error && <div className="text-red-500 mb-2">{error}</div>}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            className={`w-full p-3 border rounded ${emailError ? 'border-red-500' : ''}`}
          />
          {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
        </div>

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            className={`w-full p-3 border rounded pr-10 ${passwordError ? 'border-red-500' : ''}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3 transform -translate-y-1/2"
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
          {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-zinc-950 text-white py-3 px-4 rounded-full"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
