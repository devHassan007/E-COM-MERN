import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import bgImage from '../../../assets/background-image.jpg';
import Navbar from '../Navbar';
import { useSelector } from 'react-redux';

const Home = () => {
  const [navBg, setNavBg] = useState("bg-transparent");
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/product');
    } else {
      navigate('/login');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setNavBg("bg-black bg-opacity-80 shadow-md");
      } else {
        setNavBg("bg-transparent");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="bg-gray-950">
      {/* Dynamic Navbar based on scroll */}
      <Navbar navBg={navBg} navLinkColor="text-black" />

      <Helmet>
        <title>ShopEasy | Best Deals Online</title>
      </Helmet>

      {/* Hero Section */}
      <div
        className="min-h-screen bg-cover bg-center flex items-center justify-center relative"
        style={{ backgroundImage: `url(${bgImage})` }}
        id="home"
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-10 max-w-2xl text-center shadow-xl z-10">
          <h1 className="text-5xl font-bold text-amber-400 mb-4">
            Welcome to ShopEasy
          </h1>
          <p className="text-lg text-gray-200 mb-8">
            Discover the best products at unbeatable prices. <br />
            Shop now and experience convenience like never before.
          </p>

          <button
            onClick={handleGetStarted}
            className="bg-amber-500 hover:bg-amber-600 text-gray-900 px-8 py-4 rounded-xl font-bold transition duration-300 text-lg"
          >
            {isAuthenticated ? 'Shop Now' : 'Get Started'}
          </button>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Why Choose <span className="text-amber-400">ShopEasy</span>?
            </h2>
            <p className="text-gray-400 mt-2">We deliver excellence in every order</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gray-800 rounded-2xl border border-gray-700 hover:border-amber-500/50 transition">
              <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Quality Products</h3>
              <p className="text-gray-400">We ensure all products meet the highest quality standards</p>
            </div>
            
            <div className="text-center p-8 bg-gray-800 rounded-2xl border border-gray-700 hover:border-amber-500/50 transition">
              <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Fast Delivery</h3>
              <p className="text-gray-400">Get your orders delivered quickly to your doorstep</p>
            </div>
            
            <div className="text-center p-8 bg-gray-800 rounded-2xl border border-gray-700 hover:border-amber-500/50 transition">
              <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Secure Payment</h3>
              <p className="text-gray-400">Your transactions are safe and encrypted</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
