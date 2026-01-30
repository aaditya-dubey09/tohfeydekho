import { createAsyncThunk } from '@reduxjs/toolkit';
import { cartAPI } from '../../services/api';

// Fetch cart
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching cart');
      const { data } = await cartAPI.getCart();
      console.log('Cart fetched successfully:', data.data?.length || 0);
      return data.data;
    } catch (error) {
      console.error('Error fetching cart:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

// Add to cart
export const addToCartThunk = createAsyncThunk(
  'cart/addToCart',
  async (productId, { rejectWithValue }) => {
    try {
      console.log('Adding product to cart:', productId);
      const { data } = await cartAPI.addToCart(productId);
      console.log('Product added to cart');
      return data.data;
    } catch (error) {
      console.error('Error adding to cart:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
  }
);

// Remove from cart
export const removeFromCartThunk = createAsyncThunk(
  'cart/removeFromCart',
  async (productId, { rejectWithValue }) => {
    try {
      console.log('Removing product from cart:', productId);
      const { data } = await cartAPI.removeFromCart(productId);
      console.log('Product removed from cart');
      return data.data;
    } catch (error) {
      console.error('Error removing from cart:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart');
    }
  }
);

// Clear cart
export const clearCartThunk = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Clearing cart');
      await cartAPI.clearCart();
      console.log('Cart cleared');
      return [];
    } catch (error) {
      console.error('Error clearing cart:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
    }
  }
);
