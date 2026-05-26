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
            transition={{ type: 'tween', duration: 0.2 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: '100%',
              maxWidth: '460px',
              height: '100%',
              backgroundColor: 'var(--white)',
              borderLeft: '5px solid #000000',
              boxShadow: '-6px 0px 0px rgba(0, 0, 0, 0.3)',
              zIndex: 1001,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '24px',
              borderBottom: 'var(--border-brutal-sm)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'var(--primary-yellow)'
            }}>
              <h2 style={{ fontSize: '22px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>TU CARRITO ({getTotalItems()})</h2>
              <button onClick={onClose} style={{ fontSize: '28px', fontWeight: '900', color: 'var(--black)' }}>&times;</button>
            </div>

            {/* Items List */}
            <div style={{
              flexGrow: 1,
              overflowY: 'auto',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}>
              {items.length === 0 ? (
                <div style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--black)',
                  gap: '16px'
                }}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--black)' }}>
                    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  <p style={{ fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>Tu carrito está vacío.</p>
                  <button onClick={() => { onClose(); navigate('/productos'); }} className="brutal-btn brutal-btn-black" style={{ marginTop: '16px' }}>
                    IR A LA TIENDA
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
                        borderBottom: '3px solid #000000',
                        paddingBottom: '20px'
                      }}
                    >
                      <img
                        src={itemImg}
                        alt={item.product.name}
                        style={{
                          width: '80px',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: '0px',
                          border: '2px solid #000000'
                        }}
                      />
                      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ fontSize: '16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', marginBottom: '4px' }}>
                          {item.product.name}
                        </h3>
                        <span style={{ fontSize: '11px', fontFamily: 'var(--display)', fontWeight: '800', textTransform: 'uppercase', color: 'var(--gray-medium)', marginBottom: '8px' }}>
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
                            border: '2px solid #000000',
                            borderRadius: '0px',
                            overflow: 'hidden'
                          }}>
                            <button
                              onClick={() => updateQuantity(item.variant.id, item.quantity - 1)}
                              style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--primary-yellow)', borderRight: '2px solid #000000', fontWeight: '900' }}
                            >
                              -
                            </button>
                            <span style={{ width: '32px', textAlign: 'center', fontSize: '13px', fontWeight: '900', fontFamily: 'var(--display)' }}>{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                              style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--primary-yellow)', borderLeft: '2px solid #000000', fontWeight: '900' }}
                            >
                              +
                            </button>
                          </div>

                          <button 
                            onClick={() => removeItem(item.variant.id)}
                            style={{ color: 'var(--black)', fontSize: '12px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', textDecoration: 'underline' }}
                          >
                            ELIMINAR
                          </button>
                        </div>
                      </div>
                      <div style={{ fontWeight: '900', fontFamily: 'var(--display)', fontSize: '16px' }}>
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
                borderTop: '3px solid #000000',
                backgroundColor: 'var(--primary-pink)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px'
                }}>
                  <span style={{ fontSize: '18px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: '#000000' }}>SUBTOTAL</span>
                  <span style={{ fontSize: '28px', fontFamily: 'var(--display)', fontWeight: '900', color: '#000000' }}>
                    ${getTotalPrice().toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                
                <button
                  onClick={handleCheckoutRedirect}
                  className="brutal-btn brutal-btn-black"
                  style={{ width: '100%', padding: '16px 20px', fontSize: '16px' }}
                >
                  INICIAR COMPRA
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
