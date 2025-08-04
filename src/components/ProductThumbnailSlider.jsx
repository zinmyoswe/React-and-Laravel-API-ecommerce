import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import API_BASE_URL from '../config';

const ProductThumbnailSlider = () => {
  const [products, setProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [isMediumScreen, setIsMediumScreen] = useState(window.innerWidth < 1000);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsMediumScreen(window.innerWidth < 1000);
    };
    window.addEventListener('resize', handleResize);

    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/products`, {
          params: { gender: 'Unisex', sort: 'newest', limit: 12 },
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

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="my-6 px-4 animate-pulse">
        <div className="flex gap-4 overflow-hidden">
          {[...Array(isMobile ? 1 : 3)].map((_, i) => (
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
      {!isMobile && (
        <div className="flex justify-between items-center mb-4 px-4">
          <h2 className="nds-text  card css-14baf2u e1yhcai00 appearance-title3 color-primary weight-regular">
            New Arrivals
          </h2>
          <div className="flex gap-2">
            <button
              onClick={scrollLeft}
              className="px-6 py-4 rounded-full border bg-white text-black hover:bg-gray-200 transition-colors"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button
              onClick={scrollRight}
              className="px-6 py-4 rounded-full border bg-white text-black hover:bg-gray-200 transition-colors"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>
      )}

      {/* Desktop & Tablet */}
      {!isMobile && (
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto flex gap-1 px-2 super-thin-scrollbar scrollbar-thumb-rounded scrollbar-thumb-zinc-200 scrollbar-track-transparent"
          style={{ scrollBehavior: 'smooth' }}
        >
          {products.map((p) => (
            <div
              key={p.productid}
              className={`p-2 ${
                isMediumScreen
                  ? 'min-w-[50%] max-w-[50%]'
                  : 'min-w-[calc(100%/3)] max-w-[calc(100%/3)]'
              } shrink-0`}
            >
              <Link to={`/product/${p.productid}`}>
                <img
                  src={p.productimage}
                  alt={p.productname}
                  className="w-full h-[469px] rounded mb-4"
                />
              </Link>
              <Link
                to={`/product/${p.productid}`}
                className="nds-text title css-196t8ag e1yhcai00 appearance-body1Strong color-primary weight-medium"
              >
                {p.productname}
              </Link>
              <div className="nds-text category css-ej30wz e1yhcai00 appearance-body1 color-secondary weight-regular mb-4">${p.price}</div>
            </div>
          ))}
        </div>
      )}

      {/* Mobile */}
      {isMobile && (
        <div className="overflow-x-auto mt-2 px-2 super-thin-scrollbar">
          <div className="flex gap-4">
            {products.map((p) => (
              <div key={p.productid} className="min-w-[90%] max-w-[90%] shrink-0 mb-12">
                <Link to={`/product/${p.productid}`}>
                  <img
                    src={p.productimage}
                    alt={p.productname}
                    className="w-full h-[300px]  rounded mb-2"
                  />
                </Link>
                <Link
                  to={`/product/${p.productid}`}
                  className="nds-text title css-196t8ag e1yhcai00 appearance-body1Strong color-primary weight-medium"
                >
                  {p.productname}
                </Link>
                <div className="nds-text category css-ej30wz e1yhcai00 appearance-body1 color-secondary weight-regular mb-4">${p.price}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductThumbnailSlider;
