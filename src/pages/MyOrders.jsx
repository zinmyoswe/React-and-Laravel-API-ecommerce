import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';  
import API_BASE_URL from '../config';

const statusColors = {
  paid:     { bg: 'bg-green-100',   text: 'text-green-800',   dot: 'bg-green-600' },
  pending:  { bg: 'bg-yellow-100',  text: 'text-yellow-800',  dot: 'bg-yellow-600' },
  cancelled:{ bg: 'bg-red-100',    text: 'text-red-800',     dot: 'bg-red-600' },
  refunded: { bg: 'bg-purple-100', text: 'text-purple-800',  dot: 'bg-purple-600' },
  shipping: { bg: 'bg-blue-100',   text: 'text-blue-800',    dot: 'bg-blue-600' },
  complete: { bg: 'bg-pink-100',   text: 'text-pink-800',    dot: 'bg-pink-600' },
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
          withCredentials: true,
        });
        setUser(res.data);
      } catch (err) {
        console.error('Error fetching user', err);
        setError('Please log in to view your orders.');
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const res = await axios.get(`${API_BASE_URL}/api/orders/user/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
          withCredentials: true,
        });

        setTimeout(() => {
          setOrders(res.data);
          setLoading(false);
        }, 100);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getEstimatedDelivery = (createdAt, deliveryOption) => {
    const orderDate = new Date(createdAt);
    let startOffset, endOffset;

    if (deliveryOption === 'express') {
      startOffset = 1;
      endOffset = 3;
    } else {
      startOffset = 5;
      endOffset = 7;
    }

    const startDate = new Date(orderDate);
    startDate.setDate(orderDate.getDate() + startOffset);

    const endDate = new Date(orderDate);
    endDate.setDate(orderDate.getDate() + endOffset);

    const options = { month: 'short', day: 'numeric' };
    return `${startDate.toLocaleDateString(undefined, options)} - ${endDate.toLocaleDateString(undefined, options)}`;
  };

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2">My Orders</h2>
      {orders.length === 0 ? (
        <p className="text-center text-gray-600">You have no orders yet.</p>
      ) : (
        <ul className="space-y-6">
          {orders.map((order) => {
            const total = parseFloat(order.total) || 0;
            const shippingFee = parseFloat(order.shipping_fee) || 0;
            const grandTotal = (total + shippingFee).toFixed(2);
            const estimatedDelivery = getEstimatedDelivery(order.created_at, order.delivery_option);

            const statusKey = order.status.toLowerCase();
            const colors = statusColors[statusKey] || {
              bg: 'bg-gray-100',
              text: 'text-gray-800',
              dot: 'bg-gray-600',
            };

            return (
              <li
                key={order.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="space-y-1 md:w-4/6">
                  <p className="text-sm text-gray-500"><span className="font-semibold">Order ID:</span> {order.id}</p>
                  <p className="text-sm"><span className="font-semibold">Placed on:</span> {new Date(order.created_at).toLocaleString()}</p>
                  <p className="text-sm"><span className="font-semibold">Estimated Delivery:</span> {estimatedDelivery}</p>

                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-700">
                    <p><span className="font-semibold">Total:</span> ${total.toFixed(2)}</p>
                    <p><span className="font-semibold">Shipping Fee:</span> ${shippingFee.toFixed(2)}</p>
                    <p><span className="font-semibold">Grand Total:</span> ${grandTotal}</p>
                    <p><span className="font-semibold">Payment:</span> {order.payment_method}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end md:w-2/6 mt-4 md:mt-0">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full ${colors.bg} ${colors.text} text-sm font-semibold`}
                  >
                    <span className={`w-2 h-2 mr-2 rounded-full ${colors.dot}`}></span>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>

                  <Link
                    to={`/orderitem/${order.id}`}
                    className="ml-4 px-4 py-2 border border-zinc-900 text-dark rounded-full hover:bg-zinc-100 transition"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    View Details
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MyOrders;
