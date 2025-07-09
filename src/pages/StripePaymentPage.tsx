// src/pages/StripePaymentPage.tsx
import React, { useState, useEffect } from 'react';
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

const stripePromise = loadStripe('pk_test_51Q7olW06MBYCQvZZjq94nokIXhTsKpp8QK3gBxKkuFGfLxfFpHnn6ucM7BwaqET1uXGWwILDAXZXZWxQaPWhW7EL00XwNhWOA3'); // Replace with your Stripe publishable key

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

const cardBrandIcons = {
  visa: 'https://js.stripe.com/v3/fingerprinted/img/visa-729c05c240c4bdb47b03ac81d9945bfe.svg',
  mastercard: 'https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg',
  amex: 'https://js.stripe.com/v3/fingerprinted/img/amex-a49b82f46c5cd6a96a6e418a6ca1717c.svg',
  discover: 'https://js.stripe.com/v3/fingerprinted/img/discover-ac52cd46f89fa40a29a0bfb954e33173.svg',
  diners: 'https://js.stripe.com/v3/fingerprinted/img/diners-fbcbd3360f8e3f629cdaa80e93abdb8b.svg',
  jcb: 'https://js.stripe.com/v3/fingerprinted/img/jcb-271fd06e6e7a2c52692ffa91a95fb64f.svg',
  unionpay: 'https://js.stripe.com/v3/fingerprinted/img/unionpay-8a10aefc7295216c338ba4e1224627a1.svg',
};

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();

  const { orderId, amount } = location.state || {}; // 💡 comes from guest shipping page
  const [name, setName] = useState('');
   const [saveCard, setSaveCard] = useState(false);
  const [defaultCard, setDefaultCard] = useState(false);
  const [cardBrand, setCardBrand] = useState('default');
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  // const handleCardNumberChange = (event) => {
  //   setCardBrand(event.brand || 'default');
  //   if (event.error) {
  //     setErrors((prev) => ({ ...prev, cardNumber: event.error.message }));
  //   } else {
  //     setErrors((prev) => ({ ...prev, cardNumber: '' }));
  //   }
  // };

  const handleCardNumberChange = (event) => {
  const brand = event.brand;
  // Only set known brands (visa, mastercard, etc.)
  if (brand && brand !== 'unknown') {
    setCardBrand(brand);
  } else {
    setCardBrand('default'); // fallback to <DefaultCardBrandIcon />
  }

  if (event.error) {
    setErrors((prev) => ({ ...prev, cardNumber: event.error.message }));
  } else {
    setErrors((prev) => ({ ...prev, cardNumber: '' }));
  }
};


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});

    let currentErrors = {};
    if (!name.trim()) {
      currentErrors.name = 'Name on card is required';
    } else if (/\d/.test(name)) {
      currentErrors.name = 'Name cannot contain number';
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement._complete) {
      currentErrors.cardNumber = 'Card number is incomplete';
    }

    const expiryElement = elements.getElement(CardExpiryElement);
    if (!expiryElement._complete) {
      currentErrors.expiry = 'Expiry date is incomplete';
    }

    const cvcElement = elements.getElement(CardCvcElement);
    if (!cvcElement._complete) {
      currentErrors.cvc = 'CVV is incomplete';
    }

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      return;
    }

    setStatus('processing');

    const { token, error } = await stripe.createToken(cardNumberElement, { name });

    if (error) {
      setErrors({ cardNumber: error.message });
      setStatus('idle');
      return;
    }

    try {
        // console.log({
        // amount,
        // token: token.id,
        // order_id: orderId,
        // name,
        // });
      await axios.post(`${API_BASE_URL}/api/payment/charge`, {
        amount: amount,
        token: token.id,
        order_id: orderId,
        name: name,
        save_card: saveCard,
        default_card: defaultCard,
      });

      setTimeout(() => {
        setStatus('success');
        setTimeout(() => {
          navigate('/order-success');
        }, 1000);
      }, 1000);
    } catch (err) {
      console.error('Payment failed:', err);
      setStatus('idle');
      alert('Payment failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto mt-10 px-4 sm:px-6 space-y-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2" />
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-6 bg-gray-200 rounded w-1/2" />
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
      </div>
    );
  }

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
         onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
          }}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
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
        {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
      </div>

      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">MM / YY</label>
          <div className="border rounded px-3 py-3">
            <CardExpiryElement options={ELEMENT_OPTIONS} />
          </div>
          {errors.expiry && <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>}
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">CVV</label>
          <div className="border rounded px-3 py-3">
            <CardCvcElement options={ELEMENT_OPTIONS} />
          </div>
          {errors.cvc && <p className="text-red-500 text-sm mt-1">{errors.cvc}</p>}
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
        disabled={!stripe || status === 'processing' || status === 'success'}
        className={`px-6 py-4 rounded-full w-full text-white transition-all duration-300 ${
          status === 'success'
            ? 'bg-green-700'
            : status === 'processing'
            ? 'bg-zinc-900'
            : 'bg-zinc-900 hover:bg-zinc-800'
        }`}
      >
        {status === 'processing' ? (
          <span className="flex justify-center items-center space-x-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span>Processing...</span>
          </span>
        ) : status === 'success' ? (
          <span className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>Success</span>
          </span>
        ) : (
          `Pay $${amount}`
        )}
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
