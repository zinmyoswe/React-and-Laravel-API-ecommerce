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
    fetchCart(); // Refresh cart
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const grandTotal = cartItems.reduce((sum, item) => {
    return sum + parseFloat(item.product.price) * item.quantity;
  }, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.product_id} className="flex items-center gap-4 border-b pb-4">
              <img
                src={item.product.productimage}
                alt={item.product.productname}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h2 className="font-semibold">{item.product.productname}</h2>
                {/* <!-- 🆕 This line shows the size --> */}
                <p className="text-sm text-gray-500">Size: <strong>{item.size}</strong></p>
                <p className="text-gray-600">${item.product.price} × {item.quantity} = ${(item.quantity * parseFloat(item.product.price)).toFixed(2)}</p>
              </div>

              {/* Update quantity */}
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
          <div className="text-right text-xl font-bold mt-4">
            Grand Total: ${grandTotal.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
