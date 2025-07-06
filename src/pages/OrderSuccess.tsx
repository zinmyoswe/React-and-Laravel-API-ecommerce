import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function OrderSuccess() {
  return (
    <div className="flex flex-col items-center justify-center mt-24 md:mt-1  md:h-screen bg-white px-4">
      <CheckCircle className="text-zinc-900" size={80} />
      <h1 className="text-3xl font-bold text-zinc-900 mt-4">Thank for your order, Zin!
        We're On It

      </h1>
      <p className="text-zinc-900 mt-2 text-center">
        Your order's is in. We're working to get it packed up and out the door.
        except a shipping confirmation email soon.
      </p>

      <div className="mt-6 flex space-x-4">
        <Link
          to="/"
          className="bg-zinc-900 text-white px-5 py-2 rounded-full hover:bg-zinc-800 transition"
        >
          Continue Shopping
        </Link>
        <Link
          to="/orders"
          className="bg-zinc-100 text-dark px-5 py-2 rounded-full hover:bg-zinc-200 transition"
        >
          View My Orders
        </Link>
      </div>
    </div>
  );
}
