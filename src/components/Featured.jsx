import React from 'react';
import { Link } from 'react-router-dom';

const featuredItems = [
  {
    image: 'https://static.nike.com/a/images/f_auto/dpr_1.3,cs_srgb/h_1047,c_limit/a5c3e236-5973-4d77-b92f-591074d7c75c/nike-just-do-it.png',
    title1: 'Air Max Muse',
    title2: 'Reimagined Air',
    route: '/products?gender=Women',
  },
  {
    image: 'https://static.nike.com/a/images/f_auto/dpr_1.3,cs_srgb/h_1047,c_limit/aa78398a-53eb-4eae-af87-f7ede0c9345d/nike-just-do-it.png',
    title1: 'Metcon 10',
    title2: 'Strength Starts Here',
    route: '/products?gender=Men',
  },
  {
    image: 'https://static.nike.com/a/images/f_auto/dpr_1.3,cs_srgb/h_1039,c_limit/8720ea26-5d92-44d0-8586-3eceb60be7d6/nike-just-do-it.png',
    title1: '',
    title2: 'Kids Running Essentials',
    route: '/products?gender=Kids',
  },
  {
    image: 'https://static.nike.com/a/images/f_auto/dpr_1.3,cs_srgb/h_1039,c_limit/53d37b08-9b5b-4350-8b6f-6375d3eb8134/nike-just-do-it.png',
    title1: 'Jordan Trunner LX',
    title2: 'No Misses',
    route: '/products?subcategory_id=13&subcategory_id=14',
  },
];

const Featured = () => {
  return (
    <div>
        <div class="_17O3hgwI">
            <h2 class="nds-text _2PzKMD0A card css-14baf2u e1yhcai00 appearance-title3 color-primary weight-regular" data-qa="title">
            Featured</h2>
        </div>
    <div className="w-full">

        

      <div className="flex flex-wrap">
        {featuredItems.map((item, index) => (
          <div
            key={index}
            className="w-full md:w-1/2 relative h-[400px] md:h-[500px]"
          >
            <Link to={item.route} className="block w-full h-full relative group">
              <img
                src={item.image}
                alt={`Featured ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 "
              />
              <div className="absolute bottom-6 left-6 text-white max-w-xs z-10">
                <p className='nds-text vVtA7wL6 css-1kh06ln e1yhcai00 appearance-body1Strong color-primaryInverse weight-regular'>
                     {item.title1}
                </p>
                 
                 <h3 className='nds-text _1MF91zHG css-117kv6g e1yhcai00 appearance-title4 color-primaryInverse weight-medium'>
                       {item.title2}
                 </h3>
              
               
                
                <span
                  className="inline-block bg-white text-black mt-6 px-5 py-2 var(--podium-cds-typography-body1-strong) items-center gap-2 rounded-full hover:bg-zinc-200 transition"
                  onClick={(e) => e.stopPropagation()}
                >
                  Shop
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>

    </div>
  );
};

export default Featured;
