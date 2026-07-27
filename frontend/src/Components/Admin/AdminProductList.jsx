import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchAdminProducts, deleteProduct } from '../../Redux/adminSlice';
import AdminLayout from './AdminLayout';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiPackage } from 'react-icons/fi';

const AdminProductList = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: '' });

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const handleDeleteClick = (id, name) => {
    setDeleteModal({ open: true, id, name });
  };

  const confirmDelete = () => {
    dispatch(deleteProduct(deleteModal.id));
    setDeleteModal({ open: false, id: null, name: '' });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Products</h1>
            <p className="text-gray-400 mt-1">Manage your product inventory</p>
          </div>
          <Link
            to="/admin/product/new"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold rounded-lg transition-colors"
          >
            <FiPlus />
            Add Product
          </Link>
        </div>

        {/* Search & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500"
            />
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-500/20 rounded-lg">
              <FiPackage className="text-amber-400 text-xl" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Products</p>
              <p className="text-2xl font-bold text-white">{products.length}</p>
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <FiPackage className="text-green-400 text-xl" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">In Stock</p>
              <p className="text-2xl font-bold text-white">
                {products.filter(p => p.Stock > 0).length}
              </p>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-gray-700 border-t-amber-500 rounded-full animate-spin"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <FiPackage className="mx-auto text-4xl text-gray-600 mb-4" />
              <p className="text-gray-400">No products found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900 border-b border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-750 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={product.images?.[0]?.url || 'https://via.placeholder.com/50'}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="text-white font-medium line-clamp-1">{product.name}</p>
                            <p className="text-gray-500 text-xs">{product._id.slice(-8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full">
                          {product.category || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-amber-400 font-semibold">
                        ${product.price?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-sm rounded-full ${
                          product.Stock > 10 
                            ? 'bg-green-500/20 text-green-400' 
                            : product.Stock > 0 
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                        }`}>
                          {product.Stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        ⭐ {product.ratings?.toFixed(1) || '0.0'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/product/edit/${product._id}`}
                            className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                          >
                            <FiEdit2 size={18} />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(product._id, product.name)}
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
            <h3 className="text-xl font-bold text-white mb-2">Delete Product</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete "<span className="text-white">{deleteModal.name}</span>"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ open: false, id: null, name: '' })}
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
    </AdminLayout>
  );
};

export default AdminProductList;
