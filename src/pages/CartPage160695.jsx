import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const sessionId = localStorage.getItem('session_id');

  const fetchCart = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/cart/session/${sessionId}`);
      setCartItems(res.data);
    } catch (err) {
      console.error('Error loading cart:', err);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      await axios.delete(`http://localhost:8080/api/cart/${productId}`, {
        headers: { 'Session-Id': sessionId },
      });
    } else {
      await axios.put(`http://localhost:8080/api/cart/${productId}`, {
        quantity: newQuantity,
      }, {
        headers: { 'Session-Id': sessionId },
      });
    }
    fetchCart();
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const grandTotal = cartItems.reduce((sum, item) => {
    return sum + parseFloat(item.product.price) * item.quantity;
  }, 0);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-12 gap-6">
          {/* Blank left (desktop/tablet only) */}
          <div className="hidden" />

          {/* Cart info */}
          <div className="col-span-12 md:col-span-7 order-1">
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.product_id + item.size} className="flex  gap-4 border-b pb-4">
                  <img
                    src={item.product.productimage}
                    alt={item.product.productname}
                    className="w-28 md:w-36 h-28 md:h-36 rounded"
                  />
                  <div className="flex-1">
                    <h2 className="font-semibold">{item.product.productname}</h2>
                    <p className="text-sm text-gray-500">Size: <strong>{item.size}</strong></p>
                    <p className="text-gray-600">
                      ${item.product.price} × {item.quantity} = ${(item.quantity * parseFloat(item.product.price)).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                    >
                      {item.quantity === 1 ? (
                        <FontAwesomeIcon icon={faTrash} />
                      ) : (
                        <FontAwesomeIcon icon={faMinus} />
                      )}
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary box */}
          <div className="col-span-12 md:col-span-3 order-2">
            <div className=" p-4  space-y-4">
              <h2 className="text-xl font-semibold">Order Summary</h2>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
              <hr />
              <button className="w-full bg-zinc-900 text-white py-4 rounded rounded-full hover:bg-zinc-800">Guest Checkout</button>
              <button className="w-full bg-zinc-900 text-white py-4 rounded rounded-full hover:bg-zinc-800">Member Checkout</button>
              
            </div>
          </div>

          {/* Blank right (desktop/tablet only) */}
          <div className="hidden md:block md:col-span-1" />
        </div>
      )}
    </div>
  );
}

export default CartPage;
