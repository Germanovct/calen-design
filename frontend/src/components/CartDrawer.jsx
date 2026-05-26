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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: '#000000',
              zIndex: 1000,
            }}
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.22 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: '100%',
              maxWidth: '440px',
              height: '100%',
              backgroundColor: '#0A0A0A',
              borderLeft: '1px solid #2A2A2A',
              zIndex: 1001,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* ── HEADER ── */}
            <div style={{
              padding: '24px 28px',
              borderBottom: '1px solid #1A1A1A',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <h2 style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '18px',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#FFFFFF',
                }}>
                  CARRITO
                </h2>
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  color: '#555',
                  textTransform: 'uppercase',
                }}>
                  {getTotalItems()} ÍTEM{getTotalItems() !== 1 ? 'S' : ''}
                </span>
              </div>
              <button
                onClick={onClose}
                style={{
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #2A2A2A',
                  color: '#888',
                  fontSize: '20px',
                  transition: 'all 0.18s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#FF2D2D';
                  e.currentTarget.style.color = '#FF2D2D';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#2A2A2A';
                  e.currentTarget.style.color = '#888';
                }}
              >
                ×
              </button>
            </div>

            {/* ── ITEMS ── */}
            <div style={{
              flexGrow: 1,
              overflowY: 'auto',
              padding: '24px 28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '0',
            }}>
              {items.length === 0 ? (
                <div style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '20px',
                  color: '#333',
                }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  <p style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    fontSize: '13px',
                    letterSpacing: '0.12em',
                    color: '#444',
                  }}>
                    TU CARRITO ESTÁ VACÍO
                  </p>
                  <button
                    onClick={() => { onClose(); navigate('/productos'); }}
                    className="brutal-btn"
                    style={{ marginTop: '8px' }}
                  >
                    IR AL CATÁLOGO
                  </button>
                </div>
              ) : (
                items.map((item) => {
                  const itemImg = item.product.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400';
                  return (
                    <div
                      key={item.variant.id}
                      style={{
                        display: 'flex',
                        gap: '16px',
                        borderBottom: '1px solid #1A1A1A',
                        padding: '20px 0',
                      }}
                    >
                      <img
                        src={itemImg}
                        alt={item.product.name}
                        style={{
                          width: '72px',
                          height: '90px',
                          objectFit: 'cover',
                          border: '1px solid #2A2A2A',
                          filter: 'grayscale(30%)',
                        }}
                      />
                      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{
                          fontSize: '13px',
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontWeight: 900,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          color: '#FFFFFF',
                          marginBottom: '4px',
                        }}>
                          {item.product.name}
                        </h3>
                        <span style={{
                          fontSize: '11px',
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: '#555',
                          letterSpacing: '0.08em',
                          marginBottom: '12px',
                        }}>
                          T: {item.variant.size} · C: {item.variant.color}
                        </span>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                          {/* Qty */}
                          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #2A2A2A' }}>
                            <button
                              onClick={() => updateQuantity(item.variant.id, item.quantity - 1)}
                              style={{
                                width: '28px', height: '28px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                borderRight: '1px solid #2A2A2A',
                                fontWeight: 900, color: '#888', fontSize: '14px',
                                transition: 'all 0.15s ease',
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.color = '#FF2D2D'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.color = '#888'; }}
                            >−</button>
                            <span style={{
                              width: '32px', textAlign: 'center',
                              fontSize: '12px', fontWeight: 900,
                              fontFamily: "'Space Grotesk', sans-serif",
                              color: '#FFFFFF',
                            }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                              style={{
                                width: '28px', height: '28px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                borderLeft: '1px solid #2A2A2A',
                                fontWeight: 900, color: '#888', fontSize: '14px',
                                transition: 'all 0.15s ease',
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.color = '#C8FF00'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.color = '#888'; }}
                            >+</button>
                          </div>

                          <button
                            onClick={() => removeItem(item.variant.id)}
                            style={{
                              fontSize: '11px',
                              fontFamily: "'Space Grotesk', sans-serif",
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '0.1em',
                              color: '#444',
                              textDecoration: 'underline',
                              textUnderlineOffset: '2px',
                              transition: 'color 0.15s ease',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#FF2D2D'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = '#444'; }}
                          >
                            ELIMINAR
                          </button>
                        </div>
                      </div>

                      {/* Precio del ítem */}
                      <div style={{
                        fontWeight: 900,
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: '15px',
                        color: '#FF2D2D',
                        whiteSpace: 'nowrap',
                      }}>
                        ${(item.product.price * item.quantity).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* ── FOOTER TOTAL + CTA ── */}
            {items.length > 0 && (
              <div style={{
                padding: '24px 28px',
                borderTop: '1px solid #1A1A1A',
                backgroundColor: '#0A0A0A',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: '20px',
                }}>
                  <span style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: '#555',
                  }}>
                    SUBTOTAL
                  </span>
                  <span style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '28px',
                    fontWeight: 900,
                    color: '#FFFFFF',
                    letterSpacing: '-0.01em',
                  }}>
                    ${getTotalPrice().toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <button
                  onClick={handleCheckoutRedirect}
                  style={{
                    width: '100%',
                    padding: '18px 20px',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 900,
                    fontSize: '13px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    backgroundColor: '#FFFFFF',
                    color: '#000000',
                    border: '1px solid #FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FF2D2D';
                    e.currentTarget.style.color = '#FFFFFF';
                    e.currentTarget.style.borderColor = '#FF2D2D';
                    e.currentTarget.style.transform = 'translate(-2px, -2px)';
                    e.currentTarget.style.boxShadow = '4px 4px 0px #FF2D2D';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.color = '#000000';
                    e.currentTarget.style.borderColor = '#FFFFFF';
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  INICIAR COMPRA →
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
