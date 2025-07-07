import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFavourites, removeFromFavourite } from '../services/favouriteService';
import { addToCart } from '../services/cartService';

function MyFavourite() {
  const navigate = useNavigate();
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFav, setSelectedFav] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [addedToCartIds, setAddedToCartIds] = useState(new Set());
  const [loadingIds, setLoadingIds] = useState(new Set());
  const [modalError, setModalError] = useState('');

  useEffect(() => {
    fetchFavourites();
  }, []);

  const fetchFavourites = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const res = await getFavourites();
      setFavourites(res.data);
    } catch (err) {
      console.error('Failed to fetch favourites:', err);
      alert('Failed to load favourites.');
    } finally {
      setLoading(false);
    }
  };

//   const handleRemove = async (favId) => {
//     if (!window.confirm('Remove this product from favourites?')) return;
//     try {
//       await removeFromFavourite(favId);
//       setFavourites(favourites.filter(fav => fav.id !== favId));
//     } catch (err) {
//       console.error('Failed to remove favourite:', err);
//       alert('Failed to remove favourite.');
//     }
//   };

const handleRemoveFavourite = async (fav) => {
  try {
    // Pass product_id (not fav.id) to match your backend
    const response = await removeFromFavourite(fav.product_id);

    if (response.data.deleted) {
      // Remove from UI state here (e.g., filter out from list)
      setFavourites((prev) => prev.filter(item => item.product_id !== fav.product_id));
    } else {
      alert('Failed to remove favourite');
    }
  } catch (error) {
    console.error('Error removing favourite:', error);
  }
};


  const handleAddToCart = async (fav) => {
    try {
      if (fav.size) {
        setLoadingIds(prev => new Set(prev).add(fav.id));

        await addToCart(fav.product_id, fav.size);

        setLoadingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(fav.id);
          return newSet;
        });
        setAddedToCartIds(prev => new Set(prev).add(fav.id));
        setTimeout(() => {
          setAddedToCartIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(fav.id);
            return newSet;
          });
        }, 3000);

        navigate('/cart');
      } else {
        setSelectedFav(fav);
        setShowSizeModal(true);
        setSelectedSize('');
        setModalError('');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      alert('Failed to add to cart.');
      setLoadingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(fav.id);
        return newSet;
      });
    }
  };

  const handleModalAddToCart = async () => {
    if (!selectedSize) {
      setModalError('Please select size.');
      return;
    }
    setModalError('');
    setLoadingIds(prev => new Set(prev).add(selectedFav.id));
    try {
      await addToCart(selectedFav.product_id, selectedSize);
      setAddedToCartIds(prev => new Set(prev).add(selectedFav.id));
      setTimeout(() => {
        setShowSizeModal(false);
        setSelectedFav(null);
        setSelectedSize('');
        setAddedToCartIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(selectedFav.id);
          return newSet;
        });
        navigate('/cart');
      }, 1000);
    } catch (error) {
      console.error('Add to cart failed:', error);
      alert('Failed to add to cart.');
    } finally {
      setLoadingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(selectedFav.id);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin"></div>

        {/* Text */}
        {/* <p className="text-gray-500 text-sm">Fetching your orders... Please Wait</p> */}
      </div>
    </div>
  );
  }

  if (favourites.length === 0) {
    return (
      <div className="p-6 text-center">
        <p>You have no favourite products yet.</p>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 px-4 py-2 bg-zinc-900 text-white rounded"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">Favourites</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favourites.map((fav) => (
          <div
            key={fav.id}
            className="flex flex-col cursor-pointer  transition"
          >
            <img
              src={fav.product?.productimage}
              alt={fav.product?.productname}
              className="w-full object-fill mb-4"
              onClick={() => navigate(`/product/${fav.product_id}`)}
            />
            <h2
              className="text-lg font-semibold mb-1 hover:underline"
              onClick={() => navigate(`/product/${fav.product_id}`)}
            >
              {fav.product?.productname}
            </h2>
            <p className="text-gray-700 mb-1">${fav.product?.price}</p>
            <p className="text-gray-600 mb-2">{fav.product?.color}</p>
            {fav.size && <p className="text-gray-600 mb-2">Size: {fav.size}</p>}

            <button
              onClick={() => handleRemoveFavourite(fav)}
              className="mt-auto px-3 py-3 border border-gray-400 text-black rounded-full hover:bg-gray-200"
            >
              Remove
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(fav);
              }}
              disabled={loadingIds.has(fav.id) || addedToCartIds.has(fav.id)}
              className={`mt-2 mb-8 px-3 py-3 rounded-full flex items-center justify-center ${
                loadingIds.has(fav.id)
                  ? 'bg-gray-300 cursor-wait text-black'
                  : addedToCartIds.has(fav.id)
                  ? 'bg-green-600 text-white cursor-default'
                  : 'bg-zinc-900 text-white hover:bg-zinc-700'
              }`}
            >
              {loadingIds.has(fav.id) ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  {/* Processing… */}
                </>
              ) : addedToCartIds.has(fav.id) ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="inline-block h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Added
                </>
              ) : (
                'Add to Cart'
              )}
            </button>

            {/* Size Selection Modal */}
            {showSizeModal && selectedFav?.id === fav.id && (
              <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-lg w-full max-w-3xl p-6 md:flex relative">
                  {/* Close Button */}
                  <button
                    className="absolute top-3 right-3 text-gray-900 bg-gray-100 bg-opacity-45 w-12 h-12 rounded-full hover:text-black text-xl font-bold"
                    onClick={() => {
                      setShowSizeModal(false);
                      setSelectedSize('');
                      setSelectedFav(null);
                      setModalError('');
                    }}
                  >
                    &times;
                  </button>

                  {/* Left - Text & Size Selection */}
                  <div className="md:w-1/2 w-full md:pr-6 mb-4 md:mb-0">
                    <h2 className="text-xl font-semibold mb-2">
                      {selectedFav.product?.productname}
                    </h2>
                    <p className="text-gray-700 mb-1">${selectedFav.product?.price}</p>
                    <p className="text-gray-700 mb-4">Color: {selectedFav.product?.color}</p>

                    <label className="block mb-2 font-medium">Choose Size:</label>
                    <div className="flex flex-wrap gap-1 mb-1">
                      {selectedFav.product?.sizes?.map((sizeObj, idx) => (
                        <label
                          key={idx}
                          className={`border border-zinc-300 min-w-16 hover:border-zinc-900 px-6 py-2 rounded cursor-pointer ${
                            selectedSize === sizeObj.sizevalue
                              ? 'bg-zinc-900 text-white'
                              : 'bg-white'
                          }`}
                          onClick={() => {
                            setSelectedSize(sizeObj.sizevalue);
                            setModalError('');
                          }}
                        >
                          {sizeObj.sizevalue}
                        </label>
                      ))}
                    </div>

                    {modalError && (
                      <p className="text-red-600 text-sm mb-2">{modalError}</p>
                    )}

                    <button
                      onClick={handleModalAddToCart}
                      disabled={loadingIds.has(selectedFav.id)}
                      className={`px-5 my-5 py-3 rounded-full flex items-center justify-center ${
                        loadingIds.has(selectedFav.id)
                          ? 'bg-zinc-800 cursor-wait text-white'
                          : 'bg-zinc-900 text-white'
                      }`}
                      type="button"
                    >
                      {loadingIds.has(selectedFav.id) ? (
                        <>
                         <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          {/* Processing… */}
                        </>
                      ) : (
                        'Add to Bag'
                      )}
                    </button>
                  </div>

                  {/* Right - Product Image */}
                  <div className="md:w-1/2 w-full flex items-center justify-center">
                    <img
                      src={selectedFav.product?.productimage}
                      alt={selectedFav.product?.productname}
                      className=" object-fill"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyFavourite;
