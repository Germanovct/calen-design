import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Account = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, login, register, loading, error, checkUser } = useAuth();
  
  const redirectTarget = searchParams.get('redirect');

  // Tab state: 'login' | 'register'
  const [activeTab, setActiveTab] = useState('login');

  // Form states
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });

  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Verificar si ya hay una sesión activa
    checkUser();
  }, []);

  useEffect(() => {
    // Si ya está logueado y hay redirección pendiente, redirigir
    if (user) {
      if (redirectTarget === 'checkout') {
        navigate('/checkout');
      }
    }
  }, [user, redirectTarget]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await login(loginForm.email, loginForm.password);
      if (redirectTarget === 'checkout') {
        navigate('/checkout');
      } else {
        navigate('/');
      }
    } catch (err) {
      setFormError(err.message || 'Error al iniciar sesión.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');
    try {
      await register(
        registerForm.name,
        registerForm.email,
        registerForm.password,
        registerForm.phone,
        registerForm.address
      );
      setSuccessMessage('¡Usuario registrado con éxito! Por favor inicia sesión.');
      setActiveTab('login');
      // Limpiar formulario de registro
      setRegisterForm({ name: '', email: '', password: '', phone: '', address: '' });
    } catch (err) {
      setFormError(err.message || 'Error en registro.');
    }
  };

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  };

  return (
    <div className="container" style={{ padding: '60px 24px 100px 24px', maxWidth: '520px', backgroundColor: '#FFFFFF' }}>
      
      {/* 1. MOCK DASHBOARD FOR AUTHENTICATED USER */}
      {user ? (
        <div style={{
          backgroundColor: 'var(--white)',
          padding: '40px',
          borderRadius: '0px',
          border: 'var(--border-brutal)',
          boxShadow: 'var(--shadow-brutal-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '36px', fontFamily: 'var(--display)', fontWeight: '900', marginBottom: '8px', textTransform: 'uppercase' }}>Mi Cuenta</h1>
            <p style={{ color: 'var(--black)', fontFamily: 'var(--display)', fontWeight: '800', textTransform: 'uppercase', fontSize: '14px' }}>¡Hola, {user.name}!</p>
          </div>

          <div style={{ height: '3px', backgroundColor: 'var(--black)' }} />

          {/* User info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '15px', fontWeight: '700' }}>
            <p><strong style={{ fontFamily: 'var(--display)', textTransform: 'uppercase' }}>Email:</strong> {user.email}</p>
            {user.phone && <p><strong style={{ fontFamily: 'var(--display)', textTransform: 'uppercase' }}>Teléfono:</strong> {user.phone}</p>}
            {user.address && <p><strong style={{ fontFamily: 'var(--display)', textTransform: 'uppercase' }}>Dirección:</strong> {user.address}</p>}
            <p><strong style={{ fontFamily: 'var(--display)', textTransform: 'uppercase' }}>Rol de cuenta:</strong> <span className="badge badge-customer">{user.role}</span></p>
          </div>

          <div style={{ height: '3px', backgroundColor: 'var(--black)' }} />

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
            <Link to="/mi-cuenta/pedidos" className="brutal-btn brutal-btn-black" style={{ textAlign: 'center', display: 'block' }}>
              Ver Mis Pedidos
            </Link>
            
            {user.role === 'admin' && (
              <Link to="/admin" className="brutal-btn brutal-btn-pink" style={{ textAlign: 'center', display: 'block' }}>
                Panel de Administración
              </Link>
            )}
          </div>
        </div>
      ) : (
        /* 2. AUTHENTICATION TABS */
        <div style={{
          backgroundColor: 'var(--white)',
          borderRadius: '0px',
          border: 'var(--border-brutal)',
          boxShadow: 'var(--shadow-brutal-lg)',
          overflow: 'hidden'
        }}>
          {/* Tab Selector */}
          <div style={{ display: 'flex', borderBottom: 'var(--border-brutal-sm)' }}>
            <button
              onClick={() => { setActiveTab('login'); setFormError(''); }}
              style={{
                flex: 1,
                padding: '18px',
                textAlign: 'center',
                fontWeight: '900',
                fontFamily: 'var(--display)',
                textTransform: 'uppercase',
                fontSize: '14px',
                borderRight: 'var(--border-brutal-sm)',
                backgroundColor: activeTab === 'login' ? 'var(--primary-yellow)' : 'var(--white)',
                color: 'var(--black)'
              }}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => { setActiveTab('register'); setFormError(''); }}
              style={{
                flex: 1,
                padding: '18px',
                textAlign: 'center',
                fontWeight: '900',
                fontFamily: 'var(--display)',
                textTransform: 'uppercase',
                fontSize: '14px',
                backgroundColor: activeTab === 'register' ? 'var(--primary-pink)' : 'var(--white)',
                color: 'var(--black)'
              }}
            >
              Registrarse
            </button>
          </div>

          <div style={{ padding: '32px' }}>
            {error || formError ? (
              <div style={{
                padding: '12px',
                backgroundColor: 'var(--primary-pink)',
                color: 'var(--black)',
                border: '2px solid var(--black)',
                fontSize: '13px',
                fontFamily: 'var(--display)',
                textTransform: 'uppercase',
                fontWeight: '900',
                borderRadius: '0px',
                marginBottom: '20px',
                boxShadow: '2px 2px 0px #000000'
              }}>
                {formError || error}
              </div>
            ) : null}

            {successMessage && (
              <div style={{
                padding: '12px',
                backgroundColor: 'var(--primary-yellow)',
                color: 'var(--black)',
                border: '2px solid var(--black)',
                fontSize: '13px',
                fontFamily: 'var(--display)',
                textTransform: 'uppercase',
                fontWeight: '900',
                borderRadius: '0px',
                marginBottom: '20px',
                boxShadow: '2px 2px 0px #000000'
              }}>
                {successMessage}
              </div>
            )}

            {/* LOGIN FORM */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>Email *</label>
                  <input type="email" name="email" value={loginForm.email} onChange={handleLoginChange} required className="brutal-input" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>Contraseña *</label>
                  <input type="password" name="password" value={loginForm.password} onChange={handleLoginChange} required className="brutal-input" />
                </div>
                
                <button type="submit" disabled={loading} className="brutal-btn brutal-btn-black" style={{ width: '100%', marginTop: '12px' }}>
                  {loading ? 'INGRESANDO...' : 'ENTRAR'}
                </button>
              </form>
            )}

            {/* REGISTER FORM */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>Nombre Completo *</label>
                  <input type="text" name="name" value={registerForm.name} onChange={handleRegisterChange} required className="brutal-input" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>Email *</label>
                  <input type="email" name="email" value={registerForm.email} onChange={handleRegisterChange} required className="brutal-input" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>Contraseña *</label>
                  <input type="password" name="password" value={registerForm.password} onChange={handleRegisterChange} required className="brutal-input" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>Teléfono (Opcional)</label>
                  <input type="tel" name="phone" value={registerForm.phone} onChange={handleRegisterChange} className="brutal-input" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>Dirección de Envío (Opcional)</label>
                  <input type="text" name="address" value={registerForm.address} onChange={handleRegisterChange} className="brutal-input" />
                </div>

                <button type="submit" disabled={loading} className="brutal-btn brutal-btn-pink" style={{ width: '100%', marginTop: '12px' }}>
                  {loading ? 'CREANDO CUENTA...' : 'CREAR CUENTA'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
