import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function OrderSuccess() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-50 px-4">
      <CheckCircle className="text-green-600" size={80} />
      <h1 className="text-3xl font-bold text-green-700 mt-4">Order Placed Successfully!</h1>
      <p className="text-gray-700 mt-2 text-center">
        Thank you for your purchase. Your order is confirmed and being processed.
      </p>

      <div className="mt-6 flex space-x-4">
        <Link
          to="/"
          className="bg-zinc-900 text-white px-5 py-2 rounded hover:bg-zinc-800 transition"
        >
          Continue Shopping
        </Link>
        <Link
          to="/orders"
          className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-500 transition"
        >
          View My Orders
        </Link>
      </div>
    </div>
  );
}
