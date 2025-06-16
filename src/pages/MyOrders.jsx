import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Step 1: Get logged-in user details
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/user', {
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
      }
    };

    fetchUser();
  }, [token]);

  useEffect(() => {
    // Step 2: Once user is fetched, get their orders
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const res = await axios.get(`http://localhost:8080/api/orders/user/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
          withCredentials: true,
        });
        setOrders(res.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders');
      }
    };

    fetchOrders();
  }, [user]);

  if (error) return <div className="p-4 text-red-600">{error}</div>;

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
