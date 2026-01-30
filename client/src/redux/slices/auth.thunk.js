import { createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';

// Check if user is logged in
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Checking authentication');
      const { data } = await authAPI.getProfile();
      console.log('User authenticated:', data.data?.email);
      return data.data;
    } catch (error) {
      console.error('Auth check failed:', error.response?.status);
      return rejectWithValue('Not authenticated');
    }
  }
);

// Login
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('Logging in user:', credentials.email);
      const { data } = await authAPI.login(credentials);
      console.log('Login successful');
      return data.data;
    } catch (error) {
      console.error('Login failed:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Register
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      console.log('Registering user:', userData.email);
      const { data } = await authAPI.register(userData);
      console.log('Registration successful');
      return data.data;
    } catch (error) {
      console.error('Registration failed:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

// Logout
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Logging out user');
      await authAPI.logout();
      console.log('Logout successful');
      return null;
    } catch (error) {
      console.error('Logout failed:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

// Update profile
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      console.log('Updating profile');
      const { data } = await authAPI.updateProfile(userData);
      console.log('Profile updated successfully');
      return data.data;
    } catch (error) {
      console.error('Update profile failed:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

// Delete account
export const deleteAccount = createAsyncThunk(
  'auth/deleteAccount',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Deleting account');
      await authAPI.deleteAccount();
      console.log('Account deleted');
      return null;
    } catch (error) {
      console.error('Delete account failed:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to delete account');
    }
  }
);
