import { create } from 'zustand';
import api from '../lib/api';

export const useAuth = create((set) => ({
  user: null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/api/auth/login', { email, password });
      set({ user: res.data.user, loading: false });
      return res.data.user;
    } catch (err) {
      const msg = err.response?.data?.detail || 'Error de conexión con el servidor';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  register: async (name, email, password, phone, address) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/api/auth/register', { name, email, password, phone, address });
      set({ loading: false });
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.detail || 'Error al registrar usuario';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  logout: async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (err) {
      console.error("Error al cerrar sesión en el servidor:", err);
    }
    set({ user: null });
  },

  checkUser: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/api/auth/me');
      set({ user: res.data, loading: false });
      return res.data;
    } catch (err) {
      set({ user: null, loading: false });
      return null;
    }
  }
}));
