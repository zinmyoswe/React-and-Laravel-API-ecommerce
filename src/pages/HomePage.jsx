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
import Footer from '../components/Footer ';
import Featured from '../components/Featured';
import VideoCarousel3 from '../components/VideoCarousel3';

const HomePage = () => {
  return (
    <div>

       <div className="">
            <VideoCarousel />
        </div>

   
      {/* ------------------------------- 1st carousel end --------------------------------- */}
<div className="my-10 md:my-20"> {/* ensure it's below the hero image */}
        
        <Featured />
      </div>
      
 

    {/* Product Slider */}
      <div className="my-10 md:my-20"> {/* ensure it's below the hero image */}
        
        <ProductThumbnailSlider />
      </div>


         {/* ------------------------------- 2nd ProductThumbnail end --------------------------------- */}

           <div className="">
            {/* <Carousle2 /> */}
            <VideoCarousel3 />        
            </div>

        {/* ------------------------------- 2nd ProductThumbnail end --------------------------------- */}
          {/* Product Slider2 */}
      <div className="my-10 md:my-20"> {/* ensure it's below the hero image */}
        
        <ProductThumbnailSlider2 />
      </div>
        
         {/* ------------------------------- 3nd Carousel end --------------------------------- */}

         

         {/* ------------------------------- 5th VideoCarousel end --------------------------------- */}

         <div className="my-10">
            {/* <SlideThumbnailSlider /> */}
        </div>
         {/* ------------------------------- 4th SlideThumbnailSlider end --------------------------------- */}

          
          <div className="my-10">

            
          
          </div>
         

        
    </div>
  );
};

export default HomePage;
