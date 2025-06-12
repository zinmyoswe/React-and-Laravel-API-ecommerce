import React, { useEffect, useState } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import { getProductById } from '../services/productService';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0,0);
    setLoading(true);
    getProductById(id)
      .then((res) => {
        setProduct(res.data);
        setMainImage(res.data.productimage);
        setTimeout(() => setLoading(false), 100); // Show placeholder for 0.3s
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (loading || !product) {
    return (
      <div className="p-6 grid grid-cols-12 gap-6 animate-pulse">
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
    );
  }

  return (
    <div className="p-6 grid grid-cols-12 gap-6">
      {/* Left Blank */}
      <div className="hidden md:block md:col-span-1" />

      {/* Left 5 cols: Image Gallery */}
      <div className="col-span-12 md:col-span-5 flex flex-col md:flex-row gap-4">
        {/* Thumbnails */}
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto order-2 md:order-none">
          {[product.productimage, ...(product.productimages || [])].map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Thumb ${i}`}
              onMouseEnter={() => setMainImage(img)}
              className="w-16 h-16 object-cover rounded-md border cursor-pointer hover:ring-1 ring-zinc-900"
            />
          ))}
        </div>

        {/* Main Image */}
        <div className="flex-1 order-1 md:order-none">
          <img
            src={mainImage}
            alt="Main"
            className="w-full h-full max-h-[500px] md:max-h-none  object-contain rounded-xl shadow"
          />
        </div>
      </div>

      {/* Right 5 cols: Product Info */}
      <div className="col-span-12 md:col-span-5 space-y-4">
        <h1 className="text-3xl font-bold">{product.productname}</h1>
        
       
        <div className="flex gap-2 items-center">
          <span className="text-2xl font-semibold text-gray-900">${product.price}</span>
          {product.discount && (
            <span className="text-red-500 line-through">
              ${(parseFloat(product.price) + parseFloat(product.discount)).toFixed(2)}
            </span>
          )}
        </div>

        <div className="text-sm space-y-1 text-gray-600">
          <p><strong>Product ID:</strong> {product.productid}</p>
          <p><strong>Category:</strong> {product.category?.categoryname}</p>
          <p><strong>Subcategory:</strong> {product.subcategory?.subcategoryname}</p>
          <p><strong>Color:</strong> {product.color}</p>
          <p><strong>Gender:</strong> {product.gender}</p>
          <p><strong>Stock:</strong> {product.stock}</p>
        </div>


                {/* {product.similar_products?.length > 0 && (
          <div>
            <h2 className="font-semibold mb-2">Similar Products:</h2>
            <div className="flex gap-2 flex-wrap">
              {product.similar_products.map((simProduct) => (
                <img
                  key={simProduct.productid}
                  src={simProduct.productimage}
                  alt={simProduct.productname}
                  onClick={() => navigate(`/product/${simProduct.productid}`)}
                  className="w-16 h-16  rounded-md border cursor-pointer hover:ring-2 ring-blue-500"
                  title={simProduct.productname}
                />
              ))}
            </div>
          </div>
        )} */}

        {/* Related Product Images Section */}
<div className="mt-6">
  <h2 className="font-semibold mb-2">Related Products</h2>
  <div className="flex gap-4">
    {/* Current Product Image (parent) */}
    <div className="flex flex-col items-center">
      <img
        src={product.productimage}
        alt={product.productname}
        onClick={() => navigate(`/product/${product.productid}`)}
        className="w-20 h-20 object-cover rounded-md border cursor-pointer hover:ring-2 ring-zinc-900"
        title={`Main product: ${product.productname}`}
      />
      <span className="text-xs text-center mt-1">Product #{product.productid}</span>
    </div>

    {/* Similar Products */}
    {product.similar_products.map((simProduct) => (
      <div
        key={simProduct.productid}
        className="flex flex-col items-center"
      >
        <img
          src={simProduct.productimage}
          alt={simProduct.productname}
          onClick={() => navigate(`/product/${simProduct.productid}`)}
          className="w-20 h-20 object-cover rounded-md border cursor-pointer hover:ring-2 ring-blue-500"
          title={`Similar product: ${simProduct.productname}`}
        />
        <span className="text-xs text-center mt-1">Product #{simProduct.productid}</span>
      </div>
    ))}
  </div>
</div>

        <div>
          <h2 className="font-semibold mb-1">Available Sizes:</h2>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <span
                key={size.id}
                className="border px-3 py-1 rounded-full text-sm bg-gray-100"
              >
                {size.sizevalue}
              </span>
            ))}
          </div>
        </div>

         <p className="text-gray-700 text-sm whitespace-pre-line break-words">
          {product.description}
        </p>
      </div>

      {/* Right Blank */}
      <div className="hidden md:block md:col-span-1" />
    </div>
  );
}

export default ProductDetailPage;
