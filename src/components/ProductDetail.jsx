import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { addToCart } from '../services/cartService';
import { addToFavourite, getFavourites,removeFromFavourite  } from '../services/favouriteService';
import { useCart } from '../context/CartContext';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [sizeError, setSizeError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const cartTimeoutRef = useRef(null);
  const [relatedGroup, setRelatedGroup] = useState([]); // Holds fixed order of main + related
  const [rootProductId, setRootProductId] = useState(null);
  const [isFavourited, setIsFavourited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { fetchCart } = useCart(); // get fetchCart from context
  

  

  const fetchProduct = (productId, isRoot = false) => {
    getProductById(productId)
      .then(async (res) => {
        setProduct(res.data);
        setMainImage(res.data.productimage);
        window.history.replaceState(null, '', `/product/${productId}`);

        if (isRoot) {
        setRootProductId(res.data.productid);
        const group = [res.data, ...(res.data.similar_products || [])];
        setRelatedGroup(group);
        }

        // Check if favourited
        try {
          const favs = await getFavourites();
          const favProductIds = favs.data.map(f => f.product_id);
          setIsFavourited(favProductIds.includes(res.data.productid));
        } catch (err) {
          console.error('Failed to fetch favourites:', err);
        }
      })
      .catch((err) => console.error(err));
  };

  // useEffect(() => {
  //   // If no root yet, this is initial load
  //   if (!rootProductId) {
  //     fetchProduct(id, true); // Initial load
  //   } else {
  //     fetchProduct(id); // Navigating inside group
  //   }
  // }, [id]);

  





const handleAddToCart = async () => {
  if (!selectedSize) {
    setSizeError('Please select your size');
    return;
  }

  try {
    await addToCart(product.productid, selectedSize);
    // navigate('/cart'); // Redirect to CartPage
     setShowModal(true); // Show modal

    // Wait 4s before navigating
    // setTimeout(() => {
    //   setShowModal(false);
    //   navigate('/cart');
    // }, 10000);
    // ✅ Clear any old timeout before setting new one
    if (cartTimeoutRef.current) {
      clearTimeout(cartTimeoutRef.current);
    }

    cartTimeoutRef.current = setTimeout(async () => {
  setShowModal(false);
   await fetchCart(); 
  navigate('/cart');  // ✅ reloads the page
}, 4000);
  } catch (error) {
    console.error('Failed to add to cart:', error);
  }
};



const handleAddToFavourite = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    navigate('/login');
    return;
  }

  setIsLoading(true); // start loading

  try {
    if (isFavourited) {
      await removeFromFavourite(product.productid);
      setIsFavourited(false);
      // alert('Removed from Favourites!');
    } else {
      await addToFavourite(product.productid, selectedSize || null);
      setIsFavourited(true);
      // alert('Added to Favourites!');
    }
  } catch (err) {
    console.error('Favourite toggle failed:', err);
    alert('Failed to update Favourite.');
  } finally {
    setIsLoading(false); // stop loading
  }
};

