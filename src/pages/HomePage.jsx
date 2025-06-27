// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import ProductThumbnailSlider from '../components/ProductThumbnailSlider';
import Carousle2 from '../components/Carousle2';
import SlideThumbnailSlider from '../components/SlideThumbnailSlider ';
import VideoCarousel from '../components/VideoCarousel';
import ProductThumbnailSlider2 from './../components/ProductThumbnailSlider2';

const HomePage = () => {
  return (
    <div>
    <div className="relative w-full md:min-h-screen">
      {/* Desktop Background Image */}
      <img
        src="https://brand.assets.adidas.com/image/upload/f_auto,q_auto:best,fl_lossy/if_w_gt_1920,w_1920/5835978_Masthead_DT_2880x1280_e98a6a4d8d.jpg"
        alt="Sale Banner"
        className="hidden sm:block w-full h-screen object-cover"
      />

      {/* Mobile Background Image */}
      <img
        src="https://brand.assets.adidas.com/image/upload/f_auto,q_auto:best,fl_lossy/if_w_gt_768,w_768/5835978_Gender_Landing_Page_MO_750x964_ba709b6a5f.jpg"
        alt="Sale Banner Mobile"
        className="block sm:hidden w-full object-cover"
        style={{ height: '375px' }}
      />

      {/* Desktop Text & Buttons */}
      <div className="absolute left-12 bottom-12  text-black p-6 max-w-xl hidden sm:block">
        <h2 className="text-xl font-bold mb-2 bg-white p-1">
          END OF SEASON SALE: Up to 40%  off | Buy 2 Get EXTRA 40% off
        </h2>
        <p className="text-sm mb-4 bg-white p-1">
          On selected sale items from 25 Jun - 7 Jul 2025. Discount applied at check out. T&Cs apply.
        </p>
        <div className="flex flex-wrap gap-3">
          {['/products', '/products?gender=Men', '/products?gender=Women', '/products?gender=Kid'].map((path, idx) => {
            const labels = ['VIEW ALL', 'MEN', 'WOMEN', 'KIDS'];
            return (
              <Link
                key={path}
                to={path}
                className="bg-white text-black px-4 py-2 text-sm font-semibold flex items-center gap-2  hover:bg-zinc-200 transition"
              >
                {labels[idx]} <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile Text & Buttons */}
      <div className="absolute mt-36 top-4 left-1/2 transform -translate-x-1/2  text-black p-4 text-center sm:hidden w-[90%] max-w-xs">
        <h2 className="text-base font-bold mb-2 bg-white p-1">
          END OF SEASON SALE: Up to 40% off | Buy 2 Get EXTRA 40% off
        </h2>
        <p className="text-xs mb-3 bg-white p-1">
          25 Jun - 7 Jul 2025. Discount applied at checkout. T&Cs apply.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {['/products', '/products?gender=Men', '/products?gender=Women', '/products?gender=Kid'].map((path, idx) => {
            const labels = ['VIEW ALL', 'MEN', 'WOMEN', 'KIDS'];
            return (
              <Link
                key={path}
                to={path}
                className="bg-white text-black px-3 py-1 text-xs font-semibold flex items-center gap-1 hover:bg-zinc-200 transition"
              >
                {labels[idx]} <FontAwesomeIcon icon={faArrowRight} size="sm" />
              </Link>
            );
          })}
        </div>
      </div>
         </div>
      {/* ------------------------------- 1st carousel end --------------------------------- */}

      
 

    {/* Product Slider */}
      <div className="my-10 md:my-20"> {/* ensure it's below the hero image */}
        
        <ProductThumbnailSlider />
      </div>


         {/* ------------------------------- 2nd ProductThumbnail end --------------------------------- */}

           <div className="my-10">
            <Carousle2 />
        </div>

        {/* ------------------------------- 2nd ProductThumbnail end --------------------------------- */}
          {/* Product Slider2 */}
      <div className="my-10 md:my-20"> {/* ensure it's below the hero image */}
        
        <ProductThumbnailSlider2 />
      </div>
        
         {/* ------------------------------- 3nd Carousel end --------------------------------- */}

          <div className="my-10">
            <VideoCarousel />
        </div>

         {/* ------------------------------- 5th VideoCarousel end --------------------------------- */}

         <div className="my-10">
            <SlideThumbnailSlider />
        </div>
         {/* ------------------------------- 4th SlideThumbnailSlider end --------------------------------- */}

        
    </div>
  );
};

export default HomePage;
