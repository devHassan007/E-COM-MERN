import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../Redux/authSlice';
import 'react-toastify/dist/ReactToastify.css';
import Login from '../../assets/Login.jpg';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading } = useSelector((state) => state.auth);

  // Get redirect path from query params
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || 'product';

  const handleSignIn = (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Enter a valid email address');
      return;
    }

    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        navigate(`/${redirect}`);
      })
      .catch((err) => {
        // Error toast is already handled in Redux slice
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundImage: `url(${Login})` }}>
      <ToastContainer position="top-right" />
      <div className="w-full max-w-4xl grid md:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Illustration Section */}
        <div className="bg-gray-900 text-white p-6 flex flex-col justify-center items-center">
          <h2 className="text-2xl font-bold mt-4 text-center">Welcome Back</h2>
          <p className="text-center text-sm mt-2">
            Sign in to continue protecting your digital world securely.
          </p>
        </div>

        {/* Sign In Form */}
        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Sign In</h2>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="relative">
              <label className="block text-gray-700 mb-1">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full p-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div
                className="absolute top-10 right-3 text-xl text-gray-500 cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </div>

              {/* Forgot Password Link */}
              <div className="mt-2 text-right">
                <Link to="/send-email" className="text-sm text-blue-600 hover:underline">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition duration-300"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-4">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
