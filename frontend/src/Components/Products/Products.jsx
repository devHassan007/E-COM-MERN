import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../Redux/productSlice';
import ProductCard from './ProductCard';
import Loader from './Loader';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const categories = [
  'Electronics',
  'Clothing',
  'Footwear',
  'Grocery',
  'Books',
  'Toys',
  'Furniture',
  'Beauty',
  'Sports',
];

const Products = () => {
  const dispatch = useDispatch();
  const { products, productCount, loading, error } = useSelector((state) => state.products);

  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 100000]);
  const [category, setCategory] = useState('');
  const [ratings, setRatings] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts({ keyword, page: currentPage, price, category, ratings }));
  }, [dispatch, keyword, currentPage, price, category, ratings]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    dispatch(fetchProducts({ keyword, page: 1, price, category, ratings }));
  };

  const clearFilters = () => {
    setKeyword('');
    setPrice([0, 100000]);
    setCategory('');
    setRatings(0);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-amber-400">
            ShopEasy
          </Link>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search products..."
                className="w-full py-3 px-5 pr-12 bg-gray-800 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-colors"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-amber-500 rounded-full hover:bg-amber-600 transition-colors"
              >
                <FiSearch className="text-gray-900" />
              </button>
            </div>
          </form>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:border-amber-500 transition-colors text-white"
          >
            <FiFilter />
            Filters
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="max-w-7xl mx-auto px-4 py-6 border-t border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Price Range */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={price[0]}
                    onChange={(e) => setPrice([Number(e.target.value), price[1]])}
                    placeholder="Min"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  />
                  <input
                    type="number"
                    value={price[1]}
                    onChange={(e) => setPrice([price[0], Number(e.target.value)])}
                    placeholder="Max"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ratings */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Minimum Rating</label>
                <select
                  value={ratings}
                  onChange={(e) => setRatings(Number(e.target.value))}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                >
                  <option value={0}>All Ratings</option>
                  <option value={4}>4★ & above</option>
                  <option value={3}>3★ & above</option>
                  <option value={2}>2★ & above</option>
                  <option value={1}>1★ & above</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  <FiX />
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our <span className="text-amber-400">Products</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover our amazing collection of products. Find exactly what you're looking for with our advanced filters.
          </p>
          <div className="mt-4 text-gray-500">
            {productCount > 0 && `Showing ${products.length} of ${productCount} products`}
          </div>
        </div>

        {/* Loading State */}
        {loading && <Loader />}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-400 text-lg">{error}</p>
            <button
              onClick={() => dispatch(fetchProducts({}))}
              className="mt-4 px-6 py-2 bg-amber-500 text-gray-900 rounded-lg hover:bg-amber-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* No Products Found */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Products Found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-amber-500 text-gray-900 font-semibold rounded-lg hover:bg-amber-600 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {!loading && products.length > 0 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-6 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-amber-500 transition-colors"
            >
              Previous
            </button>
            <span className="text-white">
              Page <span className="text-amber-400 font-bold">{currentPage}</span>
            </span>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={products.length < 5}
              className="px-6 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-amber-500 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          <p>© 2026 ShopEasy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Products;
