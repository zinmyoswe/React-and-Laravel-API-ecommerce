import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import API_BASE_URL from '../config';

function CartPage() {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Track route changes
  const token = localStorage.getItem('token');
  const { cartItems, totalItems, updateQuantity, initialLoading, fetchCart, isUpdating   } = useCart();

  // ✅ Fetch latest cart when CartPage is mounted
  useEffect(() => {
    fetchCart();
  }, [location]);

  const grandTotal = cartItems.reduce((sum, item) => {
    return sum + parseFloat(item.product.price) * item.quantity;
  }, 0);

  return (
    <div className="p-4 md:p-8">
      {initialLoading ? (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-7 order-1 space-y-6">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="flex gap-4 border-b pb-4 animate-pulse">
                <div className="w-28 md:w-36 h-28 md:h-36 bg-gray-300 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                  <div className="h-4 bg-gray-300 rounded w-1/2" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-300 rounded" />
                  <div className="w-4 h-4 bg-gray-300 rounded" />
                  <div className="w-8 h-8 bg-gray-300 rounded" />
                </div>
              </div>
            ))}
          </div>
          <div className="col-span-12 md:col-span-3 order-2 space-y-4 p-4 animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <hr />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <hr />
            <div className="h-10 bg-gray-300 rounded w-full" />
            <div className="h-10 bg-gray-300 rounded w-full" />
            <div className="h-[57px] bg-gray-300 rounded w-full" />
          </div>
          <div className="hidden md:block md:col-span-1" />
        </div>
      ) : cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-12 gap-6">
          <div className="hidden" />
          <div className="col-span-12 md:col-span-7 order-1">
            <h1 className="text-2xl font-bold mb-6">
              Bag{' '}
              {totalItems > 0 && (
                <span className="text-zinc-900">
                  ({totalItems} item{totalItems > 1 ? 's' : ''})
                </span>
              )}
            </h1>
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.product_id + item.size} className="flex gap-4 border-b pb-4">
                  <img
                    src={item.product.productimage}
                    alt={item.product.productname}
                    className="w-28 md:w-36 h-28 md:h-36 rounded"
                  />
                  <div className="flex-1">
                    <h2 className="font-semibold">{item.product.productname}</h2>
                    <p className="text-sm text-gray-500">
                      Size: <strong>{item.size}</strong>
                    </p>
                    <p className="text-gray-600">
                      ${item.product.price} × {item.quantity} = $
                      {(item.quantity * parseFloat(item.product.price)).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="px-1 py-1 rounded-full border-[1px] border-zinc-200 hover:bg-gray-100 hover:border-zinc-50"
                      onClick={() =>
                        updateQuantity(item.product_id, item.quantity - 1, item.size)
                      }
                    >
                      {item.quantity === 1 ? (
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          width="24px"
                          height="24px"
                          fill="none"
                        >
                          <path
                            stroke="currentColor"
                            strokeMiterlimit="10"
                            strokeWidth="1.5"
                            d="M13.75 10v7m-3.5-7v7m-3.5-8.5V17c0 1.24 1.01 2.25 2.25 2.25h6c1.24 0 2.25-1.01 2.25-2.25V7.75h2.25m-10-3h3.75c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5H4.5"
                          ></path>
                        </svg>
                      ) : (
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          width="24px"
                          height="24px"
                          fill="none"
                        >
                          <path
                            stroke="currentColor"
                            strokeMiterlimit="10"
                            strokeWidth="1.5"
                            d="M18 12H6"
                          ></path>
                        </svg>
                      )}
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="px-1 py-1 rounded-full border-[1px] border-zinc-200 hover:bg-gray-100 hover:border-zinc-50"
                      onClick={() =>
                        updateQuantity(item.product_id, item.quantity + 1, item.size)
                      }
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        width="24px"
                        height="24px"
                        fill="none"
                      >
                        <path
                          stroke="currentColor"
                          strokeMiterlimit="10"
                          strokeWidth="1.5"
                          d="M18 12H6m6 6V6"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-12 md:col-span-3 order-2">
            <div className="p-4 space-y-4">
              <h2 className="text-xl font-semibold">Order Summary</h2>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Delivery & Handling</span>
                <span className="uppercase">Free</span>
              </div>
              <hr />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
              <hr />

              {!token && (
                <button
                  className="w-full py-4 rounded-full bg-zinc-900 text-white hover:bg-zinc-800"
                  onClick={() => navigate('/guest-shipping')}
                >
                  Guest Checkout
                </button>
              )}

              <button
                className="w-full bg-zinc-900 text-white py-4 rounded-full hover:bg-zinc-800"
                onClick={() => {
                  if (token) {
                    navigate('/member-shipping');
                  } else {
                    navigate('/login');
                  }
                }}
              >
                Member Checkout
              </button>

              <button className="w-full border-2 py-4 border-gray-400 hover:bg-gray-100 rounded-full flex items-center justify-center transition">
                <img
                  src="https://www.adidas.co.th/static/checkout/react/09211aa/assets/img/accepted-payment-methods/icon-adidas-paypal.svg"
                  alt="PayPal"
                  className="h-[20px]"
                />
              </button>
            </div>
          </div>

          <div className="hidden md:block md:col-span-1" />
        </div>
      )}
    </div>
  );
}

export default CartPage;
