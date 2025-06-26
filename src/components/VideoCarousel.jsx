import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const VideoCarousel = () => {
  return (
    <div className="relative w-full md:min-h-screen overflow-hidden">
      {/* Desktop/Tablet Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="hidden sm:block w-full h-screen object-cover"
        src="https://brand.assets.adidas.com/video/upload/f_auto:video,q_auto/if_w_gt_1920,w_1920/global_adizero_running_ss25_sustain_evo_sl_hp_banner_hero_1_d_b197aec60d.mp4"
      />

      {/* Mobile Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="block sm:hidden w-full object-cover"
        style={{ height: '385px' }}
        src="https://brand.assets.adidas.com/video/upload/f_auto:video,q_auto/if_w_gt_768,w_768/global_adizero_running_ss25_sustain_evo_sl_hp_banner_hero_1_m_40d3c658a7.mp4"
      />

      {/* Desktop & Tablet Text */}
      <div className="absolute left-12 bottom-12 text-black max-w-xl hidden sm:block">
        <h2 className="text-3xl font-bold mb-2 bg-white p-2 uppercase">
          ADIZERO EVO SL. FEEL FAST.
        </h2>
        <p className="text-lg mb-4 bg-white p-2">
          For you to run in. Or not.
        </p>
        <div className="flex gap-3">
          <Link
            to="/men"
            className="bg-white text-black px-4 py-2 text-sm font-semibold flex items-center gap-2 hover:bg-zinc-200 transition"
          >
            SHOP MEN <FontAwesomeIcon icon={faArrowRight} />
          </Link>
          <Link
            to="/women"
            className="bg-white text-black px-4 py-2 text-sm font-semibold flex items-center gap-2 hover:bg-zinc-200 transition"
          >
            SHOP WOMEN <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
      </div>

      {/* Mobile Text */}
      <div className="absolute mt-28 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 sm:hidden text-black text-center w-[90%] max-w-xs">
        <h2 className="text-lg font-bold mb-2 bg-white p-1 uppercase">
          ADIZERO EVO SL. FEEL FAST.
        </h2>
        <p className="text-sm mb-3 bg-white p-1">
          For you to run in. Or not.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Link
            to="/men"
            className="bg-white text-black px-3 py-1 text-xs font-semibold flex items-center gap-1 hover:bg-zinc-200 transition"
          >
            SHOP MEN <FontAwesomeIcon icon={faArrowRight} size="sm" />
          </Link>
          <Link
            to="/women"
            className="bg-white text-black px-3 py-1 text-xs font-semibold flex items-center gap-1 hover:bg-zinc-200 transition"
          >
            SHOP WOMEN <FontAwesomeIcon icon={faArrowRight} size="sm" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VideoCarousel;
