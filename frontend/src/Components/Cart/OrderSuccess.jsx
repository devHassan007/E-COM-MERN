import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiShoppingBag } from 'react-icons/fi';

const OrderSuccess = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Success Icon */}
        <div className="relative inline-block mb-8">
          <div className="w-32 h-32 bg-green-500/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <FiCheckCircle className="text-6xl text-green-500" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-4">Order Placed Successfully!</h1>
        <p className="text-gray-400 mb-8">
          Thank you for your purchase. Your order has been placed and will be processed soon.
          You will receive a confirmation email shortly.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            to="/orders"
            className="w-full flex items-center justify-center gap-2 py-4 bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold rounded-xl transition-colors"
          >
            <FiPackage />
            View My Orders
          </Link>
          <Link
            to="/product"
            className="w-full flex items-center justify-center gap-2 py-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors"
          >
            <FiShoppingBag />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
