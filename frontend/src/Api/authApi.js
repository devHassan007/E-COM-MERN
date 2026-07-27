import API from './config';

// Register new user (sends OTP)
export const register = (userData) => API.post('/register', userData);

// Verify OTP (returns token & user via cookie + response body)
export const verifyOtp = (data) => API.post('/verify-otp', data);

// Resend OTP
export const resendOtp = (data) => API.post('/resend-otp', data);

// Login
export const login = (userData) => API.post('/login', userData);

// Forgot password - sends reset link to email
export const sendResetEmail = (email) => API.post('/password/forgot', { email });

// Reset password with token
export const resetPassword = (token, passwords) => 
  API.put(`/password/reset/${token}`, passwords);

// Update password (for logged-in user)
export const updatePassword = (passwords) => 
  API.put('/password/update', passwords);

// Logout
export const logout = () => API.get('/logout');

// Get current user
export const getMe = () => API.get('/me');
