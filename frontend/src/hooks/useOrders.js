import { create } from 'zustand';
import api from '../lib/api';

export const useOrders = create((set) => ({
  orders: [],
  currentOrder: null,
  currentShipping: null,
  loading: false,
  error: null,

  createOrder: async (shippingAddress, items) => {
    set({ loading: true, error: null });
    try {
      // items debe tener formato [{variant_id, quantity}]
      const payload = {
        shipping_address: shippingAddress,
        items: items.map((item) => ({
          variant_id: item.variant.id,
          quantity: item.quantity
        }))
      };
      const res = await api.post('/api/orders/', payload);
      set({ loading: false });
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.detail || 'Error al procesar la orden';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get('/api/orders/');
      set({ orders: res.data, loading: false });
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.detail || 'Error al obtener listado de órdenes';
      set({ error: msg, loading: false });
      return [];
    }
  },

  fetchMyOrders: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get('/api/orders/me/orders');
      set({ orders: res.data, loading: false });
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.detail || 'Error al obtener historial de pedidos';
      set({ error: msg, loading: false });
      return [];
    }
  },

  fetchOrderDetail: async (id) => {
    set({ loading: true, error: null, currentOrder: null, currentShipping: null });
    try {
      const res = await api.get(`/api/orders/${id}`);
      set({ currentOrder: res.data, loading: false });
      
      // Intentar cargar la info de tracking si existe
      try {
        const shipRes = await api.get(`/api/shipping/${id}/shipping`);
        set({ currentShipping: shipRes.data });
      } catch (shipErr) {
        // No tiene envío cargado aún, omitir pacíficamente
      }

      return res.data;
    } catch (err) {
      const msg = err.response?.data?.detail || 'Error al obtener detalles del pedido';
      set({ error: msg, loading: false });
      return null;
    }
  },

  updateOrderStatus: async (id, statusValue) => {
    set({ loading: true, error: null });
    try {
      const res = await api.put(`/api/orders/${id}/status`, { status: statusValue });
      set((state) => ({
        orders: state.orders.map((o) => (o.id === id ? { ...o, status: statusValue } : o)),
        currentOrder: state.currentOrder && state.currentOrder.id === id ? { ...state.currentOrder, status: statusValue } : state.currentOrder,
        loading: false
      }));
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.detail || 'Error al actualizar estado';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  createPaymentPreference: async (orderId) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post(`/api/orders/${orderId}/payment`);
      set({ loading: false });
      return res.data; // { preference_id, init_point }
    } catch (err) {
      const msg = err.response?.data?.detail || 'Error al generar preferencia de Mercado Pago';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  // Gestión de envíos
  addShippingInfo: async (orderId, shippingData) => {
    set({ loading: true, error: null });
    try {
      // shippingData: { carrier, tracking_number, label_url }
      const res = await api.post(`/api/shipping/${orderId}/shipping`, shippingData);
      set((state) => ({
        currentShipping: res.data,
        loading: false
      }));
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.detail || 'Error al guardar tracking de envío';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  generateCorreoArgentinoLabel: async (orderId) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post(`/api/shipping/orders/${orderId}/shipping/label`, {
        carrier: "Correo Argentino"
      });
      set({ loading: false });
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.detail || 'Error al generar etiqueta de Correo Argentino';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  dispatchWithUberDirect: async (orderId) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post(`/api/shipping/orders/${orderId}/shipping/uber`);
      set({ loading: false });
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.detail || 'Error al despachar con Uber Direct';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  }
}));
