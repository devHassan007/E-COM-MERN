import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchProductDetails, clearProductDetails } from '../../Redux/productSlice';
import { addToCart } from '../../Redux/cartSlice';
import ReactStars from 'react-rating-stars-component';
import Loader from './Loader';
import { FiShoppingCart, FiHeart, FiMinus, FiPlus, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, loading, error } = useSelector((state) => state.products);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    dispatch(fetchProductDetails(id));

    return () => {
      dispatch(clearProductDetails());
    };
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (product.Stock < 1) {
      toast.error('Product is out of stock');
      return;
    }
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.url || '',
      stock: product.Stock,
      quantity,
    }));
    toast.success(`${quantity} item(s) added to cart - Redirecting to checkout...`);
    
    // Navigate to cart/checkout page after a brief delay
    setTimeout(() => {
      navigate('/cart');
    }, 1000);
  };

  const incrementQty = () => {
    if (quantity >= product.Stock) {
      toast.warning('Maximum stock reached');
      return;
    }
    setQuantity(quantity + 1);
  };

  const decrementQty = () => {
    if (quantity <= 1) return;
    setQuantity(quantity - 1);
  };

  const options = {
    edit: false,
    color: 'rgba(255, 255, 255, 0.2)',
    activeColor: '#f59e0b',
    size: 24,
    value: product?.ratings || 0,
    isHalf: true,
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">{error}</p>
          <Link
            to="/product"
            className="px-6 py-3 bg-amber-500 text-gray-900 rounded-lg hover:bg-amber-600 transition-colors"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[selectedImage]?.url
      : 'https://via.placeholder.com/500x500?text=No+Image';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-amber-400">
            ShopEasy
          </Link>
          <Link
            to="/product"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <FiArrowLeft />
            Back to Products
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-gray-800 rounded-2xl overflow-hidden">
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? 'border-amber-500'
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category */}
            <span className="text-amber-400 text-sm uppercase tracking-wider font-medium">
              {product.category}
            </span>

            {/* Name */}
            <h1 className="text-3xl lg:text-4xl font-bold text-white">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <ReactStars {...options} />
              <span className="text-gray-400">
                ({product.numOfReviews} {product.numOfReviews === 1 ? 'Review' : 'Reviews'})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-amber-400">${product.price?.toFixed(2)}</span>
              {product.Stock > 0 ? (
                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
                  In Stock ({product.Stock} available)
                </span>
              ) : (
                <span className="px-3 py-1 bg-red-500/20 text-red-400 text-sm rounded-full">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Description */}
            <div className="border-t border-gray-800 pt-6">
              <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
              <p className="text-gray-400 leading-relaxed">{product.description}</p>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="border-t border-gray-800 pt-6 space-y-4">
              <div className="flex items-center gap-6">
                <span className="text-gray-400">Quantity:</span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={decrementQty}
                    className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-white"
                  >
                    <FiMinus />
                  </button>
                  <span className="text-white text-xl font-semibold w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQty}
                    className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-white"
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.Stock < 1}
                  className="flex-1 flex items-center justify-center gap-3 py-4 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-gray-900 disabled:text-gray-400 font-bold rounded-xl transition-colors"
                >
                  <FiShoppingCart className="text-xl" />
                  Add to Cart
                </button>
                <button className="p-4 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors">
                  <FiHeart className="text-xl text-white" />
                </button>
              </div>
            </div>

            {/* Product ID */}
            <div className="border-t border-gray-800 pt-6">
              <p className="text-gray-500 text-sm">
                Product ID: <span className="text-gray-400">{product._id}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 border-t border-gray-800 pt-12">
          <h2 className="text-2xl font-bold text-white mb-8">Customer Reviews</h2>

          {product.reviews && product.reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.reviews.map((review, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center">
                      <span className="text-amber-400 font-bold">
                        {review.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{review.name}</p>
                      <ReactStars
                        edit={false}
                        color="rgba(255,255,255,0.2)"
                        activeColor="#f59e0b"
                        size={14}
                        value={review.rating}
                        isHalf={true}
                      />
                    </div>
                  </div>
                  <p className="text-gray-400">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-800/30 rounded-xl">
              <p className="text-gray-400">No reviews yet. Be the first to review this product!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;
