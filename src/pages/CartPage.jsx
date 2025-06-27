import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // ✅ create session id if not found
  let sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('session_id', sessionId);
  }

  // ✅ Load cart (guest or user)
  const fetchCart = async () => {
    try {
      if (token) {
        const res = await axios.get(`${API_BASE_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(res.data);
      } else {
        const res = await axios.get(`${API_BASE_URL}/api/cart/session/${sessionId}`, {
          headers: { 'Session-Id': sessionId },
        });
        setCartItems(res.data);
      }
    } catch (err) {
      console.error('Error loading cart:', err.response?.data || err.message);
    }
  };

  // ✅ Update quantity (PUT or DELETE)
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
          withCredentials: true,
        });
      } else {
        await axios.put(
          url,
          { quantity: newQuantity, size },
          {
            headers,
            withCredentials: true,
          }
        );
      }

      fetchCart();
    } catch (err) {
      console.error('Error updating cart:', err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const grandTotal = cartItems.reduce((sum, item) => {
    return sum + parseFloat(item.product.price) * item.quantity;
  }, 0);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-12 gap-6">
          <div className="hidden" />

          {/* Cart List */}
          <div className="col-span-12 md:col-span-7 order-1">
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.product_id + item.size} className="flex gap-4 border-b pb-4">
                  <img
                    src={item.product.productimage}
                    alt={item.product.productname}
                    className="w-28 md:w-36 h-28 md:h-36 rounded"
                  />
                  <div className="flex-1">
                    <h2 className="font-semibold">{item.product.productname}</h2>
                    <p className="text-sm text-gray-500">
                      Size: <strong>{item.size}</strong>
                    </p>
                    <p className="text-gray-600">
                      ${item.product.price} × {item.quantity} = $
                      {(item.quantity * parseFloat(item.product.price)).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1, item.size)}
                    >
                      {item.quantity === 1 ? (
                        <FontAwesomeIcon icon={faTrash} />
                      ) : (
                        <FontAwesomeIcon icon={faMinus} />
                      )}
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1, item.size)}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="col-span-12 md:col-span-3 order-2">
            <div className="p-4 space-y-4">
              <h2 className="text-xl font-semibold">Order Summary</h2>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
              <hr />
              <button
                className={`w-full py-4 rounded-full ${
                  token
                    ? 'bg-zinc-800 text-white cursor-not-allowed'
                    : 'bg-zinc-900 text-white hover:bg-zinc-800'
                }`}
                onClick={() => {
                  if (!token) navigate('/guest-shipping');
                }}
                disabled={!!token} // ✅ disable if user is logged in
              >
                Guest Checkout
              </button>
              <button
                  className="w-full bg-zinc-900 text-white py-4 rounded-full hover:bg-zinc-800"
                  onClick={() => {
                    if (token) {
                      navigate('/member-shipping');
                    } else {
                      navigate('/login'); // or '/login?redirect=/member-shipping' if you want auto-redirect after login
                    }
                  }}
                >
                  Member Checkout
                </button>

              <button className="w-full border-2 border-gray-400 hover:bg-gray-100 rounded-full flex items-center justify-center transition">
                <img
                  src="/images/paypal%20(1).png"
                  alt="PayPal"
                  className="h-[57px]"
                />
              </button>
            </div>
          </div>

          <div className="hidden md:block md:col-span-1" />
        </div>
      )}
    </div>
  );
}

export default CartPage;
