import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updatePassword } from '../../Api/authApi';
import { FiLock, FiEye, FiEyeOff, FiArrowLeft, FiKey } from 'react-icons/fi';

const UpdatePassword = () => {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('All fields are required');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New and Confirm Password do not match');
      return;
    }

    if (oldPassword === newPassword) {
      toast.error('New password must be different from old password');
      return;
    }

    setLoading(true);
    try {
      await updatePassword({ oldPassword, newPassword, confirmPassword });
      toast.success('Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        navigate('/account');
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 px-4">
      <ToastContainer position="top-right" />
      <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiKey className="text-3xl text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Change Password</h2>
          <p className="text-gray-400 mt-2">Keep your account secure with a strong password</p>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-5">
          {/* Old Password */}
          <div>
            <label className="block text-gray-300 mb-2">
              <FiLock className="inline mr-2" />
              Current Password
            </label>
            <div className="relative">
              <input
                type={showOldPassword ? 'text' : 'password'}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter your current password"
                className="w-full p-4 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors pr-12"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showOldPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-gray-300 mb-2">
              <FiLock className="inline mr-2" />
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full p-4 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors pr-12"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showNewPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-gray-300 mb-2">
              <FiLock className="inline mr-2" />
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full p-4 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          {/* Password Strength Indicator */}
          <div className="space-y-2">
            <div className="flex gap-1">
              <div className={`h-1 flex-1 rounded ${newPassword.length >= 1 ? 'bg-red-500' : 'bg-gray-700'}`}></div>
              <div className={`h-1 flex-1 rounded ${newPassword.length >= 4 ? 'bg-yellow-500' : 'bg-gray-700'}`}></div>
              <div className={`h-1 flex-1 rounded ${newPassword.length >= 6 ? 'bg-green-500' : 'bg-gray-700'}`}></div>
              <div className={`h-1 flex-1 rounded ${newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-700'}`}></div>
            </div>
            <p className="text-xs text-gray-500">
              Password must be at least 6 characters
            </p>
          </div>

          {/* Match Indicator */}
          {confirmPassword && (
            <div className={`flex items-center gap-2 text-sm ${newPassword === confirmPassword ? 'text-green-400' : 'text-red-400'}`}>
              <div className={`w-2 h-2 rounded-full ${newPassword === confirmPassword ? 'bg-green-400' : 'bg-red-400'}`}></div>
              {newPassword === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-gray-900 font-bold rounded-xl transition-colors"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                Updating...
              </>
            ) : (
              'Update Password'
            )}
          </button>
        </form>

        <Link
          to="/account"
          className="flex items-center justify-center gap-2 mt-6 text-gray-400 hover:text-white transition-colors"
        >
          <FiArrowLeft />
          Back to Account
        </Link>

        <div className="mt-6 p-4 bg-gray-900/50 rounded-xl border border-gray-700">
          <h4 className="text-amber-400 font-medium mb-2">Password Tips</h4>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>• Use at least 8 characters</li>
            <li>• Mix uppercase and lowercase letters</li>
            <li>• Include numbers and special characters</li>
            <li>• Avoid using personal information</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
