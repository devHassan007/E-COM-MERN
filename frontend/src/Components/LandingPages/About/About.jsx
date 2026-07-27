import React from 'react';
import Navbar from "../Navbar";
import bgAbout from '../../../assets/about-background.jpg';

const About = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center text-white relative"
      style={{ backgroundImage: `url(${bgAbout})` }}
    >
      <Navbar />

      {/* Main Content Area */}
      <main className="relative pt-36 px-8">
        {/* Right Text Side shifted to start after half screen */}
        <div className="md:absolute md:left-1/2 md:w-1/2 p-4">
          <h1 className="text-4xl font-bold mb-4 text-center">
            Welcome to <span className="text-blue-400">ShopEasy</span>
          </h1>
          <h2 className="text-2xl mb-4 text-center">
            Smart Shopping, <span className="text-blue-300">Simplified</span>
          </h2>
          <p className="mb-4 text-lg text-center">
            ShopEasy is a modern e-commerce platform designed to make your online shopping experience seamless, enjoyable, and secure.
          </p>

          {/* Key Features */}
          <ul className="space-y-2 px-4">
            <li className="flex items-center p-2">
              <span className="text-blue-400 text-xl mr-2">🛒</span>
              Easy-to-use cart with real-time updates and secure checkout.
            </li>
            <li className="flex items-center p-2">
              <span className="text-blue-400 text-xl mr-2">🚚</span>
              Fast delivery and order tracking — from warehouse to your doorstep.
            </li>
            <li className="flex items-center p-2">
              <span className="text-blue-400 text-xl mr-2">💳</span>
              Multiple payment options with top-tier security.
            </li>
            <li className="flex items-center p-2">
              <span className="text-blue-400 text-xl mr-2">⭐</span>
              Curated, high-quality products at unbeatable prices.
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default About;
