import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config';

const SearchModal = ({ show, onClose }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!show) {
      setQuery('');
      setSuggestions([]);
    }
  }, [show]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query) {
        axios
          .get(`${API_BASE_URL}/api/search/products?q=${query}`)
          .then((res) => {
            setSuggestions(res.data.products || []);
          })
          .catch((err) => {
            console.error('Search error:', err);
            setSuggestions([]);
          });
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      navigate(`/products?search=${query}`);
      handleClose();
    }
  };

  const handleSearchLinkClick = (term) => {
    handleClose(() => {
      navigate(`/products?search=${encodeURIComponent(term)}`);
    });
  };

  const handleSuggestionClick = (productid) => {
    handleClose(() => {
      navigate(`/product/${productid}`);
    });
  };

  const handleClose = (callback) => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setQuery('');
      setSuggestions([]);
      onClose();
      if (callback) callback();
    }, 300); // match transition duration
  };

  if (!show && !isClosing) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-start top-0 transition-opacity duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="bg-white w-full md:h-[500px] h-full p-4 relative overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-4">
          {/* Logo */}
          <div className="w-2/12 text-xl font-bold">
            <svg aria-hidden="true" className="swoosh-svg" focusable="false" viewBox="0 0 24 24" role="img" width="79" height="79" fill="none">
              <path fill="currentColor" fillRule="evenodd" d="M21 8.719L7.836 14.303C6.74 14.768 5.818 15 5.075 15c-.836 0-1.445-.295-1.819-.884-.485-.76-.273-1.982.559-3.272.494-.754 1.122-1.446 1.734-2.108-.144.234-1.415 2.349-.025 3.345.275.2.666.298 1.147.298.386 0 .829-.063 1.316-.19L21 8.719z" clipRule="evenodd" />
            </svg>
          </div>

          {/* Search Input */}
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
              />
            </svg>

            <input
              type="text"
              className="w-full border rounded-full bg-[#f5f5f5] p-1 pl-10 text-lg"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Close Button */}
          <div className="w-2/12 text-right">
            <button onClick={() => handleClose()} className="text-2xl font-bold">✕</button>
          </div>
        </div>

        {/* Popular Search Terms */}
        <div className="flex items-center justify-between px-4 font-medium">
          <div className="w-2/12"></div>
          <div className="w-8/12">
            <p className="text-[#707072] mt-2 mb-4">Popular Search Terms</p>
            <div className="flex flex-row gap-2">
              {['jordan', 'Nike Air', 'sportswear', 'tshirt', 'jacket'].map(term => (
                <button
                  key={term}
                  onClick={() => handleSearchLinkClick(term)}
                  className="bg-[#f5f5f5] py-[6px] px-[16px] rounded-full"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
          <div className="w-2/12"></div>
        </div>

        {/* Suggestions */}
        <div className="mt-4 px-8 grid grid-cols-2 md:grid-cols-6 gap-1">
          {suggestions.map(product => (
            <div
              key={product.productid}
              onClick={() => handleSuggestionClick(product.productid)}
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
