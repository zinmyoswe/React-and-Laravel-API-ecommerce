import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ProductCardWithHover.css';

function ProductCardWithHover({ product, showFilter }) {
  const navigate = useNavigate();

  const thumbnails = [
    { productid: product.productid, productimage: product.productimage, productname: product.productname },
    ...(product.similar_products || []),
  ];

  const [mainImage, setMainImage] = useState(product.productimage);
  const [mainProductId, setMainProductId] = useState(product.productid);
  const [showThumbnails, setShowThumbnails] = useState(false);

  const handleThumbnailHover = (thumb) => {
    setMainImage(thumb.productimage);
    setMainProductId(thumb.productid);
  };

  const handleThumbnailClick = (thumb) => {
    navigate(`/product/${thumb.productid}`);
  };

  const handleMainImageClick = () => {
    navigate(`/product/${mainProductId}`);
  };

  // Hide slug when thumbnails are visible and similar_products exist
  const hideSlug = showThumbnails && product.similar_products && product.similar_products.length > 0;

  return (
    <div
      className="bg-white"
      onMouseEnter={() => setShowThumbnails(true)}
      onMouseLeave={() => setShowThumbnails(false)}
    >
      {/* Main Image */}
      <div className="cursor-pointer">
        <img
          src={mainImage}
          alt="Main product"
          className={`w-full ${showFilter ? 'md:h-[395px] lg:h-[395px]' : 'md:h-[495px] lg:h-[495px]'} object-fill rounded mb-4 transition-opacity duration-500 ease-in-out`}
          onClick={handleMainImageClick}
        />
      </div>

      <div className='h-[120px] md:h-[150px] lg:h-[150px]'>

        {/* Thumbnails row */}
        {showThumbnails && product.similar_products && product.similar_products.length > 0 && (
          <div className="flex mb-4 overflow-x-auto px-1 gap-1">
            {thumbnails.map((thumb) => (
              <img
                key={thumb.productid}
                src={thumb.productimage}
                alt={thumb.productname}
                className={`w-11 h-11 object-fill cursor-pointer border transition-colors duration-300
                  ${mainImage === thumb.productimage ? 'border-none' : 'border-none'}
                  hover:border-none
                `}
                onMouseEnter={() => handleThumbnailHover(thumb)}
                onClick={() => handleThumbnailClick(thumb)}
              />
            ))}
          </div>
        )}

        {/* Product Name & Price */}
        <Link to={`/product/${mainProductId}`}>
          <div>
            <h3 className="product-card__title">{product.productname}</h3>

            {/* Product slug: hide smoothly without blank space */}
            <h3
              className={`product-card__subtitle mt-[6px] overflow-hidden ${
                hideSlug ? 'max-h-0 opacity-0' : 'max-h-10 opacity-100'
              }`}
              style={{ lineHeight: '1.2rem' }} // Adjust max-height based on your font size
            >
              {product.productslug}
            </h3>

            {product.similar_products && product.similar_products.length > 0 ? (
              !showThumbnails && (
                <p className="mt-1 product-card__subtitle">
                  {product.similar_products.length + 1} Colours
                </p>
              )
            ) : (
              <p className="mt-1 product-card__subtitle">1 Colour</p>
            )}

            <p className="css-vxq8l0 mt-4">${product.price}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default ProductCardWithHover;
