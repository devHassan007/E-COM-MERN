import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as adminApi from '../Api/adminApi';
import { toast } from 'react-toastify';

// ==================== ASYNC THUNKS ====================

// Fetch all products (Admin)
export const fetchAdminProducts = createAsyncThunk(
  'admin/fetchProducts',
  async (_, thunkAPI) => {
    try {
      const res = await adminApi.getAdminProducts();
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
    }
  }
);

// Create product
export const createProduct = createAsyncThunk(
  'admin/createProduct',
  async (productData, thunkAPI) => {
    try {
      const res = await adminApi.createProduct(productData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to create product');
    }
  }
);

// Update product
export const updateProduct = createAsyncThunk(
  'admin/updateProduct',
  async ({ id, productData }, thunkAPI) => {
    try {
      const res = await adminApi.updateProduct(id, productData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to update product');
    }
  }
);

// Delete product
export const deleteProduct = createAsyncThunk(
  'admin/deleteProduct',
  async (id, thunkAPI) => {
    try {
      await adminApi.deleteProduct(id);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to delete product');
    }
  }
);

// Get product details for editing
export const getProductForEdit = createAsyncThunk(
  'admin/getProductForEdit',
  async (id, thunkAPI) => {
    try {
      const res = await adminApi.getProductDetails(id);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch product');
    }
  }
);

// ==================== SLICE ====================

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    products: [],
    product: null,
    loading: false,
    error: null,
    success: false,
    message: null,
  },
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
    clearAdminSuccess: (state) => {
      state.success = false;
      state.message = null;
    },
    clearProductForEdit: (state) => {
      state.product = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Create product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Product created successfully';
        state.products.push(action.payload.product);
        toast.success('Product created successfully');
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Product updated successfully';
        const index = state.products.findIndex(p => p._id === action.payload.product._id);
        if (index !== -1) {
          state.products[index] = action.payload.product;
        }
        toast.success('Product updated successfully');
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Product deleted successfully';
        state.products = state.products.filter(p => p._id !== action.payload);
        toast.success('Product deleted successfully');
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Get product for edit
      .addCase(getProductForEdit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductForEdit.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.product;
      })
      .addCase(getProductForEdit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { clearAdminError, clearAdminSuccess, clearProductForEdit } = adminSlice.actions;
export default adminSlice.reducer;
