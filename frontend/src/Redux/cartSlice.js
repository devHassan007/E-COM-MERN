import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const cart = localStorage.getItem('cartItems');
    const shippingInfo = localStorage.getItem('shippingInfo');
    return {
      cartItems: cart ? JSON.parse(cart) : [],
      shippingInfo: shippingInfo ? JSON.parse(shippingInfo) : {},
    };
  } catch {
    return { cartItems: [], shippingInfo: {} };
  }
};

const initialState = {
  ...loadCartFromStorage(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.cartItems.find(i => i.product === item.product);

      if (existingItem) {
        state.cartItems = state.cartItems.map(i =>
          i.product === existingItem.product ? item : i
        );
        toast.info('Cart updated');
      } else {
        state.cartItems.push(item);
        toast.success('Added to cart');
      }

      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(i => i.product !== action.payload);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      toast.success('Removed from cart');
    },

    updateCartQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.cartItems.find(i => i.product === productId);
      if (item) {
        item.quantity = quantity;
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      }
    },

    saveShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
      localStorage.setItem('shippingInfo', JSON.stringify(action.payload));
    },

    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  saveShippingInfo,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
