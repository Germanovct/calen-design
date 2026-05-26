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

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      <header style={{
        backgroundColor: 'var(--white)',
        borderBottom: 'var(--border-brutal)',
        position: 'sticky',
        top: 0,
        zIndex: 99,
        transition: 'var(--transition)'
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '80px'
        }}>
          {/* Logo */}
          <Link to="/" style={{
            fontFamily: 'var(--display)',
            fontSize: '32px',
            fontWeight: '900',
            color: 'var(--dark-black)',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            CALEN DESIGN
          </Link>

          {/* Menú de Navegación */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px'
          }}>
            <Link to="/" style={{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', fontFamily: 'var(--display)', letterSpacing: '0.5px' }}>
              INICIO
            </Link>
            <Link to="/productos" style={{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', fontFamily: 'var(--display)', letterSpacing: '0.5px' }}>
              CATÁLOGO
            </Link>

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {user.role === 'admin' ? (
                  <Link to="/admin" className="badge badge-admin" style={{ fontSize: '11px', textTransform: 'uppercase', textDecoration: 'none' }}>
                    PANEL ADMIN
                  </Link>
                ) : (
                  <Link to="/mi-cuenta/pedidos" style={{ fontSize: '14px', fontWeight: '800', fontFamily: 'var(--display)', textTransform: 'uppercase' }}>
                    MIS PEDIDOS
                  </Link>
                )}
                <span style={{ fontSize: '13px', fontWeight: '700', fontFamily: 'var(--display)', textTransform: 'uppercase' }}>
                  HOLA, {user.name}
                </span>
                <button onClick={handleLogout} style={{ fontSize: '13px', fontWeight: '800', fontFamily: 'var(--display)', textTransform: 'uppercase', textDecoration: 'underline' }}>
                  SALIR
                </button>
              </div>
            ) : (
              <Link to="/mi-cuenta" style={{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', fontFamily: 'var(--display)', letterSpacing: '0.5px' }}>
                INGRESAR
              </Link>
            )}

            {/* Cart Icon trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                padding: '8px',
                border: 'var(--border-brutal-sm)',
                boxShadow: '2px 2px 0px #000000',
                backgroundColor: 'var(--primary-yellow)',
                transition: 'var(--transition)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(-1px, -1px)';
                e.currentTarget.style.boxShadow = '3px 3px 0px #000000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '2px 2px 0px #000000';
              }}
              aria-label="Ver carrito"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {getTotalItems() > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  backgroundColor: 'var(--primary-pink)',
                  color: 'var(--dark-black)',
                  fontSize: '10px',
                  fontWeight: '900',
                  width: '20px',
                  height: '20px',
                  border: '2px solid var(--black)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {getTotalItems()}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Cart Slider Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
