import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ReactStars from 'react-rating-stars-component';
import { FiShoppingCart, FiHeart, FiEye } from 'react-icons/fi';
import { addToCart } from '../../Redux/cartSlice';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const options = {
    edit: false,
    color: 'rgba(255, 255, 255, 0.2)',
    activeColor: '#f59e0b',
    size: window.innerWidth < 600 ? 18 : 22,
    value: product.ratings || 0,
    isHalf: true,
  };

  // Get the first image or use a placeholder
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0].url 
    : 'https://via.placeholder.com/300x300?text=No+Image';

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.Stock < 1) {
      toast.error('Product is out of stock');
      return;
    }
    
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      price: product.price,
      image: imageUrl,
      stock: product.Stock,
      quantity: 1,
    }));
  };

  return (
    <div className="group bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-2">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <Link to={`/product/${product._id}`}>
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </Link>
        
        {/* Overlay Buttons */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          <button className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-amber-500 transition-colors duration-300">
            <FiHeart className="text-white text-xl" />
          </button>
          <button 
            onClick={handleAddToCart}
            disabled={product.Stock < 1}
            className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-amber-500 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiShoppingCart className="text-white text-xl" />
          </button>
          <Link 
            to={`/product/${product._id}`}
            className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-amber-500 transition-colors duration-300"
          >
            <FiEye className="text-white text-xl" />
          </Link>
        </div>

        {/* Stock Badge */}
        {product.Stock > 0 ? (
          <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
            In Stock
          </span>
        ) : (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
            Out of Stock
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category */}
        <span className="text-amber-400 text-xs uppercase tracking-wider font-medium">
          {product.category}
        </span>

        {/* Name */}
        <Link to={`/product/${product._id}`}>
          <h3 className="text-white text-lg font-bold mt-1 hover:text-amber-400 transition-colors duration-300 line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-gray-400 text-sm mt-2 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center mt-3">
          <ReactStars {...options} />
          <span className="ml-2 text-gray-400 text-sm">
            ({product.numOfReviews} {product.numOfReviews === 1 ? 'Review' : 'Reviews'})
          </span>
        </div>

        {/* Price & Buttons */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-2xl font-bold text-amber-400">
            ${product.price?.toFixed(2)}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              disabled={product.Stock < 1}
              className="p-2 bg-amber-500 hover:bg-amber-600 text-gray-900 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              title={product.Stock < 1 ? 'Out of Stock' : 'Add to Cart'}
            >
              <FiShoppingCart size={18} />
            </button>
            <Link
              to={`/product/${product._id}`}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-300"
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
