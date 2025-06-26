import React, { useEffect, useState } from 'react';
import { getFilteredProducts, getAllSubcategories } from '../services/productService';
import { Link } from 'react-router-dom';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('');
  const [showFilter, setShowFilter] = useState(window.innerWidth >= 768);
  const [accordion, setAccordion] = useState({
    gender: true,
    price: true,
    clothingSize: false,
    shoeSize: false,
    color: true,
  });
  const [subcategories, setSubcategories] = useState([]);
  const [filters, setFilters] = useState({
    subcategory_id: '', // frontend state key
    gender: [],
    price: [],
    clothingSize: [],
    shoeSize: [],
    color: [],
  });

  // Load subcategories once
  useEffect(() => {
    getAllSubcategories()
      .then(res => setSubcategories(res.data))
      .catch(console.error);
  }, []);

  // Handle window resize for showFilter toggle
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setShowFilter(false);
      else setShowFilter(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch products whenever filters or sorting changes
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sortOption]);

  // Compose filter payload for backend
  const fetchProducts = () => {
    setLoading(true);

    // Combine clothingSize and shoeSize into single sizevalue array for backend
    const sizevalue = [...filters.clothingSize, ...filters.shoeSize];

    // Prepare backend filters with keys backend expects (subcategory_id, sizevalue)
    const apiFilters = {
      // Only send subcategory_id if non-empty
      subcategory_id: filters.subcategory_id || undefined, // Already correct
      gender: filters.gender,
      price: filters.price,
      sizevalue,
      color: filters.color,
      sort: sortOption,
    };

    console.log('Fetching products with filters:', apiFilters);

    getFilteredProducts(apiFilters)
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  // Toggle checkboxes (multi-select)
  const handleCheckboxChange = (key, value) => {
    setFilters(prev => {
      const current = prev[key] || [];
      const isChecked = current.includes(value);
      return {
        ...prev,
        [key]: isChecked ? current.filter(v => v !== value) : [...current, value]
      };
    });
  };



  const handleSubcategoryClick = (id) => {
  setFilters(prev => {
    const newId = prev.subcategory_id  === id ? '' : id;
    console.log('Subcategory clicked:', id, 'New subcategoryId:', newId);
    return { ...prev, subcategory_id : newId };
  });
};

  // Accordion toggle
  const toggleAccordion = section => {
    setAccordion(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="p-4 md:mx-10">
      {/* Controls */}
      <div className="flex items-center justify-end mb-4 gap-4 flex-wrap">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="border px-4 py-2"
        >
          {showFilter ? 'Hide Filters' : 'Show Filters'}
        </button>
        <div className="flex items-center">
          <label htmlFor="sort" className="text-sm font-medium mr-2">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortOption}
            onChange={e => setSortOption(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">Featured</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      <div className={`grid gap-4 ${showFilter ? 'grid-cols-1 md:grid-cols-5' : 'grid-cols-1 md:grid-cols-4'}`}>
        {/* Sidebar */}
        {showFilter && (
          <div className="col-span-1 bg-white p-4 rounded shadow">
            {/* Subcategory Filter */}
            <div className="mb-4">
              <button
                onClick={() => setFilters({
                  subcategory_id: '',
                  gender: [],
                  price: [],
                  clothingSize: [],
                  shoeSize: [],
                  color: []
                })}
                className="mb-4 font-semibold"
              >
                Home
              </button>
              {/* <h3 className="font-semibold mb-2">Subcategories</h3> */}
              {subcategories.map(sub => (
                <div
  key={sub.subcategoryid}
  onClick={() => handleSubcategoryClick(sub.subcategoryid)}
  className={`cursor-pointer px-2 py-1 rounded
    ${filters.subcategory_id === sub.subcategoryid
      ? ' text-dark font-semibold underline'
      : 'hover:underline'}`}
>
  {sub.subcategoryname}
</div>

              ))}
            </div>

            {/* Accordion Sections */}
            {['gender', 'price', 'clothingSize', 'shoeSize', 'color'].map(section => (
              <div key={section} className="mb-4">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleAccordion(section)}
                >
                  <h3 className="font-semibold">
                    {section === 'price' ? 'Shop by Price' :
                      section === 'clothingSize' ? 'Clothing Sizes' :
                      section === 'shoeSize' ? 'Shoe Sizes' :
                        section.charAt(0).toUpperCase() + section.slice(1)}
                  </h3>
                  <FontAwesomeIcon icon={accordion[section] ? faChevronUp : faChevronDown} />
                </div>
                {accordion[section] && (
                  <div className="mt-2 space-y-1">
                    {{
                      gender: ['Men', 'Women', 'Kid'],
                      price: ['under_50', '50_100', '101_199', 'over_200'],
                      clothingSize: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'One Size'],
                      shoeSize: [
                        'US M 6 / W 7.5', 'US M 6.5 / W 8', 'US M 7 / W 8.5', 'US M 7.5 / W 9',
                        'US M 8 / W 9.5', 'US M 8.5 / W 10', 'US M 9 / W 10.5', 'US M 9.5 / W 11',
                        'US M 10 / W 11.5', 'US M 10.5 / W 12', 'US M 11 / W 12.5', 'US M 11.5 / W 13',
                        'US M 12 / W 13.5', 'US M 13 / W 14.5'
                      ],
                      color: ['Black', 'White', 'Violet', 'DarkGrey', 'Navy', 'Yellow']
                    }[section].map(value => {
                      const label = section === 'price'
                        ? {
                          under_50: 'Under $50',
                          50_100: '$50-$100',
                          101_199: '$101-$199',
                          over_200: 'Over $200'
                        }[value]
                        : value;
                      return (
                        <label key={value} className="flex items-center cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={(filters[section] || []).includes(value)}
                            onChange={() => handleCheckboxChange(section, value)}
                            className="mr-2 accent-black cursor-pointer"
                          />
                          {label}
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Products */}
        <div className={`col-span-4 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3`}>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 p-4 rounded shadow">
                <div className="h-[350px] bg-gray-300 rounded mb-4" />
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-300 rounded w-1/2" />
              </div>
            ))
            : products.length === 0 ? (
              <p>No products found.</p>
            ) : (
              products.map(p => (
                <div key={p.productid} className="bg-white p-4 rounded shadow">
                  <Link to={`/product/${p.productid}`}>
                    <img
                      src={p.productimage}
                      alt={p.productname}
                      className="w-full h-[395px] object-cover rounded mb-4"
                    />
                  </Link>
                  <Link to={`/product/${p.productid}`}>
                    <h2 className="text-lg font-semibold hover:text-gray-900">{p.productname}</h2>
                  </Link>
                  <p className="text-gray-600 mt-1">${p.price}</p>
                </div>
              ))
            )}
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