useEffect(() => {
  // ✅ Cancel redirect timeout on product change
  if (cartTimeoutRef.current) {
    clearTimeout(cartTimeoutRef.current);
    cartTimeoutRef.current = null;
  }

  // ✅ Immediately close modal when navigating
  setShowModal(false);

  // ✅ Reset selected size and error
  setSelectedSize('');
  setSizeError('');

  // ✅ Initial load vs group navigation
  if (!rootProductId) {
    fetchProduct(id, true); // Initial load
  } else {
    fetchProduct(id); // Internal similar product switch
  }

  // ✅ Cleanup on unmount or id change
  return () => {
    if (cartTimeoutRef.current) {
      clearTimeout(cartTimeoutRef.current);
      cartTimeoutRef.current = null;
    }
  };
}, [id]);



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
      <div className="col-span-12 md:col-span-4 space-y-4">
        <div className='w-full md:w-4/5'>
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
            {/* <img
              src={product.productimage}
              alt="Current Product"
              onClick={() => fetchProduct(product.productid)}
              className="w-20 h-20  rounded-md border cursor-pointer hover:ring-1 ring-black"
            /> */}

            {/* Similar products */}
            {/* {product.similar_products?.map((similar) => (
              <img
                key={similar.productid}
                src={similar.productimage}
                alt={`Similar ${similar.productid}`}
                onClick={() => fetchProduct(similar.productid)}
                className="w-20 h-20  rounded-md border cursor-pointer hover:ring-1 ring-black"
              />
            ))} */}

            {relatedGroup.map((p) => (
              <img
                key={p.productid}
                src={p.productimage}
                alt={`Product ${p.productid}`}
                onClick={() => fetchProduct(p.productid)}
                className={`w-20 h-20 rounded-md border cursor-pointer hover:ring-1 ring-black ${
                  p.productid === product.productid ? 'ring-1 ring-black' : ''
                }`}
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

        <button
  onClick={handleAddToFavourite}
  disabled={isLoading}
  className={`px-6 my-3 py-4 rounded-full w-full border flex items-center justify-center gap-2 transition
    ${isFavourited 
      ? 'bg-gray-100 text-black border-zinc-900 hover:bg-gray-100' 
      : 'bg-white text-black border-zinc-900 hover:bg-gray-100'}
    ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
  `}
>
  {isLoading ? (
    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
  ) : (
    <>
      {isFavourited ? (
        // ✅ Filled heart icon for favourited state
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 24 24"
          role="img"
          width="24px"
          height="24px"
          fill="none"
        >
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M16.794 3.75c1.324 0 2.568.516 3.504 1.451a4.96 4.96 0 010 7.008L12 20.508l-8.299-8.299a4.96 4.96 0 010-7.007A4.923 4.923 0 017.205 3.75c1.324 0 2.568.516 3.504 1.451L12 6.492l1.29-1.291a4.926 4.926 0 013.504-1.451z"
            clipRule="evenodd"
          ></path>
          <path
            stroke="currentColor"
            strokeWidth="1.5"
            d="M16.794 3.75c1.324 0 2.568.516 3.504 1.451a4.96 4.96 0 010 7.008L12 20.508l-8.299-8.299a4.96 4.96 0 010-7.007A4.923 4.923 0 017.205 3.75c1.324 0 2.568.516 3.504 1.451L12 6.492l1.29-1.291a4.926 4.926 0 013.504-1.451z"
          ></path>
          <title>filled</title>
        </svg>
      ) : (
        // 🤍 Outline heart icon (non-filled)
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 24 24"
          role="img"
          width="24px"
          height="24px"
          fill="none"
        >
          <path
            stroke="currentColor"
            strokeWidth="1.5"
            d="M16.794 3.75c1.324 0 2.568.516 3.504 1.451a4.96 4.96 0 010 7.008L12 20.508l-8.299-8.299a4.96 4.96 0 010-7.007A4.923 4.923 0 017.205 3.75c1.324 0 2.568.516 3.504 1.451l.76.76.531.531.53-.531.76-.76a4.926 4.926 0 013.504-1.451"
          />
          <title>non-filled</title>
        </svg>
      )}
      {isFavourited ? 'Favourited' : 'Add to Favourite'}
    </>
  )}
</button>




        <p className="text-gray-700 text-sm whitespace-pre-line break-words !my-6">
          {product.description}
        </p>
        </div>    
      </div>

      {/* Right Blank */}
      <div className="hidden md:block md:col-span-2" />
    

    {showModal && (
  <div className={`fixed inset-0 z-50 flex items-center justify-center md:justify-end md:items-start p-4`}>
    <div
      className={`bg-white rounded-lg shadow-lg border w-full max-w-md md:mt-4 md:mr-4 animate-fade-in-up`}
    >
      <div className="flex justify-between items-center border-b px-4 py-2">
        <h2 className="text-lg font-medium text-zinc-900 flex items-center gap-2">
          <svg className="w-5 h-5 text-green-800" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 1.5C6.21 1.5 1.5 6.21 1.5 12S6.21 22.5 12 22.5 22.5 17.79 22.5 12 17.79 1.5 12 1.5zm-1.06 14l-3.18-3.18 1.06-1.06 2.12 2.12 4.24-4.24 1.06 1.06-5.3 5.3z" />
          </svg>
          Added to the Bag
        </h2>
        <button onClick={() => { setShowModal(false); navigate('/cart'); }}>
          <span className="text-gray-500 hover:text-black">&times;</span>
        </button>
      </div>
      <div className="p-4 flex gap-4">
        <img src={mainImage} alt="Product" className="w-24 h-24 object-fill" />
        <div>
          <h3 className="font-semibold">{product.productname}</h3>
          <p className="text-sm text-gray-600">${product.price}</p>
          <p className="text-sm text-gray-600">Size: {selectedSize}</p>
          <p className="text-sm text-gray-600">Color: {product.color}</p>
          <p className="text-sm text-gray-600">Qty: 1</p>
        </div>
      </div>
      <div className="px-4 py-2 space-y-2">
        <button
          onClick={() => navigate('/cart')}
          className="w-full bg-white border border-gray-300 text-black px-4 py-4 rounded-full hover:ring-1 ring-black"
        >
          View Bag
        </button>
        <button
          onClick={() => {
            const token = localStorage.getItem('token');
            if (token) {
              navigate('/member-shipping');
            } else {
              navigate('/guest-shipping');
            }
          }}
          className="w-full px-4 py-4 rounded-full bg-zinc-950 text-white hover:bg-gray-400 !mb-6"
        >
          Checkout
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default ProductDetailPage;
