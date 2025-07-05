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
import API_BASE_URL from '../config';

const stripePromise = loadStripe('pk_test_51Q7olW06MBYCQvZZjq94nokIXhTsKpp8QK3gBxKkuFGfLxfFpHnn6ucM7BwaqET1uXGWwILDAXZXZWxQaPWhW7EL00XwNhWOA3');

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();

  const { orderId, amount } = location.state || {};
  const [name, setName] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [defaultCard, setDefaultCard] = useState(false);

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
      const res = await axios.post(
        `${API_BASE_URL}/api/payment/charge`,
        {
          amount,
          token: token.id,
          order_id: orderId,
          name,
          save_card: saveCard,
          default_card: defaultCard,
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
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 space-y-6">
      <h2 className="text-xl font-bold mb-2">Enter your payment details</h2>

      <div>
        <label className="block text-sm font-medium mb-1">Name on Card</label>
        <input
          type="text"
          required
          className="w-full border rounded px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Card Details</label>
        <CardElement
          className="border rounded px-3 py-3"
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#32325d',
                '::placeholder': { color: '#a0aec0' },
              },
              invalid: {
                color: '#fa755a',
              },
            },
          }}
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          id="saveCard"
          type="checkbox"
          checked={saveCard}
          onChange={(e) => setSaveCard(e.target.checked)}
          className="w-4 h-4 accent-black"
        />
        <label htmlFor="saveCard">Save card for later use</label>
      </div>

      <div className="flex items-center space-x-2">
        <input
          id="defaultCard"
          type="checkbox"
          checked={defaultCard}
          onChange={(e) => setDefaultCard(e.target.checked)}
          className="w-4 h-4 accent-black"
        />
        <label htmlFor="defaultCard">Set as default card</label>
      </div>

      <button
        type="submit"
        disabled={!stripe}
        className="bg-zinc-900 text-white px-4 py-2 rounded w-full"
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
