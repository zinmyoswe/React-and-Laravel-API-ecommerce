import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import API_BASE_URL from '../config';

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();

  const validateName = (value) => /^[A-Za-z\s]+$/.test(value);
  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validatePassword = (value) => value.length >= 6 && !/^\d+$/.test(value);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Live validation
    let fieldErrors = { ...errors };
    if (name === 'name') {
      fieldErrors.name = !value.trim() ? 'Name is required.'
        : !validateName(value) ? 'Name must contain only letters.' : '';
    }
    if (name === 'email') {
      fieldErrors.email = !value.trim() ? 'Email is required.'
        : !validateEmail(value) ? 'Please enter a valid email address.' : '';
    }
    if (name === 'password') {
      fieldErrors.password = !value.trim() ? 'Password is required.'
        : !validatePassword(value) ? 'Password must be at least 6 characters and not all numbers.' : '';
    }
    if (name === 'password_confirmation') {
      fieldErrors.password_confirmation = value !== form.password ? 'Passwords do not match.' : '';
    }

    setErrors(fieldErrors);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const fieldErrors = {};
    if (!form.name.trim()) {
      fieldErrors.name = 'Name is required.';
    } else if (!validateName(form.name)) {
      fieldErrors.name = 'Name must contain only letters.';
    }

    if (!form.email.trim()) {
      fieldErrors.email = 'Email is required.';
    } else if (!validateEmail(form.email)) {
      fieldErrors.email = 'Please enter a valid email address.';
    }

    if (!form.password.trim()) {
      fieldErrors.password = 'Password is required.';
    } else if (!validatePassword(form.password)) {
      fieldErrors.password = 'Password must be at least 6 characters and not all numbers.';
    }

    if (!form.password_confirmation.trim()) {
      fieldErrors.password_confirmation = 'Confirm Password is required.';
    } else if (form.password !== form.password_confirmation) {
      fieldErrors.password_confirmation = 'Passwords do not match.';
    }

    setErrors(fieldErrors);

    if (Object.values(fieldErrors).some((msg) => msg)) return;

    try {
      const res = await axios.post(`${API_BASE_URL}/api/register`, form, { withCredentials: true });
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      console.error(err.response?.data);
      setSubmitError('Registration failed. Please check input.');
    }

    if (err.response?.status === 422) {
    const validationErrors = err.response.data.errors;
    if (validationErrors.email?.[0]) {
      setErrors((prev) => ({ ...prev, email: validationErrors.email[0] }));
    } else {
      setSubmitError('Registration failed. Please check input.');
    }
  } else {
    setSubmitError('Registration failed. Please check input.');
  }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8">
        <h2 className="text-3xl font-bold text-center text-zinc-800 mb-6">Join Us</h2>
        {submitError && <div className="text-red-500 text-center mb-4">{submitError}</div>}
        <form onSubmit={handleRegister} className="space-y-4">

          {/* Name */}
          <div>
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 ${
                errors.name ? 'border-red-500' : 'border-gray-300 focus:ring-zinc-800'
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 ${
                errors.email ? 'border-red-500' : 'border-gray-300 focus:ring-zinc-800'
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 pr-10 border rounded-md focus:outline-none focus:ring-2 ${
                errors.password ? 'border-red-500' : 'border-gray-300 focus:ring-zinc-800'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              name="password_confirmation"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={form.password_confirmation}
              onChange={handleChange}
              className={`w-full px-4 py-3 pr-10 border rounded-md focus:outline-none focus:ring-2 ${
                errors.password_confirmation ? 'border-red-500' : 'border-gray-300 focus:ring-zinc-800'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
            >
              <FontAwesomeIcon icon={showConfirm ? faEyeSlash : faEye} />
            </button>
            {errors.password_confirmation && (
              <p className="text-red-500 text-sm mt-1">{errors.password_confirmation}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-zinc-900 text-white py-4 rounded-full hover:bg-zinc-800 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
