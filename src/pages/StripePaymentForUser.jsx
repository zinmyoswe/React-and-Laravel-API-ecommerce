// src/pages/StripePaymentForUser.jsx
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const stripePromise = loadStripe('pk_test_51Q7olW06MBYCQvZZjq94nokIXhTsKpp8QK3gBxKkuFGfLxfFpHnn6ucM7BwaqET1uXGWwILDAXZXZWxQaPWhW7EL00XwNhWOA3');

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();

  const { orderId, amount } = location.state || {};
  const [name, setName] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    const { token, error } = await stripe.createToken(cardElement, { name });

    if (error) {
      alert(error.message);
      return;
    }

    try {
      console.log('Submitting member payment:', {
        amount,
        token: token.id,
        order_id: orderId,
        name,
      });

      const res = await axios.post(
        'http://localhost:8080/api/payment/charge',
        {
          amount,
          token: token.id,
          order_id: orderId,
          name,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        }
      );

      alert('Payment successful!');
      navigate('/order-success');
    } catch (err) {
      console.error('Payment failed:', err);
      alert('Payment failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 space-y-4">
      <h2 className="text-xl font-bold">Complete Payment</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name on Card
        </label>
        <input
          type="text"
          required
          className="w-full border rounded px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <CardElement className="border p-4 rounded" />

      <button
        type="submit"
        disabled={!stripe}
        className="bg-zinc-900 text-white px-4 py-2 rounded"
      >
        Pay ${amount}
      </button>
    </form>
  );
}

export default function StripePaymentForUser() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
