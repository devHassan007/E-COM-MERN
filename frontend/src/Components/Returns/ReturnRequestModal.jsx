import React, { useState } from 'react';
import { FiX, FiUpload, FiAlertCircle, FiPackage } from 'react-icons/fi';
import { createReturnRequest } from '../../Api/returnApi';
import { toast } from 'react-toastify';

const ReturnRequestModal = ({ order, orderItem, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    returnType: 'Refund',
    reason: '',
    comment: '',
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState([]);

  const reasons = [
    'Damaged Product',
    'Wrong Item Received',
    'Size/Fit Issue',
    'Not as Described',
    'Quality Issue',
    'Other',
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + formData.images.length > 5) {
      toast.error('You can upload maximum 5 images');
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, { url: reader.result }],
        }));
        setImagePreview((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.reason) {
      toast.error('Please select a return reason');
      return;
    }

    if (['Damaged Product', 'Wrong Item Received'].includes(formData.reason) && formData.images.length === 0) {
      toast.error('Please upload at least one image for this reason');
      return;
    }

    try {
      setLoading(true);
      await createReturnRequest({
        orderId: order._id,
        productId: orderItem.product,
        ...formData,
      });

      toast.success('Return request submitted successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Return request error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit return request');
    } finally {
      setLoading(false);
    }
  };

  // Calculate days left for return
  const deliveredDate = new Date(order.paymentInfo?.deliveredAt);
  const currentDate = new Date();
  const daysSinceDelivery = Math.floor((currentDate - deliveredDate) / (1000 * 60 * 60 * 24));
  const daysLeft = 7 - daysSinceDelivery;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <FiPackage className="text-amber-500" />
              Request Return
            </h2>
            <p className="text-gray-400 text-sm mt-1">{orderItem.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Return Window Alert */}
        {daysLeft > 0 && (
          <div className="mx-6 mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-3">
            <FiAlertCircle className="text-amber-500 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-amber-400 font-semibold">Return Window</p>
              <p className="text-gray-300 text-sm mt-1">
                You have {daysLeft} day{daysLeft !== 1 ? 's' : ''} left to request a return for this item
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Info */}
          <div className="flex items-start gap-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <img
              src={orderItem.image}
              alt={orderItem.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="text-white font-semibold">{orderItem.name}</h3>
              <p className="text-gray-400 text-sm mt-1">Quantity: {orderItem.quantity}</p>
              <p className="text-amber-500 font-semibold mt-1">${orderItem.price}</p>
            </div>
          </div>

          {/* Return Type */}
          <div>
            <label className="block text-gray-300 font-medium mb-3">Return Type *</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, returnType: 'Refund' })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.returnType === 'Refund'
                    ? 'border-amber-500 bg-amber-500/10'
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                }`}
              >
                <p className="text-white font-semibold">Refund</p>
                <p className="text-gray-400 text-sm mt-1">Get your money back</p>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, returnType: 'Replacement' })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.returnType === 'Replacement'
                    ? 'border-amber-500 bg-amber-500/10'
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                }`}
              >
                <p className="text-white font-semibold">Replacement</p>
                <p className="text-gray-400 text-sm mt-1">Get a new product</p>
              </button>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">Reason for Return *</label>
            <select
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              required
            >
              <option value="">Select a reason</option>
              {reasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">Additional Comments</label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              placeholder="Provide more details about why you're returning this product..."
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 resize-none"
              rows="4"
              maxLength="500"
            />
            <p className="text-gray-500 text-xs mt-1">{formData.comment.length}/500 characters</p>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">
              Upload Images {['Damaged Product', 'Wrong Item Received'].includes(formData.reason) && <span className="text-amber-500">*</span>}
            </label>
            <p className="text-gray-500 text-sm mb-3">Upload up to 5 images (Required for damaged/wrong items)</p>
            
            <div className="grid grid-cols-5 gap-3">
              {imagePreview.map((img, index) => (
                <div key={index} className="relative group">
                  <img src={img} alt={`Preview ${index + 1}`} className="w-full h-20 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ))}
              
              {formData.images.length < 5 && (
                <label className="flex items-center justify-center w-full h-20 border-2 border-dashed border-gray-700 rounded-lg hover:border-amber-500 transition-colors cursor-pointer group">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <FiUpload className="text-gray-500 group-hover:text-amber-500" size={24} />
                </label>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-gray-900 rounded-xl hover:shadow-lg hover:shadow-amber-500/30 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Return Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReturnRequestModal;
