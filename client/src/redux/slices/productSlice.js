import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
  name: 'products',
  initialState: {
    list: [],
    loading: false,
  },
  reducers: {
    setProducts: (state, action) => {
      state.list = action.payload;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  },
});

export const { setProducts, setLoading } = productSlice.actions;
export default productSlice.reducer;
