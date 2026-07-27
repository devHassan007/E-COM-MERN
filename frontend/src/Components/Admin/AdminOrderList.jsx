import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchAllOrders, updateOrderStatus, deleteOrder } from '../../Redux/orderSlice';
import AdminLayout from './AdminLayout';
import { FiEye, FiTrash2, FiPackage, FiDollarSign, FiTruck } from 'react-icons/fi';

const AdminOrderList = () => {
  const dispatch = useDispatch();
  const { orders, totalAmount, loading } = useSelector((state) => state.order);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [statusModal, setStatusModal] = useState({ open: false, id: null, currentStatus: '' });

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleDeleteClick = (id) => {
    setDeleteModal({ open: true, id });
  };

  const confirmDelete = () => {
    dispatch(deleteOrder(deleteModal.id));
    setDeleteModal({ open: false, id: null });
  };

  const handleStatusClick = (id, currentStatus) => {
    setStatusModal({ open: true, id, currentStatus });
  };

  const updateStatus = (newStatus) => {
    dispatch(updateOrderStatus({ id: statusModal.id, status: newStatus }));
    setStatusModal({ open: false, id: null, currentStatus: '' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-500/20 text-green-400';
      case 'Shipped':
        return 'bg-blue-500/20 text-blue-400';
      case 'Processing':
      default:
        return 'bg-yellow-500/20 text-yellow-400';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <p className="text-gray-400 mt-1">Manage customer orders</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-500/20 rounded-lg">
              <FiPackage className="text-amber-400 text-xl" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-white">{orders.length}</p>
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <FiDollarSign className="text-green-400 text-xl" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-white">${totalAmount?.toFixed(2)}</p>
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <FiTruck className="text-blue-400 text-xl" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Shipped</p>
              <p className="text-2xl font-bold text-white">
                {orders.filter(o => o.paymentInfo?.orderStatus === 'Shipped').length}
              </p>
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center gap-4">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <FiPackage className="text-yellow-400 text-xl" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Processing</p>
              <p className="text-2xl font-bold text-white">
                {orders.filter(o => !o.paymentInfo?.orderStatus || o.paymentInfo?.orderStatus === 'Processing').length}
              </p>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-gray-700 border-t-amber-500 rounded-full animate-spin"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <FiPackage className="mx-auto text-4xl text-gray-600 mb-4" />
              <p className="text-gray-400">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900 border-b border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Customer
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
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-750 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-white font-mono text-sm">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white">{order.user?.name || 'N/A'}</p>
                        <p className="text-gray-500 text-xs">{order.user?.email}</p>
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
                        <button
                          onClick={() => handleStatusClick(order._id, order.paymentInfo?.orderStatus || 'Processing')}
                          className={`px-3 py-1 text-sm rounded-full cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(order.paymentInfo?.orderStatus)}`}
                        >
                          {order.paymentInfo?.orderStatus || 'Processing'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/order/${order._id}`}
                            className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                          >
                            <FiEye size={18} />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(order._id)}
                            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-2">Delete Order</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete this order? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ open: false, id: null })}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {statusModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Update Order Status</h3>
            <p className="text-gray-400 mb-4">
              Current status: <span className="text-white font-medium">{statusModal.currentStatus}</span>
            </p>
            <div className="space-y-3">
              {statusModal.currentStatus !== 'Shipped' && statusModal.currentStatus !== 'Delivered' && (
                <button
                  onClick={() => updateStatus('Shipped')}
                  className="w-full px-4 py-3 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  Mark as Shipped
                </button>
              )}
              {statusModal.currentStatus !== 'Delivered' && (
                <button
                  onClick={() => updateStatus('Delivered')}
                  className="w-full px-4 py-3 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                >
                  Mark as Delivered
                </button>
              )}
              <button
                onClick={() => setStatusModal({ open: false, id: null, currentStatus: '' })}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrderList;
