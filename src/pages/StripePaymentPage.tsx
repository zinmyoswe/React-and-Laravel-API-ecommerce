// src/pages/StripePaymentPage.tsx
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const stripePromise = loadStripe('pk_test_51Q7olW06MBYCQvZZjq94nokIXhTsKpp8QK3gBxKkuFGfLxfFpHnn6ucM7BwaqET1uXGWwILDAXZXZWxQaPWhW7EL00XwNhWOA3'); // Replace with your Stripe publishable key

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();

  const { orderId, amount } = location.state || {}; // 💡 comes from guest shipping page

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    const { token, error } = await stripe.createToken(cardElement);

    if (error) {
      alert(error.message);
      return;
    }

    try {
      const res = await axios.post('http://localhost:8080/api/payment/charge', {
        amount: amount,
        token: token.id,
        order_id: orderId,
      });

      alert('Payment successful!');
      navigate('/order-success');
    } catch (err) {
      console.error(err);
      alert('Payment failed. Try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 space-y-4">
      <h2 className="text-xl font-bold">Complete Payment</h2>
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

export default function StripePaymentPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
