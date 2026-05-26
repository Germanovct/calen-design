import { create } from 'zustand';
import api from '../lib/api';

export const useProducts = create((set) => ({
  products: [],
  categories: [],
  currentProduct: null,
  loading: false,
  error: null,

  fetchProducts: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      // Remover campos indefinidos
      const params = {};
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          params[key] = filters[key];
        }
      });

      const res = await api.get('/api/products/', { params });
      set({ products: res.data, loading: false });
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.detail || 'Error al cargar productos';
      set({ error: msg, loading: false });
      return [];
    }
  },

  fetchProduct: async (id) => {
    set({ loading: true, error: null, currentProduct: null });
    try {
      const res = await api.get(`/api/products/${id}`);
      set({ currentProduct: res.data, loading: false });
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.detail || 'Error al cargar detalle del producto';
      set({ error: msg, loading: false });
      return null;
    }
  },

  fetchCategories: async () => {
    try {
      const res = await api.get('/api/products/categories');
      set({ categories: res.data });
      return res.data;
    } catch (err) {
      console.error('Error al cargar categorías:', err);
      // Cargar fallback estático si falla
      const fallback = [
        { id: '1', name: 'Remeras', slug: 'remeras' },
        { id: '2', name: 'Buzos', slug: 'buzos' },
        { id: '3', name: 'Vestidos', slug: 'vestidos' },
        { id: '4', name: 'Lencería', slug: 'lenceria' },
        { id: '5', name: 'Abrigos', slug: 'abrigos' }
      ];
      set({ categories: fallback });
      return fallback;
    }
  },

  // Operaciones de Administrador
  createProduct: async (productData) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/api/products/', productData);
      set({ loading: false });
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.detail || 'Error al crear producto';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  updateProduct: async (id, productData) => {
    set({ loading: true, error: null });
    try {
      const res = await api.put(`/api/products/${id}`, productData);
      set({ loading: false });
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.detail || 'Error al actualizar producto';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/api/products/${id}`);
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        loading: false
      }));
    } catch (err) {
      const msg = err.response?.data?.detail || 'Error al eliminar producto';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  uploadImage: async (id, file) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await api.post(`/api/products/${id}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      set({ loading: false });
      return res.data.url;
    } catch (err) {
      const msg = err.response?.data?.detail || 'Error al subir imagen';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  // Gestión de variantes
  createVariant: async (productId, variantData) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post(`/api/products/${productId}/variants`, variantData);
      set({ loading: false });
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.detail || 'Error al crear variante';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  updateVariant: async (variantId, variantData) => {
    set({ loading: true, error: null });
    try {
      const res = await api.put(`/api/products/variants/${variantId}`, variantData);
      set({ loading: false });
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.detail || 'Error al actualizar variante';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  deleteVariant: async (variantId) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/api/products/variants/${variantId}`);
      set({ loading: false });
    } catch (err) {
      const msg = err.response?.data?.detail || 'Error al eliminar variante';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  }
}));
