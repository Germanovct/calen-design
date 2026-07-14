import React, { useEffect } from 'react';
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

  // Close drawer on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
              backgroundColor: 'var(--black)',
              zIndex: 1000,
            }}
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.22 }}
            role="dialog"
            aria-modal="true"
            aria-label="Carrito de compras"
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: '100%',
              maxWidth: '440px',
              height: '100%',
              backgroundColor: 'var(--base-dark)',
              borderLeft: 'var(--border-brutal)',
              zIndex: 1001,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* ── HEADER ── */}
            <div style={{
              padding: '24px 28px',
              borderBottom: '1px solid var(--gray-mid)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <h2 style={{
                  fontFamily: "var(--display)",
                  fontSize: '18px',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--white)',
                }}>
                  CARRITO
                </h2>
                <span style={{
                  fontFamily: "var(--display)",
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  color: 'var(--gray-text)',
                  textTransform: 'uppercase',
                }}>
                  {getTotalItems()} ÍTEM{getTotalItems() !== 1 ? 'S' : ''}
                </span>
              </div>
              <button
                onClick={onClose}
                aria-label="Cerrar carrito"
                style={{
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--gray-mid)',
                  color: 'var(--gray-text)',
                  fontSize: '20px',
                  transition: 'var(--transition)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-red)';
                  e.currentTarget.style.color = 'var(--accent-red)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--gray-mid)';
                  e.currentTarget.style.color = 'var(--gray-text)';
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
                  color: 'var(--gray-text)',
                }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  <p style={{
                    fontFamily: "var(--display)",
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    fontSize: '13px',
                    letterSpacing: '0.12em',
                    color: 'var(--gray-text-light)',
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
                        borderBottom: '1px solid var(--gray-mid)',
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
                          border: '1px solid var(--gray-mid)',
                        }}
                      />
                      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{
                          fontSize: '13px',
                          fontFamily: "var(--display)",
                          fontWeight: 900,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          color: 'var(--white)',
                          marginBottom: '4px',
                        }}>
                          {item.product.name}
                        </h3>
                        <span style={{
                          fontSize: '11px',
                          fontFamily: "var(--display)",
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: 'var(--gray-text)',
                          letterSpacing: '0.08em',
                          marginBottom: '12px',
                        }}>
                          T: {item.variant.size} · C: {item.variant.color}
                        </span>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                          {/* Qty */}
                          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--gray-mid)' }}>
                            <button
                              onClick={() => updateQuantity(item.variant.id, item.quantity - 1)}
                              aria-label="Disminuir cantidad"
                              style={{
                                width: '28px', height: '28px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                borderRight: '1px solid var(--gray-mid)',
                                fontWeight: 900, color: 'var(--gray-text)', fontSize: '14px',
                                transition: 'var(--transition)',
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-red)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--gray-text)'; }}
                            >−</button>
                            <span style={{
                              width: '32px', textAlign: 'center',
                              fontSize: '12px', fontWeight: 900,
                              fontFamily: "var(--display)",
                              color: 'var(--white)',
                            }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                              aria-label="Aumentar cantidad"
                              style={{
                                width: '28px', height: '28px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                borderLeft: '1px solid var(--gray-mid)',
                                fontWeight: 900, color: 'var(--gray-text)', fontSize: '14px',
                                transition: 'var(--transition)',
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-lima)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--gray-text)'; }}
                            >+</button>
                          </div>

                          <button
                            onClick={() => removeItem(item.variant.id)}
                            aria-label="Eliminar del carrito"
                            style={{
                              fontSize: '11px',
                              fontFamily: "var(--display)",
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '0.1em',
                              color: 'var(--gray-text)',
                              textDecoration: 'underline',
                              textUnderlineOffset: '2px',
                              transition: 'var(--transition)',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-red)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--gray-text)'; }}
                          >
                            ELIMINAR
                          </button>
                        </div>
                      </div>

                      {/* Precio del ítem */}
                      <div style={{
                        fontWeight: 900,
                        fontFamily: "var(--display)",
                        fontSize: '15px',
                        color: 'var(--accent-red)',
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
                borderTop: '1px solid var(--gray-mid)',
                backgroundColor: 'var(--base-dark)',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: '20px',
                }}>
                  <span style={{
                    fontFamily: "var(--display)",
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: 'var(--gray-text)',
                  }}>
                    SUBTOTAL
                  </span>
                  <span style={{
                    fontFamily: "var(--display)",
                    fontSize: '28px',
                    fontWeight: 900,
                    color: 'var(--white)',
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
                    fontFamily: "var(--display)",
                    fontWeight: 900,
                    fontSize: '13px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    backgroundColor: 'var(--white)',
                    color: 'var(--black)',
                    border: 'var(--border-brutal)',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--accent-red)';
                    e.currentTarget.style.color = 'var(--white)';
                    e.currentTarget.style.borderColor = 'var(--accent-red)';
                    e.currentTarget.style.transform = 'translate(-2px, -2px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-brutal-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--white)';
                    e.currentTarget.style.color = 'var(--black)';
                    e.currentTarget.style.borderColor = 'var(--white)';
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
