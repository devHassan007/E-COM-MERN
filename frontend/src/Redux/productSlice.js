import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../Api/productApi';

// Fetch all products
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async ({ keyword = '', page = 1, price = [0, 100000], category = '', ratings = 0 } = {}, thunkAPI) => {
    try {
      const res = await api.getAllProducts(keyword, page, price, category, ratings);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
    }
  }
);

// Fetch single product details
export const fetchProductDetails = createAsyncThunk(
  'products/fetchDetails',
  async (id, thunkAPI) => {
    try {
      const res = await api.getProductDetails(id);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch product details');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    product: null,
    productCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
    clearProductDetails: (state) => {
      state.product = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.productCount = action.payload.productCount;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch product details
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.product;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProductError, clearProductDetails } = productSlice.actions;
export default productSlice.reducer;
