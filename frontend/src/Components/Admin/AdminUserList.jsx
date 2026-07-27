import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchAllUsers, deleteUser } from '../../Redux/userSlice';
import AdminLayout from './AdminLayout';
import { FiEdit2, FiTrash2, FiUsers, FiShield, FiUser, FiMail } from 'react-icons/fi';
import { toast } from 'react-toastify';

const AdminUserList = () => {
  const dispatch = useDispatch();
  const { users, loading, error, isDeleted } = useSelector((state) => state.user);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: '' });

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (isDeleted) {
      toast.success('User deleted successfully');
    }
  }, [error, isDeleted]);

  const handleDeleteClick = (id, name) => {
    setDeleteModal({ open: true, id, name });
  };

  const confirmDelete = () => {
    dispatch(deleteUser(deleteModal.id));
    setDeleteModal({ open: false, id: null, name: '' });
  };

  const getRoleBadge = (role) => {
    if (role === 'admin') {
      return (
        <span className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
          <FiShield size={12} />
          Admin
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">
        <FiUser size={12} />
        User
      </span>
    );
  };

  const getVerifiedBadge = (isVerified) => {
    if (isVerified) {
      return (
        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
          Verified
        </span>
      );
    }
    return (
      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
        Pending
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-gray-400 mt-1">Manage registered users</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-500/20 rounded-lg">
              <FiUsers className="text-amber-400 text-xl" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">{users.length}</p>
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <FiShield className="text-purple-400 text-xl" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Admins</p>
              <p className="text-2xl font-bold text-white">
                {users.filter((u) => u.role === 'admin').length}
              </p>
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <FiUser className="text-green-400 text-xl" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Verified Users</p>
              <p className="text-2xl font-bold text-white">
                {users.filter((u) => u.isVerified).length}
              </p>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-gray-700 border-t-amber-500 rounded-full animate-spin"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-20">
              <FiUsers className="mx-auto text-4xl text-gray-600 mb-4" />
              <p className="text-gray-400">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900 border-b border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-750 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-gray-900 font-bold">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-white font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-400">
                          <FiMail size={14} />
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                      <td className="px-6 py-4">{getVerifiedBadge(user.isVerified)}</td>
                      <td className="px-6 py-4 text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/user/edit/${user._id}`}
                            className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                          >
                            <FiEdit2 size={18} />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(user._id, user.name)}
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
            <h3 className="text-xl font-bold text-white mb-2">Delete User</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete <span className="text-white font-medium">{deleteModal.name}</span>? This action cannot be undone.
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

export default AdminUserList;
