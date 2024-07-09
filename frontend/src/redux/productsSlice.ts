import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './store';

const URL = 'http://localhost:5000/api'

export interface Product {
  id?: string;
  name: string;
  description: string;
  image: string;
  price: number;
  status: 'active' | 'archived';
}

interface ProductsState {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchProducts = createAsyncThunk<Product[]>('products/fetchProducts', async () => {
  const response = await axios.get(`${URL}/products`);
  return response.data;
});

export const createProduct = createAsyncThunk<Product, Product>('products/createProduct', async (product) => {
  const response = await axios.post(`${URL}/products`, product);
  return response.data;
});

export const updateProduct = createAsyncThunk<Product, Product>('products/updateProduct', async (product) => {
  const { id } = product;
  const response = await axios.put(`${URL}/products/${id}`, product);
  return response.data;
});


export const deleteProduct = createAsyncThunk<string, string>('products/deleteProduct', async (id) => {
  await axios.delete(`${URL}/products/${id}`);
  return id;
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? null;
      })
      .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.items.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        state.items[index] = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export default productsSlice.reducer;