import React, { useState, useEffect } from 'react';
import { getMyReturns } from '../../Api/returnApi';
import { toast } from 'react-toastify';
import {
  FiPackage,
  FiCalendar,
  FiTruck,
  FiCheck,
  FiX,
  FiDollarSign,
  FiAlertCircle,
} from 'react-icons/fi';

const MyReturns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyReturns();
  }, []);

  const fetchMyReturns = async () => {
    try {
      setLoading(true);
      const { data } = await getMyReturns();
      setReturns(data.returns);
    } catch (error) {
      console.error('Error fetching returns:', error);
      toast.error('Failed to load your returns');
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      REQUESTED: {
        icon: FiAlertCircle,
        color: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
        label: 'Requested',
        description: 'Your return request is under review',
      },
      APPROVED: {
        icon: FiCheck,
        color: 'text-green-400 bg-green-500/20 border-green-500/30',
        label: 'Approved',
        description: 'Your return has been approved',
      },
      REJECTED: {
        icon: FiX,
        color: 'text-red-400 bg-red-500/20 border-red-500/30',
        label: 'Rejected',
        description: 'Your return request was rejected',
      },
      PICKUP_SCHEDULED: {
        icon: FiTruck,
        color: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
        label: 'Pickup Scheduled',
        description: 'Pickup has been scheduled for your item',
      },
      ITEM_RECEIVED: {
        icon: FiPackage,
        color: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
        label: 'Item Received',
        description: 'We have received your returned item',
      },
      REFUNDED: {
        icon: FiDollarSign,
        color: 'text-green-400 bg-green-500/20 border-green-500/30',
        label: 'Refunded',
        description: 'Your refund has been processed',
      },
      REPLACED: {
        icon: FiPackage,
        color: 'text-green-400 bg-green-500/20 border-green-500/30',
        label: 'Replaced',
        description: 'Your replacement order has been created',
      },
    };
    return statusMap[status] || statusMap.REQUESTED;
  };

  const getStatusSteps = (currentStatus, returnType) => {
    const steps = [
      { key: 'REQUESTED', label: 'Requested' },
      { key: 'APPROVED', label: 'Approved' },
      { key: 'PICKUP_SCHEDULED', label: 'Pickup' },
      { key: 'ITEM_RECEIVED', label: 'Received' },
      { key: returnType === 'Refund' ? 'REFUNDED' : 'REPLACED', label: returnType === 'Refund' ? 'Refunded' : 'Replaced' },
    ];

    const statusOrder = steps.map(s => s.key);
    const currentIndex = statusOrder.indexOf(currentStatus);

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading your returns...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">My Returns</h1>
          <p className="text-gray-400 mt-1">Track your return requests and refunds</p>
        </div>

        {/* Returns List */}
        {returns.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
            <FiPackage size={64} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No returns yet</h3>
            <p className="text-gray-400">You haven't requested any returns</p>
          </div>
        ) : (
          <div className="space-y-6">
            {returns.map((returnItem) => {
              const statusInfo = getStatusInfo(returnItem.status);
              const StatusIcon = statusInfo.icon;
              const steps = getStatusSteps(returnItem.status, returnItem.returnType);

              return (
                <div
                  key={returnItem._id}
                  className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden"
                >
                  {/* Status Bar */}
                  <div className={`px-6 py-4 border-b border-gray-700 ${statusInfo.color.split(' ')[1]}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <StatusIcon size={24} />
                        <div>
                          <p className="font-semibold">{statusInfo.label}</p>
                          <p className="text-sm opacity-75">{statusInfo.description}</p>
                        </div>
                      </div>
                      <span className="text-sm opacity-75">Return #{returnItem._id.slice(-8)}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-6">
                    {/* Product Info */}
                    <div className="flex gap-4">
                      <img
                        src={returnItem.orderItem.image}
                        alt={returnItem.orderItem.name}
                        className="w-24 h-24 object-cover rounded-lg border border-gray-700"
                      />
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg">{returnItem.orderItem.name}</h3>
                        <p className="text-gray-400 text-sm mt-1">Quantity: {returnItem.orderItem.quantity}</p>
                        <p className="text-amber-500 font-semibold mt-1">${returnItem.orderItem.price}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusInfo.color}`}>
                            {returnItem.returnType}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Tracker */}
                    <div className="bg-gray-900/50 rounded-lg p-6">
                      <h4 className="text-white font-semibold mb-4">Return Progress</h4>
                      <div className="flex items-center justify-between relative">
                        {/* Progress Line */}
                        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-700">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-500"
                            style={{
                              width: `${(steps.filter(s => s.completed).length / steps.length) * 100}%`,
                            }}
                          />
                        </div>

                        {/* Steps */}
                        {steps.map((step, index) => (
                          <div key={step.key} className="flex flex-col items-center z-10 relative">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                                step.completed
                                  ? 'bg-amber-500 border-amber-500'
                                  : 'bg-gray-800 border-gray-700'
                              }`}
                            >
                              {step.completed && <FiCheck className="text-white" size={18} />}
                            </div>
                            <p
                              className={`text-xs mt-2 text-center ${
                                step.completed ? 'text-white font-semibold' : 'text-gray-500'
                              }`}
                            >
                              {step.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-900/50 rounded-lg p-4">
                        <p className="text-gray-500 text-xs mb-1">Return Reason</p>
                        <p className="text-white font-medium">{returnItem.reason}</p>
                      </div>
                      <div className="bg-gray-900/50 rounded-lg p-4">
                        <p className="text-gray-500 text-xs mb-1">Requested On</p>
                        <p className="text-white font-medium flex items-center gap-1">
                          <FiCalendar size={14} />
                          {formatDate(returnItem.requestedAt)}
                        </p>
                      </div>
                      <div className="bg-gray-900/50 rounded-lg p-4">
                        <p className="text-gray-500 text-xs mb-1">Order ID</p>
                        <p className="text-white font-medium">#{returnItem.order?._id?.slice(-8)}</p>
                      </div>
                    </div>

                    {/* Comments */}
                    {returnItem.comment && (
                      <div className="bg-gray-900/50 rounded-lg p-4">
                        <p className="text-gray-500 text-xs mb-2">Your Comment</p>
                        <p className="text-gray-300 text-sm">{returnItem.comment}</p>
                      </div>
                    )}

                    {returnItem.adminComment && (
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                        <p className="text-amber-500 text-xs mb-2 font-semibold">Admin Response</p>
                        <p className="text-gray-300 text-sm">{returnItem.adminComment}</p>
                      </div>
                    )}

                    {/* Refund Info */}
                    {returnItem.status === 'REFUNDED' && returnItem.refundAmount && (
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-center gap-3">
                        <FiDollarSign className="text-green-400" size={24} />
                        <div>
                          <p className="text-green-400 font-semibold">Refund Processed</p>
                          <p className="text-gray-300 text-sm mt-1">
                            ${returnItem.refundAmount} has been refunded to your original payment method
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReturns;
