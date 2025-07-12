import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function ProductCardWithHover({ product, showFilter }) {
  const navigate = useNavigate();

  // All thumbnails to show: first the main product, then similar products if any
  const thumbnails = [
    { productid: product.productid, productimage: product.productimage, productname: product.productname },
    ...(product.similar_products || []),
  ];

  const [mainImage, setMainImage] = useState(product.productimage);
  const [mainProductId, setMainProductId] = useState(product.productid);
  const [showThumbnails, setShowThumbnails] = useState(false);

  // When hovering main image - show thumbnails row below
  // When not hovering main image, hide thumbnails after some delay (optional)
  // Hovering thumbnails changes mainImage & mainProductId and pins it

  const handleThumbnailHover = (thumb) => {
    setMainImage(thumb.productimage);
    setMainProductId(thumb.productid);
  };

  const handleThumbnailClick = (thumb) => {
    // Navigate to product detail page with selected productid
    navigate(`/product/${thumb.productid}`);
  };

  const handleMainImageClick = () => {
    // Navigate to currently shown main product detail page
    navigate(`/product/${mainProductId}`);
  };

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
          className={`w-full ${showFilter ? 'md:h-[395px]' : 'md:h-[495px]'} h-[395px] object-fill rounded mb-4 transition-opacity duration-500 ease-in-out`}
          onClick={handleMainImageClick}
        />
      </div>

        <div className='h-[80px] md:h-[120px]'>
      {/* Thumbnails row: only visible on hover of main image */}
      {showThumbnails && product.similar_products && product.similar_products.length > 0 && (
        <div className="flex  mb-4 overflow-x-auto px-1 gap-1">
          {thumbnails.map((thumb) => (
            <img
              key={thumb.productid}
              src={thumb.productimage}
              alt={thumb.productname}
              className={`w-11 h-11 object-fill  cursor-pointer border transition-colors duration-300
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
        <div className="">
          <h3 className="text-lg font-semibold hover:text-gray-900"
            style={{
                    fontFamily: `'Helvetica Now Text Medium', Helvetica, Arial, sans-serif`,
					fontWeight: 500
                  }}
          >{product.productname}</h3>
          <p className="text-zinc-900 mt-1">${product.price}</p>
        {product.similar_products && product.similar_products.length > 0 ? (
            !showThumbnails && (
                <p className="mt-1 text-gray-500">
                {product.similar_products.length + 1} Colours
                </p>
            )
            ) : (
            <p className="mt-1 text-gray-500">1 Colour</p>
            )}
        </div>
      </Link>
      </div>
    </div>
  );
}

export default ProductCardWithHover;
