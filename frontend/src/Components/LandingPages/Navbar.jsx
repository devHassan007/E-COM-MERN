import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaShoppingCart, FaPhoneAlt, FaUser, FaSignOutAlt, FaBox, FaKey, FaTachometerAlt } from 'react-icons/fa';
import { logoutUser } from '../../Redux/authSlice';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { cartItems } = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Handle scroll to change navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    setIsDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/contact', label: 'Contact' },
    { to: '/product', label: 'Products' },
    { to: '/about', label: 'About' },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
        isScrolled ? 'bg-gray-900 shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex justify-between items-center py-6 px-6">
        {/* Left: Logo Text */}
        <div>
          <Link to="/" className="text-2xl font-extrabold tracking-wide text-white hover:text-gray-600">
            ShopEasy
          </Link>
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:flex space-x-12 text-lg text-white">
          {navLinks.map((link, index) => (
            <Link key={index} to={link.to} className="hover:text-gray-200 transition">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Icons */}
        <div className="hidden md:flex items-center space-x-4 text-white">
          <Link to="/cart" className="relative">
            <FaShoppingCart className="text-xl hover:text-gray-200 cursor-pointer transition" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </Link>
          
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 hover:text-amber-400 transition"
              >
                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-gray-900 font-bold">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-xl shadow-xl py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-700">
                    <p className="text-white font-medium truncate">{user?.name}</p>
                    <p className="text-gray-400 text-sm truncate">{user?.email}</p>
                  </div>
                  
                  <Link
                    to="/orders"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 transition"
                  >
                    <FaBox className="text-amber-400" />
                    <span>My Orders</span>
                  </Link>
                  
                  <Link
                    to="/update-password"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 transition"
                  >
                    <FaKey className="text-amber-400" />
                    <span>Change Password</span>
                  </Link>
                  
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 transition"
                    >
                      <FaTachometerAlt className="text-amber-400" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  
                  <div className="border-t border-gray-700 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2 w-full text-left hover:bg-gray-700 text-red-400 transition"
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="hover:text-gray-200 transition">
              <FaUser className="text-xl cursor-pointer" />
            </Link>
          )}
          <FaPhoneAlt className="text-xl hover:text-gray-200 cursor-pointer transition" />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Items */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 text-white px-6 pb-4">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-amber-400 transition"
              >
                {link.label}
              </Link>
            ))}
            
            {isAuthenticated && (
              <>
                <Link
                  to="/orders"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 hover:text-amber-400 transition"
                >
                  <FaBox /> My Orders
                </Link>
                <Link
                  to="/update-password"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 hover:text-amber-400 transition"
                >
                  <FaKey /> Change Password
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 hover:text-amber-400 transition"
                  >
                    <FaTachometerAlt /> Admin Dashboard
                  </Link>
                )}
              </>
            )}
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-700">
              <div className="flex space-x-4">
                <Link to="/cart" className="relative" onClick={() => setIsMenuOpen(false)}>
                  <FaShoppingCart className="text-xl hover:text-amber-400 cursor-pointer transition" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                    </span>
                  )}
                </Link>
                <FaPhoneAlt className="text-xl hover:text-amber-400 cursor-pointer transition" />
              </div>
              
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-red-400 hover:text-red-300 transition"
                >
                  <FaSignOutAlt /> Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 bg-amber-500 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-amber-400 transition"
                >
                  <FaUser /> Login
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
