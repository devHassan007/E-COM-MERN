import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { toast, ToastContainer } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Login from '../../assets/Login.jpg';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../Redux/authSlice';

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // States
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Password toggle function (ERROR FIXED)
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, password } = formData;

    if (!name || !email || password.length < 6) {
      toast.error('Please fill out all fields correctly!');
      return;
    }

    dispatch(registerUser(formData))
      .unwrap()
      .then(() => {
        localStorage.setItem('email', formData.email);
        navigate('/otp-verification');
      })
      .catch((err) => {
        const message =
          err?.message ||
          err?.error ||
          "Registration failed. Please try again.";

        toast.error(message);
      });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundImage: `url(${Login})` }}
    >
      <ToastContainer position="top-right" />

      <div className="w-full max-w-4xl grid md:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* LEFT */}
        <div className="bg-gray-900 text-white p-6 flex flex-col justify-center items-center">
          <h2 className="text-2xl font-bold mt-4 text-center">ShopEasy</h2>
          <p className="text-center text-sm mt-2">
            Your data is safe with us. Sign up to protect your digital world.
          </p>
        </div>

        {/* RIGHT */}
        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Create Account
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            
            <div>
              <label className="block text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full p-3 rounded-lg border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full p-3 rounded-lg border border-gray-300"
              />
            </div>

            <div className="relative">
              <label className="block text-gray-700 mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full p-3 pr-10 rounded-lg border border-gray-300"
              />

              {showPassword ? (
                <AiOutlineEyeInvisible
                  className="absolute right-3 top-11 text-xl text-gray-600 cursor-pointer"
                  onClick={togglePasswordVisibility}
                />
              ) : (
                <AiOutlineEye
                  className="absolute right-3 top-11 text-xl text-gray-600 cursor-pointer"
                  onClick={togglePasswordVisibility}
                />
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-900 transition duration-300"
            >
              Sign Up
            </button>

          </form>

          <div className="my-4 text-center text-gray-500">or</div>

          <p className="text-sm text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Log In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default SignUp;
