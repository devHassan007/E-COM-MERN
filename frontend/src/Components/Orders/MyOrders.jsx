import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyOrders } from '../../Redux/orderSlice';
import { FiPackage, FiEye, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';

const MyOrders = () => {
  const dispatch = useDispatch();
  const { myOrders, loading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-500/20 text-green-400';
      case 'Shipped':
        return 'bg-blue-500/20 text-blue-400';
      case 'Processing':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-amber-400">
            ShopEasy
          </Link>
          <Link
            to="/product"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <FiArrowLeft />
            Back to Shop
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">My Orders</h1>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-gray-700 border-t-amber-500 rounded-full animate-spin"></div>
          </div>
        ) : myOrders.length === 0 ? (
          <div className="text-center py-20">
            <FiPackage className="mx-auto text-6xl text-gray-600 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No Orders Yet</h2>
            <p className="text-gray-400 mb-6">You haven't placed any orders yet.</p>
            <Link
              to="/product"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold rounded-lg transition-colors"
            >
              <FiShoppingBag />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900 border-b border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {myOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-750 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-white font-mono text-sm">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {new Date(order.paymentInfo?.paidAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {order.orderItems?.length} items
                      </td>
                      <td className="px-6 py-4 text-amber-400 font-semibold">
                        ${order.paymentInfo?.totalPrice?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(order.paymentInfo?.orderStatus)}`}>
                          {order.paymentInfo?.orderStatus || 'Processing'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/order/${order._id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-colors"
                        >
                          <FiEye size={16} />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyOrders;
