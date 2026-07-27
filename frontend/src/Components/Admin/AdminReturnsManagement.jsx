import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../Admin/AdminLayout';
import {
  FiPackage,
  FiUser,
  FiCalendar,
  FiCheck,
  FiX,
  FiTruck,
  FiDollarSign,
  FiEye,
  FiFilter,
} from 'react-icons/fi';
import {
  getAllReturns,
  approveReturn,
  rejectReturn,
  schedulePickup,
  confirmItemReceived,
  processRefund,
  processReplacement,
} from '../../Api/returnApi';
import { toast } from 'react-toastify';

const AdminReturnsManagement = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [adminComment, setAdminComment] = useState('');

  const statuses = ['REQUESTED', 'APPROVED', 'REJECTED', 'PICKUP_SCHEDULED', 'ITEM_RECEIVED', 'REFUNDED', 'REPLACED'];

  useEffect(() => {
    fetchReturns();
  }, [statusFilter]);

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const { data } = await getAllReturns(statusFilter);
      setReturns(data.returns);
    } catch (error) {
      console.error('Error fetching returns:', error);
      toast.error('Failed to load returns');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (returnId) => {
    try {
      setActionLoading(true);
      await approveReturn(returnId, adminComment);
      toast.success('Return approved successfully');
      fetchReturns();
      setSelectedReturn(null);
      setAdminComment('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve return');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (returnId) => {
    if (!adminComment.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      setActionLoading(true);
      await rejectReturn(returnId, adminComment);
      toast.success('Return rejected');
      fetchReturns();
      setSelectedReturn(null);
      setAdminComment('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject return');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSchedulePickup = async (returnId) => {
    try {
      setActionLoading(true);
      await schedulePickup(returnId);
      toast.success('Pickup scheduled successfully');
      fetchReturns();
      setSelectedReturn(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to schedule pickup');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmReceived = async (returnId) => {
    try {
      setActionLoading(true);
      await confirmItemReceived(returnId);
      toast.success('Item receipt confirmed');
      fetchReturns();
      setSelectedReturn(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to confirm receipt');
    } finally {
      setActionLoading(false);
    }
  };

  const handleProcessRefund = async (returnId, refundAmount) => {
    try {
      setActionLoading(true);
      await processRefund(returnId, refundAmount);
      toast.success('Refund processed successfully');
      fetchReturns();
      setSelectedReturn(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process refund');
    } finally {
      setActionLoading(false);
    }
  };

  const handleProcessReplacement = async (returnId) => {
    try {
      setActionLoading(true);
      await processReplacement(returnId);
      toast.success('Replacement processed successfully');
      fetchReturns();
      setSelectedReturn(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process replacement');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      REQUESTED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      APPROVED: 'bg-green-500/20 text-green-400 border-green-500/30',
      REJECTED: 'bg-red-500/20 text-red-400 border-red-500/30',
      PICKUP_SCHEDULED: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      ITEM_RECEIVED: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      REFUNDED: 'bg-green-500/20 text-green-400 border-green-500/30',
      REPLACED: 'bg-green-500/20 text-green-400 border-green-500/30',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysLeft = (deliveredAt) => {
    const deliveredDate = new Date(deliveredAt);
    const currentDate = new Date();
    const daysSinceDelivery = Math.floor((currentDate - deliveredDate) / (1000 * 60 * 60 * 24));
    return Math.max(0, 7 - daysSinceDelivery);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading returns...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Returns Management</h1>
            <p className="text-gray-400 mt-1">{returns.length} return request(s)</p>
          </div>
          
          {/* Filter */}
          <div className="flex items-center gap-3">
            <FiFilter className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
            >
              <option value="">All Status</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Returns List */}
        {returns.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
            <FiPackage size={64} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No returns found</h3>
            <p className="text-gray-400">There are no return requests {statusFilter && `with status: ${statusFilter}`}</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {returns.map((returnItem) => (
              <div
                key={returnItem._id}
                className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors"
              >
                {/* Return Header */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                  <div className="flex gap-4">
                    <img
                      src={returnItem.orderItem.image}
                      alt={returnItem.orderItem.name}
                      className="w-24 h-24 object-cover rounded-lg border border-gray-700"
                    />
                    <div>
                      <h3 className="text-white font-semibold text-lg">{returnItem.orderItem.name}</h3>
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                        <FiUser size={14} />
                        <span>{returnItem.user?.name}</span>
                        <span>•</span>
                        <span>{returnItem.user?.email}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                        <FiPackage size={14} />
                        <span>Order #{returnItem.order?._id?.slice(-8)}</span>
                        <span>•</span>
                        <span>Qty: {returnItem.orderItem.quantity}</span>
                        <span>•</span>
                        <span className="text-amber-500 font-semibold">${returnItem.orderItem.price}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(returnItem.status)}`}>
                      {returnItem.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-amber-500 text-sm font-medium">
                      {returnItem.returnType}
                    </span>
                  </div>
                </div>

                {/* Return Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 p-4 bg-gray-900/50 rounded-lg">
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Reason</p>
                    <p className="text-white font-medium">{returnItem.reason}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Requested On</p>
                    <p className="text-white font-medium flex items-center gap-1">
                      <FiCalendar size={14} />
                      {formatDate(returnItem.requestedAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Days Left for Return</p>
                    <p className="text-white font-medium">
                      {getDaysLeft(returnItem.order?.paymentInfo?.deliveredAt)} days
                    </p>
                  </div>
                </div>

                {/* Comment */}
                {returnItem.comment && (
                  <div className="mb-4 p-3 bg-gray-900/50 rounded-lg">
                    <p className="text-gray-500 text-xs mb-1">Customer Comment</p>
                    <p className="text-gray-300 text-sm">{returnItem.comment}</p>
                  </div>
                )}

                {/* Images */}
                {returnItem.images && returnItem.images.length > 0 && (
                  <div className="mb-4">
                    <p className="text-gray-400 text-sm mb-2">Uploaded Images</p>
                    <div className="flex gap-2 flex-wrap">
                      {returnItem.images.map((img, index) => (
                        <img
                          key={index}
                          src={img.url}
                          alt={`Return ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg border border-gray-700 cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => window.open(img.url, '_blank')}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Admin Comment */}
                {returnItem.adminComment && (
                  <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <p className="text-amber-500 text-xs mb-1 font-semibold">Admin Comment</p>
                    <p className="text-gray-300 text-sm">{returnItem.adminComment}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {returnItem.status === 'REQUESTED' && (
                    <>
                      <button
                        onClick={() => setSelectedReturn({ id: returnItem._id, action: 'approve' })}
                        className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors flex items-center gap-2"
                      >
                        <FiCheck size={16} />
                        Approve
                      </button>
                      <button
                        onClick={() => setSelectedReturn({ id: returnItem._id, action: 'reject' })}
                        className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-2"
                      >
                        <FiX size={16} />
                        Reject
                      </button>
                    </>
                  )}

                  {returnItem.status === 'APPROVED' && (
                    <button
                      onClick={() => handleSchedulePickup(returnItem._id)}
                      disabled={actionLoading}
                      className="px-4 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      <FiTruck size={16} />
                      Schedule Pickup
                    </button>
                  )}

                  {returnItem.status === 'PICKUP_SCHEDULED' && (
                    <button
                      onClick={() => handleConfirmReceived(returnItem._id)}
                      disabled={actionLoading}
                      className="px-4 py-2 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg hover:bg-amber-500/30 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      <FiCheck size={16} />
                      Confirm Item Received
                    </button>
                  )}

                  {returnItem.status === 'ITEM_RECEIVED' && (
                    <>
                      {returnItem.returnType === 'Refund' ? (
                        <button
                          onClick={() => handleProcessRefund(returnItem._id, returnItem.orderItem.price * returnItem.orderItem.quantity)}
                          disabled={actionLoading}
                          className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                          <FiDollarSign size={16} />
                          Process Refund (${returnItem.orderItem.price * returnItem.orderItem.quantity})
                        </button>
                      ) : (
                        <button
                          onClick={() => handleProcessReplacement(returnItem._id)}
                          disabled={actionLoading}
                          className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                          <FiPackage size={16} />
                          Process Replacement
                        </button>
                      )}
                    </>
                  )}

                  <Link
                    to={`/admin/order/${returnItem.order?._id}`}
                    className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                  >
                    <FiEye size={16} />
                    View Order
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Modal */}
        {selectedReturn && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                {selectedReturn.action === 'approve' ? 'Approve Return' : 'Reject Return'}
              </h3>
              
              <textarea
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
                placeholder={selectedReturn.action === 'reject' ? 'Reason for rejection (required)...' : 'Optional comment...'}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 resize-none mb-4"
                rows="4"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedReturn(null);
                    setAdminComment('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => selectedReturn.action === 'approve' ? handleApprove(selectedReturn.id) : handleReject(selectedReturn.id)}
                  disabled={actionLoading}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors font-semibold disabled:opacity-50 ${
                    selectedReturn.action === 'approve'
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  {actionLoading ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReturnsManagement;
