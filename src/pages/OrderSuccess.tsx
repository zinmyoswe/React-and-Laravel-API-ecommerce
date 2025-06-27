import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function OrderSuccess() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white px-4">
      <CheckCircle className="text-zinc-900" size={80} />
      <h1 className="text-3xl font-bold text-zinc-900 mt-4">Order Placed Successfully!</h1>
      <p className="text-zinc-900 mt-2 text-center">
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
          className="bg-zinc-200 text-dark px-5 py-2 rounded hover:bg-zinc-300 transition"
        >
          View My Orders
        </Link>
      </div>
    </div>
  );
}
