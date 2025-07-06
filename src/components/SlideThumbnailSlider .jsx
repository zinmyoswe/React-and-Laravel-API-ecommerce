import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import API_BASE_URL from '../config';

const SlideThumbnailSlider = () => {
  const [slides, setSlides] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);

    const fetchSlides = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/posterslides`, {
          params: { part: 1 }
        });
        setSlides(res.data);
        setTimeout(() => setLoading(false), 100);
      } catch (error) {
        console.error('Failed to load slides', error);
        setLoading(false);
      }
    };

    fetchSlides();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const checkScroll = () => {
    const container = scrollRef.current;
    if (!container) return;
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(container.scrollLeft + container.clientWidth < container.scrollWidth - 1);
  };

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.addEventListener('scroll', checkScroll);
    checkScroll();
    return () => container.removeEventListener('scroll', checkScroll);
  }, [slides]);

  const handleNavigateProducts = () => navigate('/products');

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
        WHAT'S HOT
      </h2>

      {!isMobile && (
        <div className="flex items-center">
          <button
            onClick={scrollLeft}
            className="p-2 mr-2 rounded-full border bg-white z-10 text-black hover:bg-gray-200 cursor-pointer transition-colors"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          <div
            ref={scrollRef}
            className="overflow-x-auto flex gap-1 px-2 super-thin-scrollbar scrollbar-thumb-rounded scrollbar-thumb-zinc-200"
            style={{ scrollBehavior: 'smooth' }}
          >
            {slides.map(slide => (
              <div
                key={slide.posterslideid}
                className="p-2 min-w-[250px] max-w-[300px] shrink-0 mb-16"
              >
                <img
                  src={slide.posterslideimage}
                  alt={slide.posterslidename}
                  className="w-full h-[420px] object-fill rounded mb-2 cursor-pointer"
                  onClick={handleNavigateProducts}
                />
                <div className="mt-6 h-32">
                  <h5
                    onClick={handleNavigateProducts}
                    className="font-semibold text-md hover:underline cursor-pointer"
                  >
                    {slide.posterslidename}
                  </h5>
                  <p className="text-gray-600 mb-2 mt-4">{slide.posterslidename2}</p>
                </div>
                <button
                  onClick={handleNavigateProducts}
                  className="text-dark underline hover:bg-zinc-100"
                >
                  {slide.buttonname}
                </button>
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

      {isMobile && (
        <div className="overflow-x-auto mt-2 px-2 super-thin-scrollbar">
          <div className="flex gap-4">
            {slides.map(slide => (
              <div
                key={slide.posterslideid}
                className="min-w-[90%] max-w-[90%] shrink-0 mb-12"
              >
                <img
                  src={slide.posterslideimage}
                  alt={slide.posterslidename}
                  className="w-full h-[390px] object-fill rounded mb-2"
                  onClick={handleNavigateProducts}
                />
                <div className="mt-6 h-32">
                  <h5
                    onClick={handleNavigateProducts}
                    className="font-semibold text-md hover:underline cursor-pointer"
                  >
                    {slide.posterslidename}
                  </h5>
                  <p className="text-gray-600 mb-2 mt-4">{slide.posterslidename2}</p>
                </div>
                <button
                  onClick={handleNavigateProducts}
                  className="text-dark underline hover:bg-zinc-100"
                >
                  {slide.buttonname}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SlideThumbnailSlider;
