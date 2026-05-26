import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // Array de { id, product, variant, quantity }

      addItem: (product, variant, quantity = 1) => {
        const items = get().items;
        // Buscar si ya existe la misma variante en el carrito
        const existingIndex = items.findIndex(
          (item) => item.variant.id === variant.id
        );

        if (existingIndex > -1) {
          const updatedItems = [...items];
          const newQty = updatedItems[existingIndex].quantity + quantity;
          
          // Validar contra el stock máximo disponible de la variante
          if (newQty > variant.stock) {
            updatedItems[existingIndex].quantity = variant.stock;
          } else {
            updatedItems[existingIndex].quantity = newQty;
          }
          set({ items: updatedItems });
        } else {
          // Asegurar que no agregamos más del stock
          const finalQty = quantity > variant.stock ? variant.stock : quantity;
          if (finalQty > 0) {
            set({
              items: [...items, { product, variant, quantity: finalQty }]
            });
          }
        }
      },

      removeItem: (variantId) => {
        set({
          items: get().items.filter((item) => item.variant.id !== variantId)
        });
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }

        const items = get().items;
        const updatedItems = items.map((item) => {
          if (item.variant.id === variantId) {
            const finalQty = quantity > item.variant.stock ? item.variant.stock : quantity;
            return { ...item, quantity: finalQty };
          }
          return item;
        });

        set({ items: updatedItems });
      },

      clearCart: () => set({ items: [] }),

      // Helpers de selección
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      }
    }),
    {
      name: 'calen-cart-storage' // Guardar en localStorage
    }
  )
);
