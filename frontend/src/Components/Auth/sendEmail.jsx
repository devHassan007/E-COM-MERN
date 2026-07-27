import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { sendResetEmail } from '../../Api/authApi';
import { FiMail, FiArrowLeft, FiSend } from 'react-icons/fi';

const SendEmail = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSendEmail = async (e) => {
    e.preventDefault();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const res = await sendResetEmail(email);
      toast.success(res.data.message);
      setEmailSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 px-4">
      <ToastContainer position="top-right" />
      <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl p-8 w-full max-w-md">
        {!emailSent ? (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMail className="text-3xl text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Forgot Password?</h2>
              <p className="text-gray-400 mt-2">
                No worries! Enter your email and we'll send you a reset link.
              </p>
            </div>

            <form onSubmit={handleSendEmail} className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full p-4 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-gray-900 font-bold rounded-xl transition-colors"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <FiSend />
                    Send Reset Link
                  </>
                )}
              </button>
            </form>

            <Link
              to="/login"
              className="flex items-center justify-center gap-2 mt-6 text-gray-400 hover:text-white transition-colors"
            >
              <FiArrowLeft />
              Back to Login
            </Link>
          </>
        ) : (
          <div className="text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiMail className="text-4xl text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Check Your Email</h2>
            <p className="text-gray-400 mb-6">
              We've sent a password reset link to <span className="text-amber-400">{email}</span>
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setEmailSent(false)}
                className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
              >
                Try Another Email
              </button>
              <Link
                to="/login"
                className="block w-full py-3 bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold rounded-xl transition-colors text-center"
              >
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SendEmail;
