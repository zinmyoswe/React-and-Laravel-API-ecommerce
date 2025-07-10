import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import API_BASE_URL from '../config';
import { PDFDownloadLink } from '@react-pdf/renderer';
import OrderInvoice from './../components/OrderInvoice';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';

const OrderItem = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/orders/${orderId}/details`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
          withCredentials: true,
        });
        setOrder(res.data);
      } catch (err) {
        console.error('Error fetching order details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-16 h-16 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return <div className="p-4 text-red-600">Order not found.</div>;
  }

  // Calculate totals
  const total = order.items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const shippingFee = Number(order.shipping_fee);
  const grandTotal = (total + shippingFee).toFixed(2);

  // Estimate delivery
  const placedDate = new Date(order.created_at);
  let estimatedDelivery = '';

  if (order.delivery_option === 'express') {
    const start = new Date(placedDate);
    start.setDate(start.getDate() + 1);
    const end = new Date(placedDate);
    end.setDate(end.getDate() + 3);
    estimatedDelivery = `${start.toDateString()} - ${end.toDateString()}`;
  } else {
    const start = new Date(placedDate);
    start.setDate(start.getDate() + 5);
    const end = new Date(placedDate);
    end.setDate(end.getDate() + 7);
    estimatedDelivery = `${start.toDateString()} - ${end.toDateString()}`;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded shadow relative">
      {/* Download Button - top right */}
      <div className="absolute top-4 right-4">
        <PDFDownloadLink
          document={<OrderInvoice order={order} />}
          fileName={`invoice-order-${order.id}.pdf`}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-black border border-zinc-900 rounded-full hover:bg-zinc-100"
        >
          {({ loading }) => (
            <>
              <FontAwesomeIcon icon={faPrint} className="mr-2" />
              {loading ? 'Generating...' : 'Download Invoice'}
            </>
          )}
        </PDFDownloadLink>
      </div>

      <h2 className="text-xl font-bold mb-6">Order ID: {order.id}</h2>

      <div className="border-t pt-4 space-y-2 text-sm text-gray-700">
        <p><strong>Total:</strong> ${total.toFixed(2)}</p>
        <p><strong>Shipping Fee:</strong> ${shippingFee.toFixed(2)}</p>
        <p><strong>Grand Total:</strong> ${grandTotal}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Payment:</strong> {order.payment_method}</p>
        <p><strong>Placed on:</strong> {new Date(order.created_at).toLocaleString()}</p>
        <p><strong>Estimated Delivery:</strong> {estimatedDelivery}</p>
      </div>

      <ul className="space-y-4 mt-6 mb-6 border rounded-md">
        {order.items.map((item) => (
          <li key={item.id} className="flex p-4">
            <img
              src={item.product.productimage}
              alt={item.product.productname}
              className="w-36 h-36 object-fill rounded-md mr-4"
            />
            <div>
              <p className="font-semibold">{item.product.productname}</p>
              <p>Size: {item.size || 'N/A'}</p>
              <p>Color: {item.color || 'N/A'}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ${Number(item.price).toFixed(2)}</p>
              <p>Subtotal: ${(Number(item.price) * item.quantity).toFixed(2)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderItem;
