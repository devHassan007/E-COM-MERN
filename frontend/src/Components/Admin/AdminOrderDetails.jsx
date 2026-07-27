import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { getOrderDetails, updateOrderStatus } from '../../Redux/orderSlice';
import AdminLayout from './AdminLayout';
import { FiArrowLeft, FiTruck, FiCheckCircle, FiClock } from 'react-icons/fi';

const AdminOrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { order, loading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getOrderDetails(id));
  }, [dispatch, id]);

  const handleStatusUpdate = (newStatus) => {
    dispatch(updateOrderStatus({ id, status: newStatus }));
  };

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

  if (loading || !order) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-amber-500 rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  const statusStep = getStatusStep(order.paymentInfo?.orderStatus);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link to="/admin/orders" className="flex items-center gap-2 text-gray-400 hover:text-white mb-2">
              <FiArrowLeft />
              Back to Orders
            </Link>
            <h1 className="text-2xl font-bold text-white">
              Order #{order._id?.slice(-8).toUpperCase()}
            </h1>
            <p className="text-gray-400">
              Placed on {new Date(order.paymentInfo?.paidAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          
          {/* Status Actions */}
          <div className="flex gap-3">
            {order.paymentInfo?.orderStatus !== 'Shipped' && order.paymentInfo?.orderStatus !== 'Delivered' && (
              <button
                onClick={() => handleStatusUpdate('Shipped')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                <FiTruck />
                Mark Shipped
              </button>
            )}
            {order.paymentInfo?.orderStatus !== 'Delivered' && (
              <button
                onClick={() => handleStatusUpdate('Delivered')}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                <FiCheckCircle />
                Mark Delivered
              </button>
            )}
          </div>
        </div>

        {/* Order Status Timeline */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer & Shipping Info */}
          <div className="space-y-6">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Customer</h2>
              <div className="space-y-2 text-sm">
                <p className="text-white font-medium">{order.user?.name}</p>
                <p className="text-gray-400">{order.user?.email}</p>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Shipping Address</h2>
              <div className="text-gray-400 text-sm space-y-1">
                <p>{order.shippingInfo?.address}</p>
                <p>{order.shippingInfo?.city}, {order.shippingInfo?.state} {order.shippingInfo?.pinCode}</p>
                <p>{order.shippingInfo?.country}</p>
                <p className="pt-2">Phone: {order.shippingInfo?.phoneNo}</p>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Payment</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Method</span>
                  <span className="text-white">{order.paymentInfo?.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className="text-green-400">{order.paymentInfo?.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Transaction ID</span>
                  <span className="text-white font-mono text-xs">{order.paymentInfo?.id}</span>
                </div>
              </div>
            </div>
          </div>

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
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="text-white font-medium">{item.name}</p>
                      <p className="text-gray-400 text-sm">
                        ${item.price?.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-amber-400 font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-6 pt-6 border-t border-gray-700 space-y-3">
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
                <div className="flex justify-between pt-3 border-t border-gray-700">
                  <span className="text-lg font-semibold text-white">Total</span>
                  <span className="text-xl font-bold text-amber-400">${order.paymentInfo?.totalPrice?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrderDetails;
