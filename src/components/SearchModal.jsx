// components/SearchModal.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config';

const SearchModal = ({ show, onClose }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query) {
        axios
          .get(`${API_BASE_URL}/api/search/products?q=${query}`)
          .then((res) => {
            console.log('API response:', res.data);
            setSuggestions(res.data.products || []);
          })
          .catch((err) => {
            console.error('Search error:', err);
            setSuggestions([]);
          });
      } else {
        setSuggestions([]);
      }
    }, 300); // debounce

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      navigate(`/products?search=${query}`);
      onClose();
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-start top-0">
      <div className="bg-white w-full md:h-[500px] h-full p-4 relative overflow-y-auto">
        <div className="flex items-center justify-between px-4">
         {/* Logo */}
<div className="w-2/12 text-xl font-bold">
    <img src="https://images.ctfassets.net/wr0no19kwov9/5qUZljphHJa9o7cebRTaFY/4d5173898d5962f58c68325de0f6921b/brand-kit-symbol-image-09.png?fm=webp&w=3840&q=70"
      width="100"
    />
  
</div>

{/* Search input with SVG inside */}
<div className="w-8/12 relative">
  <svg
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 24 24"
    role="img"
    width="23"
    height="23"
    fill="none"
    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-950 pointer-events-none"
  >
    <path
      stroke="currentColor"
      strokeWidth="1.5"
      d="M13.962 16.296a6.716 6.716 0 01-3.462.954 6.728 6.728 0 01-4.773-1.977A6.728 6.728 0 013.75 10.5c0-1.864.755-3.551 1.977-4.773A6.728 6.728 0 0110.5 3.75c1.864 0 3.551.755 4.773 1.977A6.728 6.728 0 0117.25 10.5a6.726 6.726 0 01-.921 3.407c-.517.882-.434 1.988.289 2.711l3.853 3.853"
    ></path>
  </svg>

  <input
    // autoFocus
    type="text"
    className="w-full border border-gray-300 rounded-full bg-[#f5f5f5] p-2 pl-10 text-lg" // pl-10 for left padding to make space for icon
    placeholder="Search products..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    onKeyDown={handleKeyDown}
  />
</div>

{/* Close button */}
<div className="w-2/12 text-right">
  <button onClick={onClose} className="text-2xl font-bold">✕</button>
</div>
        </div>

        {/* Suggestions */}
        <div className="mt-4 px-8 grid grid-cols-2 md:grid-cols-6 gap-1">
          {suggestions.map(product => (
            <div
              key={product.productid}
              onClick={() => {
                navigate(`/product/${product.productid}`);
                onClose();
              }}
              className="cursor-pointer"
            >
              <img
                src={product.productimage}
                alt={product.productname}
                className="w-56 h-34 object-cover rounded-md"
              />
              <div className="mt-1 text-sm font-medium">{product.productname}</div>
              <div className="text-gray-600 mb-4">${product.price}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
