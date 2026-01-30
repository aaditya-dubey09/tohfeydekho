import { createAsyncThunk } from '@reduxjs/toolkit';
import { productsAPI } from '../../services/api';

// Fetch all products
export const fetchAllProducts = createAsyncThunk(
  'products/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      console.log('Fetching products with params:', params);
      const { data } = await productsAPI.getAll(params);
      console.log('Products fetched successfully:', data.data?.length || 0);
      return data.data;
    } catch (error) {
      console.error('Error fetching products:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

// Fetch single product
export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      console.log('Fetching product:', id);
      const { data } = await productsAPI.getById(id);
      console.log('Product fetched successfully:', data.data?.name);
      return data.data;
    } catch (error) {
      console.error('Error fetching product:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

// Toggle wishlist
export const toggleWishlist = createAsyncThunk(
  'products/toggleWishlist',
  async (id, { rejectWithValue }) => {
    try {
      console.log('Toggling wishlist for product:', id);
      const { data } = await productsAPI.toggleWishlist(id);
      console.log('Wishlist toggled:', data.success);
      return data.data; // Returns updated wishlist array
    } catch (error) {
      console.error('Error toggling wishlist:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle wishlist');
    }
  }
);

// Fetch wishlist
export const fetchWishlist = createAsyncThunk(
  'products/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching wishlist');
      const { data } = await productsAPI.getWishlist();
      console.log('Wishlist fetched:', data.data?.length || 0);
      return data.data;
    } catch (error) {
      console.error('Error fetching wishlist:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
    }
  }
);
