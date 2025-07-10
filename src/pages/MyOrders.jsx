import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';  // <-- Import Link
import API_BASE_URL from '../config';

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
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => {
            const total = parseFloat(order.total) || 0;
            const shippingFee = parseFloat(order.shipping_fee) || 0;
            const grandTotal = (total + shippingFee).toFixed(2);

            const estimatedDelivery = getEstimatedDelivery(order.created_at, order.delivery_option);

            return (
              <li key={order.id} className="p-4 border rounded">
                <p><strong>Order ID:</strong> {order.id}</p>
                <p><strong>Total:</strong> ${total.toFixed(2)}</p>
                <p><strong>Shipping Fee:</strong> ${shippingFee.toFixed(2)}</p>
                <p><strong>Grand Total:</strong> ${grandTotal}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Payment:</strong> {order.payment_method}</p>
                <p><strong>Placed on:</strong> {new Date(order.created_at).toLocaleString()}</p>
                <p><strong>Estimated Delivery:</strong> {estimatedDelivery}</p>
                <Link
                  to={`/orderitem/${order.id}`}
                  className="inline-block mt-2 text-blue-600 hover:underline"
                >
                  View Details
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MyOrders;
