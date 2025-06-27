import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import API_BASE_URL from '../config';

const SlideThumbnailSlider = () => {
  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);

    const fetchSlides = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/posterslides?part=1`);
        // Assuming backend supports filter by part, else filter here:
        // const filtered = res.data.filter(slide => slide.part === 1);
        setSlides(res.data);
      } catch (error) {
        console.error('Failed to load slides', error);
      }
    };

    fetchSlides();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // How many items to show at once
  const itemsPerPage = isMobile ? 1 : 4;
  const maxIndex = Math.max(0, slides.length - itemsPerPage);

  const next = () => {
    if (index < maxIndex) setIndex(prev => prev + 1);
  };

  const prev = () => {
    if (index > 0) setIndex(prev => prev - 1);
  };

  // Slider width and transform for animation
  const sliderWidthPercent = (slides.length / itemsPerPage) * 47;
  const translatePercent = (index * 100) / slides.length * itemsPerPage;

  // Navigate to /products when clicking image or name
  const handleNavigateProducts = () => {
    navigate('/products');
  };

  return (
    <div className="relative my-6 px-4">
      <h2 className="text-2xl font-bold mb-4 uppercase ml-4 sm:ml-9">WHAT'S HOT</h2>

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
                width: `${sliderWidthPercent}%`,
                transform: `translateX(-${(index * 190) / slides.length}%)`,
              }}
            >
              {slides.map(slide => (
                <div
                  key={slide.posterslideid}
                  className="p-2 cursor-pointer"
                  style={{ width: `${100 / slides.length}%`, minWidth: `${100 / itemsPerPage}%` }}
                >
                  <img
                    src={slide.posterslideimage}
                    alt={slide.posterslidename}
                    className="w-full h-[420px] object-fill rounded mb-2"
                    onClick={handleNavigateProducts}
                  />
                  <div className='mt-6 h-32'>
                  <h5
                    onClick={handleNavigateProducts}
                    className="font-semibold text-md hover:underline cursor-pointer"
                  >
                    {slide.posterslidename}
                  </h5>
                  <p className="text-gray-600 mb-2 mt-4">{slide.posterslidename2}</p>
                  </div>
                  <button onClick={handleNavigateProducts} className=" text-dark underline hover:bg-zinc-100">
                    {slide.buttonname}
                  </button>
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
            {slides.map(slide => (
              <div
                key={slide.posterslideid}
                className="min-w-[90%] max-w-[90%] shrink-0 cursor-pointer"
                onClick={handleNavigateProducts}
              >
                <img
                  src={slide.posterslideimage}
                  alt={slide.posterslidename}
                  className="w-full h-[390px] object-fill rounded mb-2"
                />
                <div className='mt-6 h-32'>
                  <h5
                    onClick={handleNavigateProducts}
                    className="font-semibold text-md hover:underline cursor-pointer"
                  >
                    {slide.posterslidename}
                  </h5>
                  <p className="text-gray-600 mb-2 mt-4">{slide.posterslidename2}</p>
                  </div>
                <button className=" text-dark underline hover:bg-zinc-100">
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
