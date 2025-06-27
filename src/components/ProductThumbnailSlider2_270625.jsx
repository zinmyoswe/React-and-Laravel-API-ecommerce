import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import API_BASE_URL from '../config';

const ProductThumbnailSlider2 = () => {
  const [products, setProducts] = useState([]);
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [loading, setLoading] = useState(true); // added loading state

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);

    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/products`, {
          params: {
            gender: 'Women',
            sort: 'newest',
            limit: 12,
          },
        });
        setProducts(res.data);
        setTimeout(() => {
          setLoading(false);  // simulate 0.5s loading delay
        }, 100);
      } catch (error) {
        console.error('Failed to load products', error);
        setLoading(false);
      }
    };

    fetchProducts();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const itemsPerPage = isMobile ? 1 : 4;
  const maxIndex = Math.max(0, products.length - itemsPerPage);

  const next = () => {
    if (index < maxIndex) setIndex((prev) => prev + 1);
  };

  const prev = () => {
    if (index > 0) setIndex((prev) => prev - 1);
  };

  // Loading skeleton placeholder
  if (loading) {
    return (
      <div className="my-6 px-4 animate-pulse">
        {/* <h2 className="text-2xl font-bold mb-4 uppercase ml-4 sm:ml-9 bg-gray-300 w-32 h-6 rounded"></h2> */}
        <div className="flex gap-4 overflow-hidden">
          {[...Array(isMobile ? 1 : 4)].map((_, i) => (
            <div key={i} className="p-2 w-full">
              <div className="w-full h-[336px] bg-gray-200 rounded mb-2"></div>
              <div className="w-3/4 h-4 bg-gray-200 mb-1 rounded"></div>
              <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Main slider UI
  return (
    <div className="relative my-6 px-4">
      <h2 className="text-2xl font-bold mb-4 uppercase ml-4 sm:ml-9">
        Trend Now
      </h2>

      {/* Desktop Slider */}
      {!isMobile && (
        <div className="flex items-center overflow-hidden relative">
          <button
            onClick={prev}
            disabled={index === 0}
            className={`p-2 mr-2 rounded-full border bg-white z-10 ${
              index === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-black'
            }`}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          <div className="overflow-hidden w-full">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                width: `${(products.length * 30) / itemsPerPage}%`,
                transform: `translateX(-${(95 / itemsPerPage) * index}%)`,
              }}
            >
              {products.map((p) => (
                <div
                  key={p.productid}
                  className="p-2"
                  style={{ width: `${100 / products.length}%`, minWidth: `${100 / itemsPerPage}%` }}
                >
                  <Link to={`/product/${p.productid}`}>
                    <img
                      src={p.productimage}
                      alt={p.productname}
                      className="w-full h-[336px]  object-fill rounded mb-2"
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

export default ProductThumbnailSlider2;
