import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import API_BASE_URL from '../config';

const ShopBySportSlider = () => {
  const [sports, setSports] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [isMediumScreen, setIsMediumScreen] = useState(window.innerWidth < 1000);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsMediumScreen(window.innerWidth < 1000);
    };
    window.addEventListener('resize', handleResize);

    const fetchSports = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/shopbysport`);
        const activeSports = res.data.filter((sport) => sport.slide_active === 0);
        setSports(activeSports);
        setTimeout(() => setLoading(false), 100);
      } catch (error) {
        console.error('Failed to load sports', error);
        setLoading(false);
      }
    };

    fetchSports();
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
          <h2 className="nds-text card css-14baf2u e1yhcai00 appearance-title3 color-primary weight-regular">
            Shop by Sport
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
          className="overflow-x-auto flex gap-2 px-2 super-thin-scrollbar scrollbar-thumb-rounded scrollbar-thumb-zinc-200 scrollbar-track-transparent"
          style={{ scrollBehavior: 'smooth' }}
        >
          {sports.map((sport) => (
            <div
              key={sport.id}
              className={`p-2 cursor-pointer relative ${
                isMediumScreen
                  ? 'min-w-[50%] max-w-[50%]'
                  : 'min-w-[calc(100%/3)] max-w-[calc(100%/3)]'
              } shrink-0`}
              onClick={() => navigate(`/products?shopbysportId=${sport.id}`)} // Updated here
            >
              <img
                src={sport.image}
                alt={sport.sportname}
                className="w-full h-[300px] object-cover rounded"
              />
              <div className="absolute bottom-14 left-10 bg-white text-black px-3 py-1 rounded-full">
                {sport.sportname}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mobile */}
      {isMobile && (
        <div className="overflow-x-auto mt-2 px-2 super-thin-scrollbar">
          <div className="flex gap-4">
            {sports.map((sport) => (
              <div
                key={sport.id}
                className="min-w-[90%] max-w-[90%] shrink-0 relative cursor-pointer"
                onClick={() => navigate(`/products?shopbysportId=${sport.id}`)} // Updated here
              >
                <img
                  src={sport.image}
                  alt={sport.sportname}
                  className="w-full h-[240px] object-cover rounded"
                />
                <div className="absolute bottom-14 left-10 bg-white text-black px-3 py-1 rounded-full">
                  {sport.sportname}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopBySportSlider;
