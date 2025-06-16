import React, { useEffect, useState } from 'react';
import { getAllProducts, getFilteredProducts } from '../services/productService';
import { Link } from 'react-router-dom';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [sortOption]);

  const fetchProducts = () => {
    setLoading(true);

    const fetchData = sortOption
      ? getFilteredProducts(sortOption)
      : getAllProducts();

    fetchData
      .then((res) => {
        setProducts(res.data);
        setTimeout(() => setLoading(false), 100);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="p-4">
      {/* Filter Dropdown */}
      <div className="mb-4 flex justify-end items-center">
        <label htmlFor="sort" className="text-sm font-medium mr-2">
          Sort by:
        </label>
        <select
          id="sort"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="">Featured</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
                className="bg-white "
              >
                <Link to={`/product/${product.productid}`}>
                  <img
                    src={product.productimage}
                    alt={product.productname}
                    className="w-full h-[375px] rounded-md mb-4"
                  />
                </Link>
                <div className='h-[60px] md:h-[80px]'>
                <Link to={`/product/${product.productid}`}>
                  <h2 className="text-lg font-semibold hover:text-gray-900 transition">
                    {product.productname}
                  </h2>
                </Link>
                
                <p className="text-gray-600 mt-1">$ {product.price}</p>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}

export default ProductsPage;
