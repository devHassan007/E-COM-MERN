import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as orderApi from '../Api/orderApi';
import { toast } from 'react-toastify';

// Create new order
export const createOrder = createAsyncThunk(
  'order/create',
  async (orderData, thunkAPI) => {
    try {
      const res = await orderApi.createOrder(orderData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to create order');
    }
  }
);

// Get order details
export const getOrderDetails = createAsyncThunk(
  'order/getDetails',
  async (id, thunkAPI) => {
    try {
      const res = await orderApi.getOrderDetails(id);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch order');
    }
  }
);

// Get my orders
export const fetchMyOrders = createAsyncThunk(
  'order/myOrders',
  async (_, thunkAPI) => {
    try {
      const res = await orderApi.myOrders();
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

// Admin - Get all orders
export const fetchAllOrders = createAsyncThunk(
  'order/fetchAll',
  async (_, thunkAPI) => {
    try {
      const res = await orderApi.getAllOrders();
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

// Admin - Update order status
export const updateOrderStatus = createAsyncThunk(
  'order/updateStatus',
  async ({ id, status }, thunkAPI) => {
    try {
      const res = await orderApi.updateOrder(id, { status });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to update order');
    }
  }
);

// Admin - Delete order
export const deleteOrder = createAsyncThunk(
  'order/delete',
  async (id, thunkAPI) => {
    try {
      await orderApi.deleteOrder(id);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to delete order');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: [],
    order: null,
    myOrders: [],
    totalAmount: 0,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    clearOrderSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.order = action.payload.order;
        toast.success('Order placed successfully!');
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Get order details
      .addCase(getOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.order;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // My orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.myOrders = action.payload.orders;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Admin - All orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.totalAmount = action.payload.totalAmount;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Admin - Update order
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.orders.findIndex(o => o._id === action.payload.order._id);
        if (index !== -1) {
          state.orders[index] = action.payload.order;
        }
        toast.success('Order status updated!');
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Admin - Delete order
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter(o => o._id !== action.payload);
        toast.success('Order deleted successfully!');
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { clearOrderError, clearOrderSuccess } = orderSlice.actions;
export default orderSlice.reducer;
