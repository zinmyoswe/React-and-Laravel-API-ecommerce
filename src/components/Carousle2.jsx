import React from 'react'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const Carousle2 = () => {
  return (
    <div>
      <div className="relative w-full md:min-h-screen">
            {/* Desktop Background Image */}
            <img
              src="https://brand.assets.adidas.com/image/upload/f_auto,q_auto:best,fl_lossy/if_w_gt_1920,w_1920/HP_TAEKWONDO_MEI_BH_a0463085ee.jpg"
              alt="Sale Banner"
              className="hidden sm:block w-full h-screen"
            />
      
            {/* Mobile Background Image */}
            <img
              src="https://brand.assets.adidas.com/image/upload/f_auto,q_auto:best,fl_lossy/if_w_gt_768,w_768/HP_TAEKWONDO_MH_M_5727fb962b.jpg"
              alt="Sale Banner Mobile"
              className="block sm:hidden w-full object-fill"
              style={{ height: '375px' }}
            />
      
            {/* Desktop Text & Buttons */}
            <div className="absolute left-12 bottom-12  text-black p-6 max-w-xl hidden sm:block">
              <h2 className="text-xl font-bold mb-2 bg-white p-1 uppercase">
                Low Profile in design.
              </h2>
              <p className="text-sm mb-4 bg-white p-1">
                From the edges of the sporting world to the frontlines of culture. Vintage in style. Progressive in essence.
              </p>
              <div className="flex flex-wrap gap-3">
                {['/products'].map((path, idx) => {
                  const labels = ['SHOP NOW'];
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
                Low Profile in design.
              </h2>
              <p className="text-xs mb-3 bg-white p-1">
                From the edges of the sporting world to the frontlines of culture. Vintage in style. Progressive in essence.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
               {['/products'].map((path, idx) => {
                  const labels = ['SHOP NOW'];
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
    </div>
  )
}

export default Carousle2
