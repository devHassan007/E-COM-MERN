import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import productReducer from './productSlice';
import adminReducer from './adminSlice';
import cartReducer from './cartSlice';
import orderReducer from './orderSlice';
import userReducer from './userSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    admin: adminReducer,
    cart: cartReducer,
    order: orderReducer,
    user: userReducer,
  },
});

export default store;
