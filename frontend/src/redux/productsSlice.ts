import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const URL = 'http://localhost:5000/api'

export interface Product {
  id?: string;
  name: string;
  description: string;
  file: string;
  price: number;
  imageUrl: string;
  status: 'active' | 'archived';
}

interface ProductsState {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  currentPage: number;
  totalPages: number;
}

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
  currentPage: 1,
  totalPages: 0,
};

export const fetchProducts = createAsyncThunk<
  { products: Product[], currentPage: number, totalItems: number, totalPages: number },
  { page: number, search?: string }
>(
  'products/fetchProducts',
  async ({ page, search = '' }) => {
    const response = await axios.get(`${URL}/products`, {
      params: { page, search }
    });
    return response.data;
  }
);

export const createProduct = createAsyncThunk<Product, FormData>(
  'products/createProduct',
  async (formData) => {
    const response = await axios.post(`${URL}/products`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
);

export const updateProduct = createAsyncThunk<Product, { formData: FormData, id: string }>(
  'products/updateProduct',
  async ({ formData, id }) => {
    const response = await axios.put(`${URL}/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
);

export const deleteProduct = createAsyncThunk<string, string>('products/deleteProduct', async (id) => {
  await axios.delete(`${URL}/products/${id}`);
  return id;
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<{ products: Product[], currentPage: number, totalItems: number, totalPages: number }>) => {
        state.status = 'succeeded';
        state.items = action.payload.products;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
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

export const { setCurrentPage } = productsSlice.actions;

export default productsSlice.reducer;