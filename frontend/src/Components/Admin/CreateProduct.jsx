import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createProduct, clearAdminSuccess } from '../../Redux/adminSlice';
import AdminLayout from './AdminLayout';
import { FiUpload, FiX, FiSave } from 'react-icons/fi';

const categories = [
  'Electronics',
  'Clothing',
  'Footwear',
  'Grocery',
  'Books',
  'Toys',
  'Furniture',
  'Beauty',
  'Sports',
];

const CreateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, success } = useSelector((state) => state.admin);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    Stock: '',
  });

  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  useEffect(() => {
    if (success) {
      dispatch(clearAdminSuccess());
      navigate('/admin/products');
    }
  }, [success, dispatch, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagePreview((prev) => [...prev, reader.result]);
          setImages((prev) => [...prev, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const productData = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      category: formData.category,
      Stock: Number(formData.Stock),
      images: images.map((img, index) => ({
        public_id: `product_${Date.now()}_${index}`,
        url: img,
      })),
    };

    dispatch(createProduct(productData));
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Create New Product</h1>
          <p className="text-gray-400 mt-1">Add a new product to your inventory</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-6">
            {/* Basic Info */}
            <h2 className="text-lg font-semibold text-white border-b border-gray-700 pb-3">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="md:col-span-2">
                <label className="block text-gray-400 text-sm mb-2">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-gray-400 text-sm mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  required
                  rows={4}
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Price ($) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                  min="0"
                  step="0.01"
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Stock Quantity *</label>
                <input
                  type="number"
                  name="Stock"
                  value={formData.Stock}
                  onChange={handleChange}
                  placeholder="0"
                  required
                  min="0"
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Category */}
              <div className="md:col-span-2">
                <label className="block text-gray-400 text-sm mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-white border-b border-gray-700 pb-3">
              Product Images
            </h2>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-amber-500/50 transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <FiUpload className="mx-auto text-4xl text-gray-500 mb-4" />
                <p className="text-gray-400 mb-2">Click to upload images</p>
                <p className="text-gray-600 text-sm">PNG, JPG, WEBP up to 5MB</p>
              </label>
            </div>

            {/* Image Preview */}
            {imagePreview.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {imagePreview.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-700"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 text-gray-900 font-semibold rounded-lg hover:bg-amber-600 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <FiSave />
                  Create Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default CreateProduct;
