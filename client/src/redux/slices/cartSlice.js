import { createSlice } from '@reduxjs/toolkit';
import { fetchCart, addToCartThunk, removeFromCartThunk, clearCartThunk } from './cart.thunk';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Local reducers for optimistic updates
    addToCart: (state, action) => {
      const exists = state.items.find(item => item._id === action.payload._id);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch cart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add to cart
    builder
      .addCase(addToCartThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCartThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(addToCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Remove from cart
    builder
      .addCase(removeFromCartThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromCartThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(removeFromCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Clear cart
    builder
      .addCase(clearCartThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(clearCartThunk.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
      })
      .addCase(clearCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { addToCart, removeFromCart, clearCart, clearError } = cartSlice.actions;
export default cartSlice.reducer;
