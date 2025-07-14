// src/contexts/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const token = localStorage.getItem('token');
  let sessionId = localStorage.getItem('session_id');


  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('session_id', sessionId);
  }

  // const fetchCart = async () => {
    
  //   try {
  //     const headers = token
  //       ? { Authorization: `Bearer ${token}` }
  //       : { 'Session-Id': sessionId };
  //     const url = token
  //       ? `${API_BASE_URL}/api/cart`
  //       : `${API_BASE_URL}/api/cart/session/${sessionId}`;

  //     const res = await axios.get(url, { headers });
  //     setCartItems(res.data);
  //   } catch (err) {
  //     console.error('Fetch cart error:', err);
  //   } finally {
  //     setInitialLoading(false);
  //   }
  // };

  const fetchCart = async ({ isInitial = false } = {}) => {
  if (isInitial) {
    setInitialLoading(true);
  } else {
    setIsUpdating(true);
  }

  try {
    const headers = token
      ? { Authorization: `Bearer ${token}` }
      : { 'Session-Id': sessionId };
    const url = token
      ? `${API_BASE_URL}/api/cart`
      : `${API_BASE_URL}/api/cart/session/${sessionId}`;

    const res = await axios.get(url, { headers });
    setCartItems(res.data);
  } catch (err) {
    console.error('Fetch cart error:', err);
  } finally {
    if (isInitial) {
      setInitialLoading(false);
    } else {
      setIsUpdating(false);
    }
  }
};

  const updateQuantity = async (productId, newQuantity, size) => {
    try {
      const headers = token
        ? { Authorization: `Bearer ${token}` }
        : { 'Session-Id': sessionId };
      const url = token
        ? `${API_BASE_URL}/api/cart/${productId}`
        : `${API_BASE_URL}/api/cart/guest/${productId}`;

      if (newQuantity < 1) {
        await axios.delete(url, {
          headers,
          data: { size },
        });
      } else {
        await axios.put(
          url,
          { quantity: newQuantity, size },
          { headers }
        );
      }
      fetchCart(); // ✅ update global state
    } catch (err) {
      console.error('Update cart error:', err);
    }
  };

  useEffect(() => {
    fetchCart({ isInitial: true });
  }, [token]);

  const totalItems = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, totalItems, fetchCart, updateQuantity, initialLoading }}>
      {children}
    </CartContext.Provider>
  );
};
