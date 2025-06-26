import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const ProductThumbnailSlider = () => {
  const [products, setProducts] = useState([]);
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);

    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/products?limit=12');
        setProducts(res.data);
      } catch (error) {
        console.error('Failed to load products', error);
      }
    };

    fetchProducts();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const itemsPerPage = isMobile ? 1 : 4;
  const maxIndex = Math.max(0, products.length - itemsPerPage);

  const next = () => {
    if (index < maxIndex) setIndex(prev => prev + 1);
  };

  const prev = () => {
    if (index > 0) setIndex(prev => prev - 1);
  };

  return (
    <div className="relative my-6 px-4">
      <h2 className="text-2xl font-bold mb-4 uppercase ml-4 sm:ml-9">
        Up to 40% off | Buy 2 Get Extra 40% off
      </h2>

      {/* Desktop Slider */}
      {!isMobile && (
        <div className="flex items-center overflow-hidden relative">
          {/* Left Button */}
          <button
            onClick={prev}
            disabled={index === 0}
            className={`p-2 mr-2 rounded-full border bg-white z-10 ${
              index === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-black'
            }`}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          {/* Slider */}
          <div className="overflow-hidden w-full">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                width: `${(products.length * 30) / itemsPerPage}%`,
                transform: `translateX(-${(95 / itemsPerPage) * index}%)`,
              }}
            >
              {products.map(p => (
                <div
                  key={p.productid}
                  className="p-2"
                  style={{ width: `${100 / products.length}%`, minWidth: `${100 / itemsPerPage}%` }}
                >
                  <Link to={`/product/${p.productid}`}>
                    <img
                      src={p.productimage}
                      alt={p.productname}
                      className="w-full h-[336px] object-cover object-fill rounded mb-2"
                    />
                  </Link>
                  <Link
                    to={`/product/${p.productid}`}
                    className="block font-medium text-sm hover:underline"
                  >
                    {p.productname}
                  </Link>
                  <div className="text-sm text-gray-600">${p.price}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Button */}
          <button
            onClick={next}
            disabled={index >= maxIndex}
            className={`p-2 ml-2 rounded-full border bg-white z-10 ${
              index >= maxIndex ? 'text-gray-400 cursor-not-allowed' : 'text-black'
            }`}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      )}

      {/* Mobile Horizontal Scroll Slider */}
      {isMobile && (
        <div className="overflow-x-auto mt-2 sm:hidden scrollbar-thin">
          <div className="flex gap-4 px-2">
            {products.map((p) => (
              <div key={p.productid} className="min-w-[90%] max-w-[90%] shrink-0">
                <Link to={`/product/${p.productid}`}>
                  <img
                    src={p.productimage}
                    alt={p.productname}
                    className="w-full h-[300px] object-fill rounded mb-2"
                  />
                </Link>
                <Link
                  to={`/product/${p.productid}`}
                  className="block font-medium text-sm hover:underline"
                >
                  {p.productname}
                </Link>
                <div className="text-sm text-gray-600">${p.price}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductThumbnailSlider;
