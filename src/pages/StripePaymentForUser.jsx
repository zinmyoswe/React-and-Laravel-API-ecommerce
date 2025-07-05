import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import API_BASE_URL from '../config';
import DefaultCardBrandIcon from '../components/DefaultCardBrandIcon';

const stripePromise = loadStripe('pk_test_51Q7olW06MBYCQvZZjq94nokIXhTsKpp8QK3gBxKkuFGfLxfFpHnn6ucM7BwaqET1uXGWwILDAXZXZWxQaPWhW7EL00XwNhWOA3');

const ELEMENT_OPTIONS = {
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
};

// Card brand icons (replace with your own or use these URLs)
const cardBrandIcons = {
  visa: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg',
  mastercard: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg',
  amex: 'https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo_%282018%29.svg',
  discover: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Discover_Card_logo.svg',
  diners: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Diners_Club_Logo3.svg',
  jcb: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/JCB_logo.svg',
  unionpay: 'https://upload.wikimedia.org/wikipedia/commons/0/04/UnionPay_logo.svg',


};

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();

  const { orderId, amount } = location.state || {};
  const [name, setName] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [defaultCard, setDefaultCard] = useState(false);
  const [cardBrand, setCardBrand] = useState('default');

  const handleCardNumberChange = (event) => {
    setCardBrand(event.brand || 'default');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const cardNumberElement = elements.getElement(CardNumberElement);
    const { token, error } = await stripe.createToken(cardNumberElement, { name });

    if (error) {
      alert(error.message);
      return;
    }

    try {
      await axios.post(
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
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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
   <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto mt-10 px-4 sm:px-6 space-y-6">
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
    <label className="block text-sm font-medium mb-1">Card Number</label>
    <div className="relative border rounded px-3 py-3">
      <CardNumberElement options={ELEMENT_OPTIONS} onChange={handleCardNumberChange} />
      {cardBrand !== 'default' ? (
        <img
          src={cardBrandIcons[cardBrand] || cardBrandIcons.default}
          alt={`${cardBrand} logo`}
          className="absolute right-3 top-3 w-6 sm:w-7 md:w-8 h-auto pointer-events-none select-none"
        />
      ) : (
        <DefaultCardBrandIcon />
      )}
    </div>
  </div>

  <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
    <div className="flex-1">
      <label className="block text-sm font-medium mb-1">MM / YY</label>
      <div className="border rounded px-3 py-3">
        <CardExpiryElement options={ELEMENT_OPTIONS} />
      </div>
    </div>

    <div className="flex-1">
      <label className="block text-sm font-medium mb-1">CVV</label>
      <div className="border rounded px-3 py-3">
        <CardCvcElement options={ELEMENT_OPTIONS} />
      </div>
    </div>
  </div>

  <div className="flex items-center space-x-2">
    <input
      id="saveCard"
      type="checkbox"
      checked={saveCard}
      onChange={(e) => setSaveCard(e.target.checked)}
      className="w-4 h-4 accent-black"
    />
    <label htmlFor="saveCard" className="text-sm">Save card for later use</label>
  </div>

  <div className="flex items-center space-x-2">
    <input
      id="defaultCard"
      type="checkbox"
      checked={defaultCard}
      onChange={(e) => setDefaultCard(e.target.checked)}
      className="w-4 h-4 accent-black"
    />
    <label htmlFor="defaultCard" className="text-sm">Set as default card</label>
  </div>

  <button
    type="submit"
    disabled={!stripe}
    className="bg-zinc-900 text-white px-6 py-4 rounded-full w-full"
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
