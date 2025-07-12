import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import API_BASE_URL from '../config';

const ProductThumbnailSlider = () => {
  const [products, setProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);

    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/products`, {
          params: { gender: 'Unisex', sort: 'asc', limit: 12 },
        });
        setProducts(res.data);

        setTimeout(() => setLoading(false), 100);
      } catch (error) {
        console.error('Failed to load products', error);
        setLoading(false);
      }
    };

    fetchProducts();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update scroll buttons state
  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(container.scrollLeft + container.clientWidth < container.scrollWidth - 1);
  };

  // Scroll by fixed amount
  const scrollLeft = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', checkScrollPosition);
    checkScrollPosition();

    return () => {
      container.removeEventListener('scroll', checkScrollPosition);
    };
  }, [products]);

  // Loading skeletons
  if (loading) {
    return (
      <div className="my-6 px-4 animate-pulse">
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

  return (
    <div className="relative my-6 px-4">
      <h2 className="px-4 text-2xl font-bold mb-4 uppercase ml-4 sm:ml-9">
        Up to 40% off | Buy 2 Get Extra 40% off
      </h2>

      {/* Desktop & Tablet slider with arrows */}
      {!isMobile && (
        <div className="flex items-center">
          <button
            onClick={scrollLeft}
            className="p-2 mr-2 rounded-full border bg-white z-10 text-black hover:bg-gray-200 cursor-pointer transition-colors"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          <div
            ref={scrollContainerRef}
            className="overflow-x-auto flex gap-1 px-2 super-thin-scrollbar scrollbar-thumb-rounded scrollbar-thumb-zinc-200 
            scrollbar-track-transparent"
            style={{ scrollBehavior: 'smooth' }}
          >
            {products.map((p) => (
              <div
                key={p.productid}
                className="p-2 min-w-[250px] max-w-[400px] shrink-0 mb-16"
              >
                <Link to={`/product/${p.productid}`}>
                  <img
                    src={p.productimage}
                    alt={p.productname}
                    className="w-full h-[379px]  object-fill rounded mb-2"
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

          <button
            onClick={scrollRight}
            className="p-2 ml-2 rounded-full border bg-white z-10 text-black hover:bg-gray-200 cursor-pointer transition-colors"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      )}

      {/* Mobile Horizontal Scroll */}
      {isMobile && (
        <div className="overflow-x-auto mt-2 px-2 super-thin-scrollbar">
          <div className="flex gap-4">
            {products.map((p) => (
              <div key={p.productid} className="min-w-[90%] max-w-[90%] shrink-0 mb-12">
                <Link to={`/product/${p.productid}`}>
                  <img
                    src={p.productimage}
                    alt={p.productname}
                    className="w-full h-[300px] object-cover rounded mb-2"
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
