import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getUserDetails, updateUser, resetUserState, clearUserErrors } from '../../Redux/userSlice';
import AdminLayout from './AdminLayout';
import { FiArrowLeft, FiSave, FiUser, FiMail, FiShield } from 'react-icons/fi';
import { toast } from 'react-toastify';

const EditUser = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error, isUpdated } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
  });

  useEffect(() => {
    dispatch(getUserDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'user',
      });
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearUserErrors());
    }
    if (isUpdated) {
      toast.success('User updated successfully');
      dispatch(resetUserState());
      navigate('/admin/users');
    }
  }, [error, isUpdated, dispatch, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUser({ id, userData: formData }));
  };

  if (loading && !user) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-amber-500 rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <Link
            to="/admin/users"
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <FiArrowLeft />
            Back to Users
          </Link>
          <h1 className="text-2xl font-bold text-white">Edit User</h1>
          <p className="text-gray-400 mt-1">Update user information and role</p>
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-4 bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-gray-900 font-bold text-2xl">
            {formData.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">{formData.name}</h2>
            <p className="text-gray-400">{formData.email}</p>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="flex items-center gap-2 text-gray-300 mb-2">
              <FiUser />
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500 transition-colors"
              placeholder="Enter user name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center gap-2 text-gray-300 mb-2">
              <FiMail />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500 transition-colors"
              placeholder="Enter email address"
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className="flex items-center gap-2 text-gray-300 mb-2">
              <FiShield />
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* User Info */}
          {user && (
            <div className="pt-4 border-t border-gray-700">
              <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-3">User Info</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">User ID</span>
                  <p className="text-gray-300 font-mono text-xs mt-1">{user._id}</p>
                </div>
                <div>
                  <span className="text-gray-500">Joined</span>
                  <p className="text-gray-300 mt-1">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Email Verified</span>
                  <p className={`mt-1 ${user.isVerified ? 'text-green-400' : 'text-yellow-400'}`}>
                    {user.isVerified ? 'Yes' : 'No'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Current Role</span>
                  <p className={`mt-1 ${user.role === 'admin' ? 'text-purple-400' : 'text-gray-300'}`}>
                    {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <Link
              to="/admin/users"
              className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 text-gray-900 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <FiSave />
                  Update User
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditUser;
