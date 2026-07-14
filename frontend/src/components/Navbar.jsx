import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCartStore } from '../store/cartStore';
import CartDrawer from './CartDrawer';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { getTotalItems } = useCartStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      <header style={{
        backgroundColor: '#0A0A0A',
        borderBottom: '2px solid #FF2D2D',
        position: 'sticky',
        top: '36px', /* debajo de la barra de beneficios */
        zIndex: 99,
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '72px',
        }}>

          {/* ── LOGO ── */}
          <Link to="/" style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '22px',
            fontWeight: 900,
            color: '#FFFFFF',
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            lineHeight: 1,
          }}>
            CALEN<span style={{ color: '#FF2D2D', margin: '0 3px' }}>·</span>DESIGN
          </Link>

          {/* ── REFERENCIA EDITORIAL ── */}
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.2em',
            color: '#333',
            textTransform: 'uppercase',
            display: 'none', /* oculto en mobile */
          }}
            className="nav-edition-ref"
          >
            COL. 01 — 2026
          </span>

          {/* ── NAV CONTROL CONTAINER ── */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Desktop Navigation Links */}
            <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
              <Link to="/" className="nav-link">INICIO</Link>
              <Link to="/productos" className="nav-link">CATÁLOGO</Link>
              <Link to="/archivo" className="nav-link">ARCHIVO</Link>

              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  {user.role === 'admin' ? (
                    <Link
                      to="/admin"
                      className="badge badge-admin"
                      style={{ fontSize: '10px', textDecoration: 'none', letterSpacing: '0.12em' }}
                    >
                      ADMIN
                    </Link>
                  ) : (
                    <Link to="/mi-cuenta/pedidos" className="nav-link">MIS PEDIDOS</Link>
                  )}
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    fontFamily: "'Space Grotesk', sans-serif",
                    textTransform: 'uppercase',
                    color: 'var(--gray-text)',
                    letterSpacing: '0.08em',
                  }}>
                    {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      fontFamily: "'Space Grotesk', sans-serif",
                      textTransform: 'uppercase',
                      color: '#FF2D2D',
                      letterSpacing: '0.08em',
                      textDecoration: 'underline',
                      textDecorationColor: 'rgba(255,45,45,0.3)',
                      textUnderlineOffset: '3px',
                    }}
                  >
                    SALIR
                  </button>
                </div>
              ) : (
                <Link to="/mi-cuenta" className="nav-link">INGRESAR</Link>
              )}
            </div>

            {/* ── CART BUTTON (Always visible) ── */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Ver carrito"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                padding: '8px 10px',
                border: '1px solid #2A2A2A',
                backgroundColor: 'transparent',
                color: '#FFFFFF',
                transition: 'all 0.18s ease',
                gap: '8px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#FF2D2D';
                e.currentTarget.style.color = '#FF2D2D';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#2A2A2A';
                e.currentTarget.style.color = '#FFFFFF';
              }}
            >
              {/* Cart icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>

              {getTotalItems() > 0 && (
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '11px',
                  fontWeight: 900,
                  color: '#FF2D2D',
                  letterSpacing: '0.05em',
                }}>
                  {getTotalItems()}
                </span>
              )}
            </button>

            {/* ── MOBILE MENU TOGGLE BUTTON (Mobile only) ── */}
            <button
              className="nav-mobile-toggle"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                border: '1px solid #2A2A2A',
                backgroundColor: 'transparent',
                color: '#FFFFFF',
                transition: 'all 0.18s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#FF2D2D';
                e.currentTarget.style.color = '#FF2D2D';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#2A2A2A';
                e.currentTarget.style.color = '#FFFFFF';
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </nav>
        </div>
      </header>

      {/* ── MOBILE DRAWER OVERLAY ── */}
      {menuOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: 'rgba(10, 10, 10, 0.98)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          padding: '40px',
        }}>
          {/* Close button */}
          <button 
            onClick={() => setMenuOpen(false)} 
            aria-label="Cerrar menú"
            style={{
              alignSelf: 'flex-end',
              color: '#FFFFFF',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              marginBottom: '40px',
              padding: '8px',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* Links */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '24px',
            fontWeight: 900,
            letterSpacing: '0.08em',
          }}>
            <Link to="/" onClick={() => setMenuOpen(false)} style={{ color: '#FFFFFF' }}>INICIO</Link>
            <Link to="/productos" onClick={() => setMenuOpen(false)} style={{ color: '#FFFFFF' }}>CATÁLOGO</Link>
            <Link to="/archivo" onClick={() => setMenuOpen(false)} style={{ color: '#FFFFFF' }}>ARCHIVO</Link>

            <div style={{ height: '1px', backgroundColor: '#222', margin: '20px 0' }} />

            {user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {user.role === 'admin' ? (
                  <Link to="/admin" onClick={() => setMenuOpen(false)} style={{ color: '#FF2D2D', fontSize: '20px' }}>ADMIN</Link>
                ) : (
                  <Link to="/mi-cuenta/pedidos" onClick={() => setMenuOpen(false)} style={{ color: '#FFFFFF', fontSize: '20px' }}>MIS PEDIDOS</Link>
                )}
                <span style={{ fontSize: '14px', color: 'var(--gray-text)', textTransform: 'uppercase' }}>{user.name}</span>
                <button 
                  onClick={() => { handleLogout(); setMenuOpen(false); }} 
                  style={{
                    textAlign: 'left',
                    color: '#FF2D2D',
                    fontSize: '14px',
                    textDecoration: 'underline',
                    padding: 0
                  }}
                >
                  SALIR
                </button>
              </div>
            ) : (
              <Link to="/mi-cuenta" onClick={() => setMenuOpen(false)} style={{ color: '#FFFFFF' }}>INGRESAR</Link>
            )}
          </div>
        </div>
      )}

      {/* Media query stylesheet block */}
      <style>{`
        @media (min-width: 768px) {
          .nav-edition-ref {
            display: block !important;
          }
          .nav-desktop {
            display: flex !important;
          }
          .nav-mobile-toggle {
            display: none !important;
          }
        }
        @media (max-width: 767px) {
          .nav-desktop {
            display: none !important;
          }
          .nav-mobile-toggle {
            display: flex !important;
          }
        }
      `}</style>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
