import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // ✅ loading state
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

        // ✅ Add a 0.5s delay before showing the result
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

  if (error) return <div className="p-4 text-red-600">{error}</div>;

  if (loading) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin"></div>

        {/* Text */}
        <p className="text-gray-500 text-sm">Fetching your orders... Please Wait</p>
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
          {orders.map((order) => (
            <li key={order.id} className="p-4 border rounded">
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Total:</strong> ${order.total}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Payment:</strong> {order.payment_method}</p>
              <p><strong>Placed on:</strong> {new Date(order.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyOrders;
