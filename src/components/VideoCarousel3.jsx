import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const VideoCarousel3 = () => {
  return (
    <div className="relative w-full md:min-h-screen overflow-hidden">
      {/* Desktop/Tablet Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="hidden sm:block w-full h-screen object-cover"
        src="/video/Nikeslide2.mp4"
      />

      {/* Mobile Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="block sm:hidden w-full object-cover"
        style={{ height: '355px' }}
        src="/video/Nikeslide2.mp4"
      />

      {/* Desktop & Tablet Text */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-black max-w-xl hidden sm:block text-center">

        <h3 className='nds-text _1MF91zHG css-p61h82 e1yhcai00 appearance-display2 color-var(--podium-cds-color-text-primary-inverse) weight-medium uppercase'>
          The beginning of new possibilities
        </h3>
        <p class="nds-text mt2-sm css-of85v2 e1yhcai00 appearance-body1 color-var(--podium-cds-color-text-primary-inverse) weight-regular" data-qa="body">
          Unleash your potential and push your limits with the Metcon 10.
        </p>
        <div className=" flex justify-center gap-3">
          <Link
            to="/products"
            className="bg-white text-black mt-6 px-5 py-2 var(--podium-cds-typography-body1-strong) flex items-center gap-2 rounded-full hover:bg-zinc-200 transition"
          >
            Shop  
          </Link>
        
        </div>
      </div>

      {/* Mobile Text */}
      <div className="absolute mt-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 sm:hidden text-black text-left w-[90%] max-w-xs">
       
       <h3 className='nds-text _1MF91zHG css-p61h82 e1yhcai00 appearance-display2 color-var(--podium-cds-color-text-primary-inverse) weight-medium uppercase'>
          The beginning of new possibilities
        </h3>
        <p class="nds-text mt2-sm css-of85v2 e1yhcai00 appearance-body1 color-var(--podium-cds-color-text-primary-inverse) weight-regular" data-qa="body">
          Unleash your potential and push your limits with the Metcon 10.
        </p>
        <div className="flex gap-3">
          <Link
            to="/products"
            className="bg-white text-black mt-6 px-4 py-2 var(--podium-cds-typography-body1-strong) flex items-center gap-2 rounded-full hover:bg-zinc-200 transition"
          >
            Shop  
          </Link>
        
        </div>
      </div>
    </div>
  );
};

export default VideoCarousel3;
