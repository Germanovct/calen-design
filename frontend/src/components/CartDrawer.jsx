import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { AnimatePresence, motion } from 'framer-motion';

const CartDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCartStore();

  const handleCheckoutRedirect = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: '#000000',
              zIndex: 1000
            }}
          />

          {/* Slide-out Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: '100%',
              maxWidth: '440px',
              height: '100%',
              backgroundColor: 'var(--white)',
              boxShadow: '-4px 0 30px rgba(0, 0, 0, 0.15)',
              zIndex: 1001,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '24px',
              borderBottom: '1px solid var(--gray-light)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ fontSize: '24px', fontFamily: 'var(--serif)' }}>Tu Carrito ({getTotalItems()})</h2>
              <button onClick={onClose} style={{ fontSize: '20px', fontWeight: '300' }}>&times;</button>
            </div>

            {/* Items List */}
            <div style={{
              flexGrow: 1,
              overflowY: 'auto',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              {items.length === 0 ? (
                <div style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gray-medium)',
                  gap: '16px'
                }}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  <p>Tu carrito está vacío.</p>
                  <button onClick={() => { onClose(); navigate('/productos'); }} className="btn-primary" style={{ marginTop: '8px' }}>
                    Ir a la tienda
                  </button>
                </div>
              ) : (
                items.map((item) => {
                  const itemImg = item.product.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800';
                  
                  return (
                    <div 
                      key={item.variant.id} 
                      style={{
                        display: 'flex',
                        gap: '16px',
                        borderBottom: '1px solid var(--gray-light)',
                        paddingBottom: '16px'
                      }}
                    >
                      <img
                        src={itemImg}
                        alt={item.product.name}
                        style={{
                          width: '80px',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: '4px'
                        }}
                      />
                      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ fontSize: '16px', fontFamily: 'var(--sans)', fontWeight: '500', marginBottom: '4px' }}>
                          {item.product.name}
                        </h3>
                        <span style={{ fontSize: '12px', color: 'var(--gray-medium)', marginBottom: '8px' }}>
                          Talle: {item.variant.size} · Color: {item.variant.color}
                        </span>

                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginTop: 'auto'
                        }}>
                          {/* Quantity selector */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            border: '1px solid var(--gray-light)',
                            borderRadius: '4px',
                            overflow: 'hidden'
                          }}>
                            <button
                              onClick={() => updateQuantity(item.variant.id, item.quantity - 1)}
                              style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-light)' }}
                            >
                              -
                            </button>
                            <span style={{ width: '32px', textAlign: 'center', fontSize: '13px' }}>{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                              style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-light)' }}
                            >
                              +
                            </button>
                          </div>

                          <button 
                            onClick={() => removeItem(item.variant.id)}
                            style={{ color: 'var(--gray-medium)', fontSize: '12px', textDecoration: 'underline' }}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                      <div style={{ fontWeight: '600', fontSize: '15px' }}>
                        ${(item.product.price * item.quantity).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div style={{
                padding: '24px',
                borderTop: '1px solid var(--gray-light)',
                backgroundColor: 'var(--bg-light)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px'
                }}>
                  <span style={{ fontSize: '16px', fontWeight: '500' }}>Subtotal</span>
                  <span style={{ fontSize: '20px', fontWeight: '600', color: 'var(--dark-black)' }}>
                    ${getTotalPrice().toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                
                <button
                  onClick={handleCheckoutRedirect}
                  className="btn-primary"
                  style={{ width: '100%', display: 'block', textAlign: 'center' }}
                >
                  Iniciar Compra
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
