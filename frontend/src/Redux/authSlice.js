import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../Api/authApi';
import { toast } from 'react-toastify';

// Load auth state from localStorage
const loadAuthState = () => {
  try {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return {
      user: user ? JSON.parse(user) : null,
      token: token || null,
      isAuthenticated: !!(user && token),
    };
  } catch (e) {
    return { user: null, token: null, isAuthenticated: false };
  }
};

const persistedAuth = loadAuthState();

// register -> backend sends OTP (no token)
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData, thunkAPI) => {
    try {
      const res = await api.register(formData);
      return res.data; // { success: true, message, email }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

// verify OTP -> backend issues token via sendToken (cookie) AND returns user info
export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ email, otp }, thunkAPI) => {
    try {
      const res = await api.verifyOtp({ email, otp });
      return res.data; // expect token/user or at least success and user
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'OTP verification failed');
    }
  }
);

export const resendOtp = createAsyncThunk(
  'auth/resendOtp',
  async ({ email }, thunkAPI) => {
    try {
      const res = await api.resendOtp({ email });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Resend OTP failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (formData, thunkAPI) => {
    try {
      const res = await api.login(formData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

// Logout user
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, thunkAPI) => {
    try {
      await api.logout();
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Logout failed');
    }
  }
);

// Get current user (check if still logged in)
export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, thunkAPI) => {
    try {
      const res = await api.getMe();
      return res.data;
    } catch (err) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Not authenticated');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: persistedAuth.user,
    token: persistedAuth.token,
    isAuthenticated: persistedAuth.isAuthenticated,
    pendingEmail: null,
    loading: false,
    error: null,
  },
  reducers: {
    logoutLocal: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.pendingEmail = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // register
      .addCase(registerUser.pending, (state) => { state.loading = true; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingEmail = action.payload.email || state.pendingEmail;
        toast.success(action.payload.message || "OTP sent to email");
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // verify OTP
      .addCase(verifyOtp.pending, (state) => { state.loading = true; })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.user) {
          state.user = action.payload.user;
          localStorage.setItem('user', JSON.stringify(action.payload.user));
        }
        if (action.payload.token) {
          state.token = action.payload.token;
          localStorage.setItem('token', action.payload.token);
        }
        state.isAuthenticated = true;
        state.pendingEmail = null;
        toast.success("OTP verified, logged in");
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // resend
      .addCase(resendOtp.pending, (state) => { state.loading = true; })
      .addCase(resendOtp.fulfilled, (state, action) => {
        state.loading = false;
        toast.success(action.payload.message || "OTP resent");
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // login
      .addCase(loginUser.pending, (state) => { state.loading = true; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.user) {
          state.user = action.payload.user;
          localStorage.setItem('user', JSON.stringify(action.payload.user));
        }
        if (action.payload.token) {
          state.token = action.payload.token;
          localStorage.setItem('token', action.payload.token);
        }
        state.isAuthenticated = true;
        toast.success("Login successful");
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // logout
      .addCase(logoutUser.pending, (state) => { state.loading = true; })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        toast.success("Logged out successfully");
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // load user
      .addCase(loadUser.pending, (state) => { state.loading = true; })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(loadUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logoutLocal, clearError } = authSlice.actions;
export default authSlice.reducer;
