import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { getOrderDetails } from '../../Redux/orderSlice';
import { FiArrowLeft, FiTruck, FiCheckCircle, FiClock, FiRefreshCw } from 'react-icons/fi';
import ReturnRequestModal from '../Returns/ReturnRequestModal';

const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { order, loading } = useSelector((state) => state.order);
  const [selectedItemForReturn, setSelectedItemForReturn] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);

  useEffect(() => {
    dispatch(getOrderDetails(id));
  }, [dispatch, id]);

  const getStatusStep = (status) => {
    switch (status) {
      case 'Delivered':
        return 3;
      case 'Shipped':
        return 2;
      case 'Processing':
      default:
        return 1;
    }
  };

  const isReturnEligible = (order) => {
    // Check if order is delivered
    if (order.paymentInfo?.orderStatus !== 'Delivered') {
      return { eligible: false, reason: 'Only delivered orders can be returned' };
    }

    // Check if within return window (7 days)
    const deliveredDate = new Date(order.paymentInfo?.deliveredAt);
    const currentDate = new Date();
    const daysSinceDelivery = Math.floor((currentDate - deliveredDate) / (1000 * 60 * 60 * 24));
    const returnWindow = 7;

    if (daysSinceDelivery > returnWindow) {
      return { eligible: false, reason: `Return window expired (${returnWindow} days)` };
    }

    return { eligible: true, daysLeft: returnWindow - daysSinceDelivery };
  };

  const handleReturnRequest = (item) => {
    setSelectedItemForReturn(item);
    setShowReturnModal(true);
  };

  const handleReturnSuccess = () => {
    // Refresh order details
    dispatch(getOrderDetails(id));
  };

  if (loading || !order) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-700 border-t-amber-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const statusStep = getStatusStep(order.paymentInfo?.orderStatus);
  const returnEligibility = isReturnEligible(order);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-amber-400">
            ShopEasy
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/returns"
              className="flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors"
            >
              <FiRefreshCw size={18} />
              My Returns
            </Link>
            <Link
              to="/orders"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <FiArrowLeft />
              Back to Orders
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Order Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Order #{order._id?.slice(-8).toUpperCase()}
            </h1>
            <p className="text-gray-400 mt-1">
              Placed on {new Date(order.paymentInfo?.paidAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          {returnEligibility.eligible && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2">
              <p className="text-green-400 text-sm font-semibold">Return Available</p>
              <p className="text-gray-400 text-xs">{returnEligibility.daysLeft} days left</p>
            </div>
          )}
        </div>

        {/* Order Status Timeline */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-6">Order Status</h2>
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${statusStep >= 1 ? 'bg-green-500' : 'bg-gray-700'}`}>
                <FiClock className={statusStep >= 1 ? 'text-white' : 'text-gray-400'} size={20} />
              </div>
              <span className={`mt-2 text-sm ${statusStep >= 1 ? 'text-green-400' : 'text-gray-400'}`}>Processing</span>
            </div>
            <div className={`flex-1 h-1 mx-4 ${statusStep >= 2 ? 'bg-green-500' : 'bg-gray-700'}`}></div>
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${statusStep >= 2 ? 'bg-green-500' : 'bg-gray-700'}`}>
                <FiTruck className={statusStep >= 2 ? 'text-white' : 'text-gray-400'} size={20} />
              </div>
              <span className={`mt-2 text-sm ${statusStep >= 2 ? 'text-green-400' : 'text-gray-400'}`}>Shipped</span>
            </div>
            <div className={`flex-1 h-1 mx-4 ${statusStep >= 3 ? 'bg-green-500' : 'bg-gray-700'}`}></div>
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${statusStep >= 3 ? 'bg-green-500' : 'bg-gray-700'}`}>
                <FiCheckCircle className={statusStep >= 3 ? 'text-white' : 'text-gray-400'} size={20} />
              </div>
              <span className={`mt-2 text-sm ${statusStep >= 3 ? 'text-green-400' : 'text-gray-400'}`}>Delivered</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.orderItems?.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 pb-4 border-b border-gray-700 last:border-0 last:pb-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <Link
                        to={`/product/${item.product}`}
                        className="text-white font-medium hover:text-amber-400 transition-colors"
                      >
                        {item.name}
                      </Link>
                      <p className="text-gray-400 text-sm mt-1">
                        ${item.price?.toFixed(2)} × {item.quantity}
                      </p>
                      {returnEligibility.eligible && (
                        <button
                          onClick={() => handleReturnRequest(item)}
                          className="mt-2 flex items-center gap-2 text-amber-400 text-sm hover:text-amber-300 transition-colors"
                        >
                          <FiRefreshCw size={14} />
                          Request Return
                        </button>
                      )}
                    </div>
                    <p className="text-amber-400 font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Payment Info */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Payment Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">${order.paymentInfo?.itemsPrice?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax</span>
                  <span className="text-white">${order.paymentInfo?.taxPrice?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-white">${order.paymentInfo?.shippingPrice?.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-700 pt-3 flex justify-between">
                  <span className="font-semibold text-white">Total</span>
                  <span className="font-bold text-amber-400">${order.paymentInfo?.totalPrice?.toFixed(2)}</span>
                </div>
                <div className="pt-2 flex justify-between text-gray-400">
                  <span>Payment Method</span>
                  <span className="text-white">{order.paymentInfo?.method}</span>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Shipping Address</h2>
              <div className="text-gray-400 text-sm space-y-1">
                <p className="text-white font-medium">{order.user?.name}</p>
                <p>{order.shippingInfo?.address}</p>
                <p>{order.shippingInfo?.city}, {order.shippingInfo?.state} {order.shippingInfo?.pinCode}</p>
                <p>{order.shippingInfo?.country}</p>
                <p className="pt-2">Phone: {order.shippingInfo?.phoneNo}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Return Request Modal */}
      {showReturnModal && selectedItemForReturn && (
        <ReturnRequestModal
          order={order}
          orderItem={selectedItemForReturn}
          onClose={() => {
            setShowReturnModal(false);
            setSelectedItemForReturn(null);
          }}
          onSuccess={handleReturnSuccess}
        />
      )}
    </div>
  );
};

export default OrderDetails;
