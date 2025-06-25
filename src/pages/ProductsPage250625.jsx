import React, { useEffect, useState } from 'react';
import { getAllProducts, getFilteredProducts, getAllCategories } from '../services/productService';
import { Link } from 'react-router-dom';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('');
  const [showFilter, setShowFilter] = useState(true); // default: show filter
  const [categories, setCategories] = useState([]);

  const [filters, setFilters] = useState({
    category_id: '',
    gender: [],
    price: [],
    clothingSize: [],
    shoeSize: [],
    color: []
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters, sortOption]);

  const fetchCategories = () => {
    getAllCategories()
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  };

  const fetchProducts = () => {
    setLoading(true);

    const query = {
      ...filters,
      sort: sortOption
    };

    getFilteredProducts(query)
      .then((res) => {
        setProducts(res.data);
        setTimeout(() => setLoading(false), 100);
      })
      .catch((err) => console.error(err));
  };

  const handleCheckboxChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(v => v !== value)
        : [...prev[key], value]
    }));
  };

  return (
    <div className="p-4 md:mr-10 md:ml-10">
      {/* Filter Toggle Button */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="border px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
        >
          {showFilter ? 'Hide Filter' : 'Show Filter'}
        </button>

        {/* Sort Dropdown */}
        <div className="flex items-center">
          <label htmlFor="sort" className="text-sm font-medium mr-2">Sort by:</label>
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
      </div>

      <div className={`grid gap-4 ${showFilter ? 'grid-cols-1 md:grid-cols-5 ' : 'grid-cols-1 md:grid-cols-4'}`}>
        {showFilter && (
          <div className="md:grid-cols-1 bg-white p-4 ">
            {/* Category */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Category</h3>
              {categories.map(cat => (
                <div key={cat.categoryid}>
                  <button
                    className={`text-left ${filters.category_id === cat.categoryid ? 'font-bold' : ''}`}
                    onClick={() =>
                      setFilters(f => ({
                        ...f,
                        category_id: f.category_id === cat.categoryid ? '' : cat.categoryid
                      }))
                    }
                  >
                    {cat.categoryname}
                  </button>
                </div>
              ))}
            </div>

            {/* Gender */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Gender</h3>
              {['Men', 'Women', 'Kid'].map(g => (
                <label key={g} className="block">
                  <input
                    type="checkbox"
                    checked={filters.gender.includes(g)}
                    onChange={() => handleCheckboxChange('gender', g)}
                    className="mr-2"
                  />
                  {g}
                </label>
              ))}
            </div>

            {/* Price */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Shop by Price</h3>
              {[
                'under_50',
                '50_100',
                '101_199',
                'over_200'
              ].map(price => {
                const label = {
                  under_50: 'Under $50',
                  '50_100': '$50 - $100',
                  '101_199': '$101 - $199',
                  over_200: 'Over $200'
                }[price];

                return (
                  <label key={price} className="block">
                    <input
                      type="checkbox"
                      checked={filters.price.includes(price)}
                      onChange={() => handleCheckboxChange('price', price)}
                      className="mr-2"
                    />
                    {label}
                  </label>
                );
              })}
            </div>

            {/* Clothing Sizes */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Clothing Sizes</h3>
              {['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'One Size'].map(size => (
                <label key={size} className="block">
                  <input
                    type="checkbox"
                    checked={filters.clothingSize.includes(size)}
                    onChange={() => handleCheckboxChange('clothingSize', size)}
                    className="mr-2"
                  />
                  {size}
                </label>
              ))}
            </div>

            {/* Shoe Sizes */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Shoe Sizes</h3>
              {[
                'US M 6 / W 7.5',
                'US M 6.5 / W 8',
                'US M 7 / W 8.5',
                'US M 7.5 / W 9',
                'US M 8 / W 9.5',
                'US M 8.5 / W 10',
                'US M 9 / W 10.5',
                'US M 9.5 / W 11',
                'US M 10 / W 11.5',
                'US M 10.5 / W 12',
                'US M 11 / W 12.5',
                'US M 11.5 / W 13',
                'US M 12 / W 13.5',
                'US M 13 / W 14.5',
              ].map(size => (
                <label key={size} className="block">
                  <input
                    type="checkbox"
                    checked={filters.shoeSize.includes(size)}
                    onChange={() => handleCheckboxChange('shoeSize', size)}
                    className="mr-2"
                  />
                  {size}
                </label>
              ))}
            </div>

            {/* Color */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Colors</h3>
              {['Black', 'White', 'Violet', 'DarkGrey', 'Green', 'Yellow'].map(color => (
                <label key={color} className="block">
                  <input
                    type="checkbox"
                    checked={filters.color.includes(color)}
                    onChange={() => handleCheckboxChange('color', color)}
                    className="mr-2"
                  />
                  {color}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className={`${showFilter ? 'col-span-4 md:grid-cols-3' : 'col-span-4 md:grid-cols-4'} grid grid-cols-1 sm:grid-cols-2   gap-4`}>
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
                  className="bg-white"
                >
                  <Link to={`/product/${product.productid}`}>
                    <img
                      src={product.productimage}
                      alt={product.productname}
                      className="w-full h-full md:h-[375px] rounded-md mb-4"
                    />
                  </Link>
                  <div className="h-[60px] md:h-[80px]">
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
    </div>
  );
}

export default ProductsPage;
