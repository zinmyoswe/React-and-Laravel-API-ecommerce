// src/pages/GuestShippingPage.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function GuestShippingPage() {
  const navigate = useNavigate();
  const sessionId = localStorage.getItem('session_id');
  const [grandTotal, setGrandTotal] = useState(0);

  const [shipping, setShipping] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    country: '',
  });

  // 🛒 Fetch cart to calculate total
  const fetchCart = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/cart/session/${sessionId}`);
      const total = res.data.reduce((sum, item) => {
        return sum + parseFloat(item.product.price) * item.quantity;
      }, 0);
      setGrandTotal(total.toFixed(2));
    } catch (err) {
      console.error('Error loading cart:', err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleCheckout = async () => {
    try {
      const res = await axios.post('http://localhost:8080/api/checkout', {
        session_id: sessionId,
        payment_method: 'card', // 👈 not 'cod' if you use Stripe
        shipping,
      });

      const orderId = res.data.order_id;
      navigate('/payment', {
        state: {
          orderId: orderId,
          amount: parseFloat(grandTotal), // 💰 send amount to Stripe page
        },
      });
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Failed to place order.');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-4 p-4">
      <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>
      {Object.keys(shipping).map((field) => (
        <input
          key={field}
          type="text"
          placeholder={field.replace('_', ' ').toUpperCase()}
          className="w-full border p-2 rounded mb-2"
          value={shipping[field]}
          onChange={(e) =>
            setShipping({ ...shipping, [field]: e.target.value })
          }
        />
      ))}

      <button
        className="w-full bg-zinc-900 text-white py-3 rounded"
        onClick={handleCheckout}
      >
        Continue to Payment (${grandTotal})
      </button>
    </div>
  );
}

export default GuestShippingPage;
