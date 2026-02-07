import { createSlice } from '@reduxjs/toolkit';
import { products } from '../products';

const initialState = {
  items: products,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
});

export const selectAllProducts = (state) => state.products.items;

export default productSlice.reducer;
