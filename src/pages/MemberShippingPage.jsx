import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function MemberShippingPage() {
  const navigate = useNavigate();
  const [grandTotal, setGrandTotal] = useState(0);
  const [shipping, setShipping] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    country: '',
  });

  // ✅ Fetch cart total
  const fetchCart = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/cart', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      });
      const total = res.data.reduce((sum, item) => {
        return sum + parseFloat(item.product.price) * item.quantity;
      }, 0);
      setGrandTotal(total.toFixed(2));
    } catch (err) {
      console.error('Error loading cart:', err);
    }
  };

  // ✅ Fetch logged-in user info
  const fetchUser = async () => {
    try {
  
      const res = await axios.get('http://localhost:8080/api/user', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      });
      const user = res.data;
      setShipping((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchUser();
  }, []);

//   const handleCheckout = async () => {
//     try {
//       await axios.post(
//         'http://localhost:8080/api/member/checkout',
//         {
//           payment_method: 'card',
//           shipping,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//           withCredentials: true,
//         }
//       );

//       navigate('/payment', {
//         state: {
//           orderId: res.data.order_id,  // 👈 MUST include this
//           amount: parseFloat(grandTotal),
//         },
//       });
//     } catch (err) {
//       console.error('Checkout error:', err);
//       alert('Failed to place order.');
//     }
//   };

const handleCheckout = async () => {
  try {

    console.log("Submitting checkout:", {
    payment_method: 'card',
    shipping,
    });
    const res = await axios.post(
      'http://localhost:8080/api/member/checkout',
      {
        payment_method: 'card',
        shipping,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      }
    );

    navigate('/user-payment', {
      state: {
        orderId: res.data.order_id,
        amount: parseFloat(grandTotal),
      },
    });
  } catch (err) {
    console.error('Checkout error:', err);
    alert('Failed to place order.');
  }
};


  return (
    <div className="max-w-xl mx-auto mt-10 space-y-4 p-4">
      <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>
      {Object.keys(shipping).map((field) => (
        <input
          key={field}
          type="text"
          placeholder={field.replace('_', ' ').toUpperCase()}
          className="w-full border p-2 rounded mb-2"
          value={shipping[field]}
          onChange={(e) =>
            setShipping({ ...shipping, [field]: e.target.value })
          }
        />
      ))}

      <button
        className="w-full bg-zinc-900 text-white py-3 rounded"
        onClick={handleCheckout}
      >
        Continue to Payment (${grandTotal})
      </button>
    </div>
  );
}

export default MemberShippingPage;
