import React, { useEffect, useState } from 'react';
import { getAllProducts } from '../services/productService';
import { Link } from 'react-router-dom';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProducts()
      .then((res) => {
        setProducts(res.data);
        setTimeout(() => setLoading(false), 100); // simulate 0.5s placeholder
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {loading
        ? Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-100 rounded-xl p-4 shadow"
            >
              <div className="h-[350px] bg-gray-300 rounded-md mb-4" />
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-300 rounded w-1/2" />
            </div>
          ))
        : products.map((product) => (
            <div
              key={product.productid}
              className="bg-white rounded-xl shadow hover:shadow-lg transition duration-300 p-4"
            >
              <Link to={`/product/${product.productid}`}>
                <img
                  src={product.productimage}
                  alt={product.productname}
                  className="w-full h-[375px] rounded-md mb-4"
                />
              </Link>
              <Link to={`/product/${product.productid}`}>
                <h2 className="text-lg font-semibold hover:text-gray-900 transition">
                  {product.productname}
                </h2>
              </Link>
              <p className="text-gray-600 mt-1">$ {product.price}</p>
            </div>
          ))}
    </div>
  );
}

export default ProductsPage;
