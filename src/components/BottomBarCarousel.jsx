import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import "./BottomBarCarousel.css";

const carouselItems = [
  {
    left: "Teachers & Students Get 10% Off",
    right: <Link to="/products" className="underline">Learn More</Link>,
  },
  {
    left: "Move, Shop, Customise & Celebrate With Us.",
    right: <Link to="/products" className="underline">Join Us</Link>,
  },
  {
    left: "Free Standard Delivery & 30-Day Free Returns",
    right: <Link to="/products" className="underline">View Details</Link>,
  },
  {
    left: "New Members Enjoy 15% Off on the Nike App: Use APP15",
    right: <Link to="/products" className="underline">Download Now</Link>,
  },
];

export default function BottomBarCarousel() {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const nextSlide = () => {
    setAnimating(true);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % carouselItems.length);
      setAnimating(false);
    }, 300);
  };

  const prevSlide = () => {
    setAnimating(true);
    setTimeout(() => {
      setIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
      setAnimating(false);
    }, 300);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 10000); // every 1 second
    return () => clearInterval(timer);
  }, []);

  const current = carouselItems[index];

  return (
    <div className="w-full h-16 md:h-16 bg-[#f5f5f5] text-zinc-800 font-semibold text-[14px] md:text-[16px] flex items-center px-4 md:px-10 "
        style={{
    font: "'Helvetica Now Text Medium', Helvetica, Arial, sans-serif",
  }}
    >
      {/* Desktop / Tablet */}
      <div className="hidden md:grid grid-cols-3 w-full items-center">
        {/* Left arrow */}
        <div className="flex justify-end pr-2">
          <button onClick={prevSlide}>
            <FontAwesomeIcon icon={faChevronLeft} className="text-sm hover:text-black" />
          </button>
        </div>

        {/* Center content */}
        <div className="overflow-hidden">
          <div className={`flex justify-center items-center gap-3 transition-all duration-300 ease-in-out ${animating ? "animate-slide" : ""}`}>
            <span>{current.left}</span>
            <span>{current.right}</span>
          </div>
        </div>

        {/* Right arrow */}
        <div className="flex justify-start pl-2">
          <button onClick={nextSlide}>
            <FontAwesomeIcon icon={faChevronRight} className="text-sm hover:text-black" />
          </button>
        </div>
      </div>

      {/* Mobile */}
      <div className="flex md:hidden justify-between items-center w-full">
        <button onClick={prevSlide}>
          <FontAwesomeIcon icon={faChevronLeft} className="text-sm hover:text-black" />
        </button>
        <div className="flex-1 mx-2 text-center overflow-hidden">
          <div className={`transition-all duration-300 ${animating ? "animate-slide" : ""}`}>
            <div className="flex flex-col items-center">
              <span>{current.left}</span>
              <span>{current.right}</span>
            </div>
          </div>
        </div>
        <button onClick={nextSlide}>
          <FontAwesomeIcon icon={faChevronRight} className="text-sm hover:text-black" />
        </button>
      </div>
    </div>
  );
}
