import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaShoppingCart } from "react-icons/fa";
import { getAllProducts } from "../../../Api/productApi";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../Redux/cartSlice";
import { toast } from "react-toastify";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAllProducts('', 1, [0, 100000], '', 0);
        setProducts(res.data.products.slice(0, 8));
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ ...product, quantity: 1 }));
    toast.success('Added to cart!');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white py-20 px-4 md:px-8">
      {/* Section Heading */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Our <span className="text-amber-400">Products</span>
        </h2>
        <p className="text-gray-400 mt-2">Explore our amazing collection</p>
        <div className="mt-4 w-24 h-1 bg-amber-500 mx-auto rounded" />
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-2xl p-4 animate-pulse">
              <div className="w-full h-48 bg-gray-700 rounded-xl mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No products available yet.</p>
          <Link
            to="/product"
            className="inline-block mt-4 bg-amber-500 hover:bg-amber-600 text-gray-900 px-6 py-3 rounded-xl font-bold transition"
          >
            Browse All Products
          </Link>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="group bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10"
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.images?.[0]?.url || 'https://via.placeholder.com/300'}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {product.Stock <= 0 && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                    Out of Stock
                  </div>
                )}
                {product.Stock > 0 && product.Stock <= 5 && (
                  <div className="absolute top-3 right-3 bg-amber-500 text-gray-900 text-xs px-3 py-1 rounded-full">
                    Only {product.Stock} left
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-white font-semibold text-lg mb-2 truncate group-hover:text-amber-400 transition">
                  {product.name}
                </h3>

                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`text-sm ${
                        i < Math.floor(product.ratings || 0)
                          ? 'text-amber-400'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                  <span className="text-gray-400 text-sm ml-1">
                    ({product.numOfReviews || 0})
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-amber-400 font-bold text-xl">
                    ${product.price?.toLocaleString()}
                  </span>
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={product.Stock <= 0}
                    className="p-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 rounded-lg transition"
                  >
                    <FaShoppingCart />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* View All Button */}
      {products.length > 0 && (
        <div className="text-center mt-12">
          <Link
            to="/product"
            className="inline-block bg-amber-500 hover:bg-amber-600 text-gray-900 px-8 py-4 rounded-xl font-bold transition text-lg"
          >
            View All Products
          </Link>
        </div>
      )}
    </div>
  );
};

export default Product;
