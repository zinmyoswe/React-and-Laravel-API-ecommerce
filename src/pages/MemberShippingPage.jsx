// ... All your existing imports
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { getNames, getCode } from 'country-list';
import Select from 'react-select';
import '../assets/css/flag-icons.min.css';

function MemberShippingPage() {
  const navigate = useNavigate();

  const [grandTotal, setGrandTotal] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [shippingFee, setShippingFee] = useState(0);
  const [selectedDelivery, setSelectedDelivery] = useState('');

  const [shipping, setShipping] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    country: '',
  });

  const [errors, setErrors] = useState({});

  const countries = getNames().map((name) => {
    const code = getCode(name);
    return {
      label: name,
      value: name,
      code: code?.toLowerCase(),
    };
  });

  const validate = () => {
    const errs = {};
    if (!shipping.name || !/^[a-zA-Z\s]+$/.test(shipping.name)) {
      errs.name = 'Name must contain only letters and spaces.';
    }
    if (!shipping.email || !/^\S+@\S+\.\S+$/.test(shipping.email)) {
      errs.email = 'Invalid email format.';
    }
    if (!shipping.phone || !/^\d+$/.test(shipping.phone.replace(/\s+/g, ''))) {
      errs.phone = 'Phone must be numeric.';
    }
    if (!shipping.address || shipping.address.length < 10) {
      errs.address = 'Address must be at least 10 characters.';
    }
    if (!shipping.city) {
      errs.city = 'City is required.';
    }
    if (!shipping.postal_code || !/^\d+$/.test(shipping.postal_code)) {
      errs.postal_code = 'Postal code must be numeric.';
    }
    if (!shipping.country) {
      errs.country = 'Country is required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/cart`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      });

      const total = res.data.reduce((sum, item) => {
        return sum + parseFloat(item.product.price) * item.quantity;
      }, 0);

      setGrandTotal(total.toFixed(2));
      setCartItems(res.data);
    } catch (err) {
      console.error('Error loading cart:', err);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      });

      const user = res.data;
      setShipping((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchUser();
  }, []);

  const handleCheckout = async () => {
    if (!validate()) return;

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/member/checkout`,
        {
          payment_method: 'card',
          shipping: {
            ...shipping,
            delivery_option: selectedDelivery,
            shipping_fee: shippingFee,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        }
      );

      navigate('/user-payment', {
        state: {
          orderId: res.data.order_id,
          amount: parseFloat(grandTotal) + shippingFee,
        },
      });
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Failed to place order.');
    }
  };

  // 📅 Date Helpers
  const formatDate = (date) =>
    date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });

  const today = new Date();
  const expressStart = new Date(today);
  expressStart.setDate(today.getDate() + 1);
  const expressEnd = new Date(today);
  expressEnd.setDate(today.getDate() + 3);

  const standardStart = new Date(today);
  standardStart.setDate(today.getDate() + 5);
  const standardEnd = new Date(today);
  standardEnd.setDate(today.getDate() + 7);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 px-2 md:px-8 py-6">
      <div className="hidden md:block md:col-span-1" />
      <div className="hidden md:block md:col-span-1" />

      {/* Shipping Form */}
      <div className="col-span-12 md:col-span-4">
        <div className="max-w-xl mx-auto p-4 space-y-4">
          <h2 className="text-2xl font-semibold">Shipping & Delivery</h2>

          <input
            type="text"
            placeholder="Name"
            className="w-full border p-4 rounded"
            value={shipping.name}
            onChange={(e) => setShipping({ ...shipping, name: e.target.value })}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-4 rounded"
            value={shipping.email}
            onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <input
            type="text"
            placeholder="Phone Number"
            className="w-full border p-4 rounded"
            value={shipping.phone}
            onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

          <input
            type="text"
            placeholder="Address"
            className="w-full border p-4 rounded"
            value={shipping.address}
            onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
          />
          {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}

          <input
            type="text"
            placeholder="City"
            className="w-full border p-4 rounded"
            value={shipping.city}
            onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
          />
          {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}

          <input
            type="text"
            placeholder="Postal Code"
            className="w-full border p-4 rounded"
            value={shipping.postal_code}
            onChange={(e) =>
              setShipping({ ...shipping, postal_code: e.target.value })
            }
          />
          {errors.postal_code && (
            <p className="text-red-500 text-sm">{errors.postal_code}</p>
          )}

          <Select
            options={countries}
            value={countries.find((c) => c.value === shipping.country)}
            onChange={(selected) =>
              setShipping({ ...shipping, country: selected.value })
            }
            classNames={{
              control: () => 'w-full border rounded p-2',
              menu: () => 'mt-2 border rounded shadow z-50 bg-white',
              option: ({ isFocused, isSelected }) =>
                `px-4 py-2 ${isFocused ? 'bg-gray-100' : ''} ${
                  isSelected ? 'bg-gray-200 font-semibold' : ''
                }`,
            }}
            formatOptionLabel={(country) => (
              <div className="flex items-center gap-2">
                <span className={`fi fi-${country.code}`}></span>
                <span>{country.value}</span>
              </div>
            )}
          />
          {errors.country && (
            <p className="text-red-500 text-sm">{errors.country}</p>
          )}

         

          {/* 🚚 Delivery Options */}
          <div className="space-y-2 !mt-16">
            <p className="font-semibold">Choose Delivery Option:</p>

            <div
              className={`p-4 border rounded cursor-pointer ${
                selectedDelivery === 'express' ? 'border-black' : ''
              }`}
              onClick={() => {
                setSelectedDelivery('express');
                setShippingFee(20);
              }}
            >
              <div className="flex justify-between">
                <span>
                  Arrives {formatDate(expressStart)} - {formatDate(expressEnd)}
                </span>
                <span>$20</span>
              </div>
            </div>

            <div
              className={`p-4 border rounded cursor-pointer ${
                selectedDelivery === 'standard' ? 'border-black' : ''
              }`}
              onClick={() => {
                setSelectedDelivery('standard');
                setShippingFee(0);
              }}
            >
              <div className="flex justify-between">
                <span>
                  Arrives {formatDate(standardStart)} -{' '}
                  {formatDate(standardEnd)}
                </span>
                <span className="uppercase">FREE</span>
              </div>
            </div>
          </div>

          <button
            className="w-full bg-zinc-900 text-white py-4 rounded-full mt-4"
            onClick={handleCheckout}
          >
            Continue to Payment (${(parseFloat(grandTotal) + shippingFee).toFixed(2)})
          </button>
        </div>
      </div>

      {/* Cart Summary */}
      <div className="col-span-12 md:col-span-3">
        <div className="p-4 space-y-4">
          <h2 className="text-xl font-semibold">Order Summary</h2>

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${grandTotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Estimated Delivery & Handling</span>
            <span>{shippingFee > 0 ? `$${shippingFee}` : 'FREE'}</span>
          </div>
          <hr />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${(parseFloat(grandTotal) + shippingFee).toFixed(2)}</span>
          </div>
          <hr />

          {cartItems.map((item) => (
            <div
              key={item.product_id + item.size}
              className="flex gap-4 border-b pb-4"
            >
              <img
                src={item.product.productimage}
                alt={item.product.productname}
                className="w-40 h-40 rounded object-fill"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-sm">
                  {item.product.productname}
                </h3>
                <p className="text-sm text-gray-500">
                  Size: {item.size} | Color: {item.product.color}
                </p>
                <p className="text-sm text-gray-600">
                  ${item.product.price} × {item.quantity} = $
                  {(item.quantity * parseFloat(item.product.price)).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden md:block md:col-span-1" />
      <div className="hidden md:block md:col-span-2" />
    </div>
  );
}

export default MemberShippingPage;
