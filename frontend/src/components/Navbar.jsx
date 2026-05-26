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
        borderBottom: '1px solid var(--gray-light)',
        position: 'sticky',
        top: 0,
        zIndex: 99,
        transition: 'var(--transition)'
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '76px'
        }}>
          {/* Logo */}
          <Link to="/" style={{
            fontFamily: 'var(--serif)',
            fontSize: '28px',
            fontWeight: '600',
            color: 'var(--dark-black)',
            letterSpacing: '0.5px'
          }}>
            Calen Design
          </Link>

          {/* Menú de Navegación */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '28px'
          }}>
            <Link to="/" style={{ fontSize: '14px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Inicio
            </Link>
            <Link to="/productos" style={{ fontSize: '14px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Catálogo
            </Link>

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {user.role === 'admin' ? (
                  <Link to="/admin" style={{ fontSize: '13px', fontWeight: '600', color: 'var(--primary-pink)', border: '1px solid var(--primary-pink)', padding: '6px 12px', borderRadius: '4px' }}>
                    Panel Admin
                  </Link>
                ) : (
                  <Link to="/mi-cuenta/pedidos" style={{ fontSize: '14px', fontWeight: '500' }}>
                    Mis Pedidos
                  </Link>
                )}
                <span style={{ fontSize: '13px', color: 'var(--gray-medium)' }}>Hola, {user.name}</span>
                <button onClick={handleLogout} style={{ fontSize: '13px', color: 'var(--gray-medium)', textDecoration: 'underline' }}>
                  Salir
                </button>
              </div>
            ) : (
              <Link to="/mi-cuenta" style={{ fontSize: '14px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Ingresar
              </Link>
            )}

            {/* Cart Icon trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                padding: '4px'
              }}
              aria-label="Ver carrito"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {getTotalItems() > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  backgroundColor: 'var(--primary-pink)',
                  color: 'var(--dark-black)',
                  fontSize: '10px',
                  fontWeight: '700',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
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
