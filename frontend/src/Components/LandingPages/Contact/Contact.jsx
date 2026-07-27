import React from 'react';
import Navbar from '../Navbar';
import bgContact from '../../../assets/help.jpg';

import { Mail, Phone } from 'lucide-react';

const Contact = () => {
  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center text-white overflow-x-hidden"
      style={{
        backgroundImage: `url(${bgContact})`,
        backgroundAttachment: 'fixed',
      }}
    >
      <Navbar />

      {/* Header Card */}
      <div className="pt-32 sm:pt-36 px-4">
        <div className="relative bg-gray-900 text-white rounded-xl py-6 px-6 sm:px-10 md:px-12 w-full max-w-4xl mx-auto shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center">
            <p className="text-lg md:text-xl font-semibold">
              Get in Touch <br /> We'd love to hear from you!
            </p>
            <div className="flex justify-end items-center mt-4 md:mt-0 relative">
              <a
                href="mailto:support@shopeasy.com"
                className="relative bg-white text-gray-600 px-6 py-2 rounded-md hover:bg-gray-300 transition duration-300 font-semibold shadow-md overflow-hidden"
              >
                <span className="relative z-10 inline-block text-center w-full text-sm md:text-xl">Email Us</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Contact Info Section */}
      <div className="mt-auto">
        <div className="bg-gray-900 px-4 py-10 sm:px-6 md:px-12 lg:px-20 lg:py-16 overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 text-white">

            {/* About */}
            <div>
              <p className="text-xl sm:text-2xl font-bold leading-snug text-white">
                CONNECT.<br />SUPPORT.<br />CARE.
              </p>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3">Contact Us</h3>
              <ul className="space-y-2 text-sm sm:text-base">
                <li className="flex items-center gap-2"><Phone size={16} /> +92 123456789</li>
                <li className="flex items-center gap-2"><Mail size={16} /> support@shopeasy.com</li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3">Newsletter</h3>
              <div className="bg-white p-2 rounded-md flex items-center justify-between">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="bg-transparent text-gray-900 outline-none w-full px-2 text-sm"
                />
                <button className="text-gray-900 font-bold text-lg">📧</button>
              </div>
              <p className="text-xs sm:text-sm mt-2 text-white">
                Subscribe to our Newsletter. No spam, promise!
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
