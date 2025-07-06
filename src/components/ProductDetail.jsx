import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { addToCart } from '../services/cartService';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [sizeError, setSizeError] = useState('');

  const fetchProduct = (productId) => {
    getProductById(productId)
      .then((res) => {
        setProduct(res.data);
        setMainImage(res.data.productimage);
        window.history.replaceState(null, '', `/product/${productId}`);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchProduct(id);
  }, [id]);



const handleAddToCart = async () => {
  if (!selectedSize) {
    setSizeError('Please select your size');
    return;
  }

  try {
    await addToCart(product.productid, selectedSize);
    navigate('/cart'); // Redirect to CartPage
  } catch (error) {
    console.error('Failed to add to cart:', error);
  }
};

  if (!product) {
    return <div className="p-6 grid grid-cols-12 gap-6 animate-pulse">
        <div className="col-span-12 md:col-span-5 md:col-start-2 space-y-4">
          <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
        <div className="col-span-12 md:col-span-5 space-y-4">
          <div className="h-8 bg-gray-200 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
  }

  return (
    <div className="p-6 grid grid-cols-12 gap-6">
      {/* Left Blank */}
      <div className="hidden md:block md:col-span-2" />

      {/* Left 5 cols: Image Gallery */}
      <div className="col-span-12 md:col-span-5 flex flex-col md:flex-row gap-4 items-start">
        {/* Thumbnails */}
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto order-2 md:order-none">
          {[product.productimage, ...(product.productimages || [])].map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Thumb ${i}`}
              onMouseEnter={() => setMainImage(img)}
              className="w-16 h-16  rounded-md border cursor-pointer hover:ring-1 ring-zinc-900"
            />
          ))}
        </div>

        {/* Main Image */}
        <div className="flex-1 order-1 md:order-none">
          <img
            src={mainImage}
            alt="Main"
            className="w-full h-full max-h-[500px] md:max-h-none object-contain"
          />
        </div>
      </div>

      {/* Right 5 cols: Product Info */}
      <div className="col-span-12 md:col-span-3 space-y-4">
        <h1 className="text-3xl font-bold">{product.productname}</h1>

       

        <div className="flex gap-2 items-center">
          <span className="text-2xl font-semibold text-gray-900">${product.price}</span>
          {product.discount > 0 && (
            <span className="text-gray-500 line-through">
              ${(parseFloat(product.price) + parseFloat(product.discount)).toFixed(2)}
            </span>
          )}
        </div>

        <div className="text-sm space-y-1 text-gray-600">
          {/* <p><strong>Product ID:</strong> {product.productid}</p>
          <p><strong>Category:</strong> {product.category?.categoryname}</p>
          <p><strong>Subcategory:</strong> {product.subcategory?.subcategoryname}</p> */}
          <p><strong>Color:</strong> {product.color}</p>
          {/* <p><strong>Gender:</strong> {product.gender}</p>
          <p><strong>Stock:</strong> {product.stock}</p> */}
        </div>

        

        {/* Parent + Similar Products Thumbnails */}
        <div className="!mt-6">
          <h2 className="font-semibold mb-2">Related Products:</h2>
          <div className="flex flex-wrap gap-1">
            {/* Main product itself */}
            <img
              src={product.productimage}
              alt="Current Product"
              onClick={() => fetchProduct(product.productid)}
              className="w-20 h-20  rounded-md border cursor-pointer hover:ring-1 ring-black"
            />

            {/* Similar products */}
            {product.similar_products?.map((similar) => (
              <img
                key={similar.productid}
                src={similar.productimage}
                alt={`Similar ${similar.productid}`}
                onClick={() => fetchProduct(similar.productid)}
                className="w-20 h-20  rounded-md border cursor-pointer hover:ring-1 ring-black"
              />
            ))}
          </div>
        </div>

        <div className='!my-6'>
          <h2 className="font-semibold mb-1">Available Sizes:</h2>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size.id}
                onClick={() => {
                  setSelectedSize(size.sizevalue);
                  setSizeError(''); // Clear error when a size is selected
                }}
                className={`h-11 min-w-16 px-4 py-2 rounded-md text-sm border transition
                ${selectedSize === size.sizevalue
                  ? 'bg-black text-white border-zinc-900'
                  : 'bg-white text-zinc-900 border border-gray-400 hover:border-zinc-900'}
              `}
              >
                {size.sizevalue}
              </button>
            ))}
          </div>
          {sizeError && (
            <p className="text-red-600 text-sm mt-3">{sizeError}</p>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className="bg-zinc-900 text-white px-6 py-4 rounded-full w-full hover:bg-gray-800"
        >
          Add to Bag
        </button>

        <p className="text-gray-700 text-sm whitespace-pre-line break-words">
          {product.description}
        </p>

      </div>

      {/* Right Blank */}
      <div className="hidden md:block md:col-span-2" />

    </div>
  );
}

export default ProductDetailPage;
