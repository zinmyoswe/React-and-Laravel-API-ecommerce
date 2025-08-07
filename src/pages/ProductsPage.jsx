import React, { useEffect, useState } from 'react';
import { getFilteredProducts, getAllSubcategories } from '../services/productService';
import { Link, useLocation } from 'react-router-dom';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import qs from 'qs';
import ProductCardWithHover from '../components/ProductCardWithHover';
import './ProductsPage.css';

function ProductsPage() {
  const location = useLocation();
  const query = qs.parse(location.search, { ignoreQueryPrefix: true });
  const searchKeyword = query.search || '';
  

  // Helper to get gender from pathname or query
  const getGenderFromPath = () => {
    if (location.pathname === '/men') return ['Men'];
    if (location.pathname === '/women') return ['Women'];
    if (location.pathname === '/kids') return ['Kid'];
    if (query.gender) return [query.gender];
    return [];
  };

  // Filters state
  const [filters, setFilters] = useState({
    subcategory_id: query.subcategory_id || '',
    gender: getGenderFromPath(),
    price: [],
    clothingSize: [],
    shoeSize: [],
    color: [],
    search: query.search || '', // ✅ ADD THIS
    shopbysportId: query.shopbysportId || '',  // <-- add this line
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('');
  const [showFilter, setShowFilter] = useState(window.innerWidth >= 768);
  const [accordion, setAccordion] = useState({
    gender: false,
    price: false,
    clothingSize: false,
    shoeSize: false,
    color: false,
  });
  const [subcategories, setSubcategories] = useState([]);

  // Sync filters whenever pathname or query changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      gender: getGenderFromPath(),
      subcategory_id: query.subcategory_id || '',
      search: query.search || '', // ✅ Sync search keyword
      shopbysportId: query.shopbysportId || '',  // <-- sync here too
      // Optionally sync other filters from query here if you want
    }));
  }, [location.pathname, location.search]);

  // Load subcategories once
  useEffect(() => {
    getAllSubcategories()
      .then(res => setSubcategories(res.data))
      .catch(console.error);
  }, []);

  // Handle window resize for showFilter toggle
  useEffect(() => {
    const handleResize = () => {
      setShowFilter(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch products when filters or sorting change
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sortOption]);

  const fetchProducts = () => {
    setLoading(true);
    const sizevalue = [...filters.clothingSize, ...filters.shoeSize];

    // Compose API filters (remove empty arrays or undefined)
    const apiFilters = {
      subcategory_id: filters.subcategory_id || undefined,
      gender: filters.gender.length > 0 ? filters.gender : undefined,
      price: filters.price.length > 0 ? filters.price : undefined,
      sizevalue: sizevalue.length > 0 ? sizevalue : undefined,
      color: filters.color.length > 0 ? filters.color : undefined,
      sort: sortOption || undefined,
      search: filters.search || undefined, // ✅ Pass search keyword to backend
      shopbysportId: filters.shopbysportId || undefined,  // <-- add this here
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
        [key]: isChecked ? current.filter(v => v !== value) : [...current, value],
      };
    });
  };

  const handleSubcategoryClick = (id) => {
    setFilters(prev => {
      const newId = prev.subcategory_id === id ? '' : id;
      console.log('Subcategory clicked:', id, 'New subcategoryId:', newId);
      return { ...prev, subcategory_id: newId };
    });
  };

  const toggleAccordion = (section) => {
    setAccordion(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="p-4 md:mx-10"
      style={{
        fontFamily: `'Helvetica Now Display Medium', Helvetica, Arial, sans-serif;`
            }}
    >
  {/* Top Row: Search keyword (left) + Controls (right) */}
  <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
    
    {/* Left side: Search keyword */}
    <div className="text-lg font-semibold text-dark">
      {searchKeyword && (
        <span>
          Search results for "<span className="text-black italic">{searchKeyword}</span>"
        </span>
      )}
    </div>

    {/* Right side: Controls */}
    <div className="flex items-center gap-4 flex-wrap">
      <button
        onClick={() => setShowFilter(!showFilter)}
        className="px-4 py-2 flex items-center gap-2"
      >
        <svg
          aria-hidden="true"
          className="icon-filter-ds"
          focusable="false"
          viewBox="0 0 24 24"
          role="img"
          width="24px"
          height="24px"
          fill="none"
        >
          <path stroke="currentColor" strokeWidth="1.5" d="M21 8.25H10m-5.25 0H3"></path>
          <path stroke="currentColor" strokeWidth="1.5" d="M7.5 6v0a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" clipRule="evenodd"></path>
          <path stroke="currentColor" strokeWidth="1.5" d="M3 15.75h10.75m5 0H21"></path>
          <path stroke="currentColor" strokeWidth="1.5" d="M16.5 13.5v0a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" clipRule="evenodd"></path>
        </svg>
        {showFilter ? 'Hide Filters' : 'Show Filters'}
      </button>

      <div className="flex items-center">
        <label htmlFor="sort" className="text-sm font-medium mr-2">
          {/* Sort by: */}
        </label>
        <select
          id="sort"
          value={sortOption}
          onChange={e => setSortOption(e.target.value)}
          className=" px-1 py-1"
        >
          <option value="">Sort By</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>
    </div>
  </div>
      <div className={`grid gap-4 ${showFilter ? 'grid-cols-1 md:grid-cols-5' : 'grid-cols-1 md:grid-cols-4'}`}>
        {/* Sidebar */}
        {showFilter && (
          <div className="col-span-1">
            {/* Subcategory Filter */}
            <div className="mb-4">
              {/* <button
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
               */}
              {subcategories.map(sub => (
                <div
                key={sub.subcategoryid}
                onClick={() => handleSubcategoryClick(sub.subcategoryid)}
                className={`cursor-pointer px-2 py-1 rounded
                  ${filters.subcategory_id === sub.subcategoryid
                    ? ' text-dark font-semibold'
                    : ''}`}
             
              >
                {sub.subcategoryname}
              </div>

              ))}
            </div>

            {/* Accordion Sections */}
            {['gender', 'price', 'clothingSize', 'shoeSize', 'color'].map(section => (
              <div key={section} className="mb-6 pb-4 border-b border-gray-200">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleAccordion(section)}
                >
                  <h3 className="font-semibold"
                    style={{
                      fontFamily: `'Helvetica Now Text Medium',Helvetica,Arial,sans-serif`,
                      fontWeight: 400
                    }}
                  >
                    {section === 'price' ? 'Shop by Price' :
                      section === 'clothingSize' ? 'Clothing Sizes' :
                      section === 'shoeSize' ? 'Shoe Sizes' :
                        section.charAt(0).toUpperCase() + section.slice(1)}
                  </h3>
                  <FontAwesomeIcon icon={accordion[section] ? faChevronUp : faChevronDown} />
                </div>
                {accordion[section] && (
                  <div className="mt-2 space-y-1 "
                     style={{
                        fontFamily: `'Helvetica Now Text', Helvetica, Arial, sans-serif`,
                        fontWeight: 400
                      }}
                  >
                    {{
                      gender: ['Men', 'Women', 'Kids'],
                      price: ['under_50', '50_100', '101_199', 'over_200'],
                      clothingSize: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'One Size'],
                      shoeSize: [
                        'US M 6 / W 7.5', 'US M 6.5 / W 8', 'US M 7 / W 8.5', 'US M 7.5 / W 9',
                        'US M 8 / W 9.5', 'US M 8.5 / W 10', 'US M 9 / W 10.5', 'US M 9.5 / W 11',
                        'US M 10 / W 11.5', 'US M 10.5 / W 12', 'US M 11 / W 12.5', 'US M 11.5 / W 13',
                        'US M 12 / W 13.5', 'US M 13 / W 14.5'
                      ],
                      color: ['Black', 'White', 'Violet', 'DarkGray', 'Gray', 'Navy', 'Yellow', 'Red' , 'Rose', 'Brown']
                    }[section].map(value => {
                      
                      const label = section === 'price'
                        ? {
                          under_50: 'Under $50',
                          '50_100': '$50-$100',
                          '101_199': '$101-$199',
                          over_200: 'Over $200'
                        }[value]
                        : value;

                        // console.log('section:', section, 'value:', value, 'label:', label);
                      return (
                        <label key={value} className="flex items-center cursor-pointer select-none hover:text-gray-400">
                          <input
                            type="checkbox"
                            checked={(filters[section] || []).includes(value)}
                            onChange={() => handleCheckboxChange(section, value)}
                            className="mr-2 accent-black cursor-pointer "
                            style={{ width: '19px', height: '19px' }}
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
        <div className={`col-span-4 grid gap-4 grid-cols-2 lg:grid-cols-3 md:grid-cols-3`}>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 p-4 rounded shadow">
                <div className="h-[200px] md:h-[350px] lg:h-[350px] bg-gray-300 rounded mb-4" />
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-300 rounded w-1/2" />
              </div>
            ))
            : products.length === 0 ? (
              <div className="col-span-full flex flex-col items-center text-dark text-lg md:text-xl font-semibold p-2">
                <p className="mb-2 mt-36">We can't find the product you are looking for.</p>
                <p className="text-lg md:text-xl text-dark">Sorry for the inconvenience.</p>
              </div>
            ) : (
              products.map(p => (
                <ProductCardWithHover key={p.productid} product={p} showFilter={showFilter} />
              ))
            )}
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
