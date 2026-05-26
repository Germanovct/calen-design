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
    <div className="container" style={{ padding: '60px 24px 80px 24px', maxWidth: '520px' }}>
      
      {/* 1. MOCK DASHBOARD FOR AUTHENTICATED USER */}
      {user ? (
        <div style={{
          backgroundColor: 'var(--white)',
          padding: '40px',
          borderRadius: 'var(--border-radius)',
          border: '1px solid var(--gray-light)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '32px', fontFamily: 'var(--serif)', marginBottom: '8px' }}>Mi Cuenta</h1>
            <p style={{ color: 'var(--gray-medium)', fontSize: '14px' }}>¡Hola, {user.name}!</p>
          </div>

          <div style={{ height: '1px', backgroundColor: 'var(--gray-light)' }} />

          {/* User info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '15px' }}>
            <p><strong>Email:</strong> {user.email}</p>
            {user.phone && <p><strong>Teléfono:</strong> {user.phone}</p>}
            {user.address && <p><strong>Dirección:</strong> {user.address}</p>}
            <p><strong>Rol de cuenta:</strong> <span style={{ textTransform: 'uppercase', fontSize: '13px', fontWeight: '600', color: user.role === 'admin' ? 'var(--primary-pink)' : 'var(--dark-black)' }}>{user.role}</span></p>
          </div>

          <div style={{ height: '1px', backgroundColor: 'var(--gray-light)' }} />

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
            <Link to="/mi-cuenta/pedidos" className="btn-primary" style={{ textAlign: 'center', display: 'block' }}>
              Ver Mis Pedidos
            </Link>
            
            {user.role === 'admin' && (
              <Link to="/admin" className="btn-secondary" style={{ textAlign: 'center', display: 'block' }}>
                Panel de Administración
              </Link>
            )}
          </div>
        </div>
      ) : (
        /* 2. AUTHENTICATION TABS */
        <div style={{
          backgroundColor: 'var(--white)',
          borderRadius: 'var(--border-radius)',
          border: '1px solid var(--gray-light)',
          overflow: 'hidden'
        }}>
          {/* Tab Selector */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--gray-light)' }}>
            <button
              onClick={() => { setActiveTab('login'); setFormError(''); }}
              style={{
                flex: 1,
                padding: '16px',
                textAlign: 'center',
                fontWeight: '600',
                fontSize: '14px',
                borderBottom: activeTab === 'login' ? '3px solid var(--primary-pink)' : 'none',
                backgroundColor: activeTab === 'login' ? 'var(--white)' : 'var(--bg-light)',
                color: activeTab === 'login' ? 'var(--dark-black)' : 'var(--gray-medium)'
              }}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => { setActiveTab('register'); setFormError(''); }}
              style={{
                flex: 1,
                padding: '16px',
                textAlign: 'center',
                fontWeight: '600',
                fontSize: '14px',
                borderBottom: activeTab === 'register' ? '3px solid var(--primary-pink)' : 'none',
                backgroundColor: activeTab === 'register' ? 'var(--white)' : 'var(--bg-light)',
                color: activeTab === 'register' ? 'var(--dark-black)' : 'var(--gray-medium)'
              }}
            >
              Registrarse
            </button>
          </div>

          <div style={{ padding: '32px' }}>
            {error || formError ? (
              <div style={{
                padding: '10px',
                backgroundColor: '#F8D7DA',
                color: '#721C24',
                fontSize: '13px',
                borderRadius: '4px',
                marginBottom: '20px',
                fontWeight: '500'
              }}>
                {formError || error}
              </div>
            ) : null}

            {successMessage && (
              <div style={{
                padding: '10px',
                backgroundColor: '#D4EDDA',
                color: '#155724',
                fontSize: '13px',
                borderRadius: '4px',
                marginBottom: '20px',
                fontWeight: '500'
              }}>
                {successMessage}
              </div>
            )}

            {/* LOGIN FORM */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600' }}>Email *</label>
                  <input type="email" name="email" value={loginForm.email} onChange={handleLoginChange} required style={{ padding: '10px', border: '1px solid var(--gray-light)', borderRadius: '4px' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600' }}>Contraseña *</label>
                  <input type="password" name="password" value={loginForm.password} onChange={handleLoginChange} required style={{ padding: '10px', border: '1px solid var(--gray-light)', borderRadius: '4px' }} />
                </div>
                
                <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: '12px', opacity: loading ? 0.5 : 1 }}>
                  {loading ? 'Ingresando...' : 'Entrar'}
                </button>
              </form>
            )}

            {/* REGISTER FORM */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600' }}>Nombre Completo *</label>
                  <input type="text" name="name" value={registerForm.name} onChange={handleRegisterChange} required style={{ padding: '10px', border: '1px solid var(--gray-light)', borderRadius: '4px' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600' }}>Email *</label>
                  <input type="email" name="email" value={registerForm.email} onChange={handleRegisterChange} required style={{ padding: '10px', border: '1px solid var(--gray-light)', borderRadius: '4px' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600' }}>Contraseña *</label>
                  <input type="password" name="password" value={registerForm.password} onChange={handleRegisterChange} required style={{ padding: '10px', border: '1px solid var(--gray-light)', borderRadius: '4px' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600' }}>Teléfono (Opcional)</label>
                  <input type="tel" name="phone" value={registerForm.phone} onChange={handleRegisterChange} style={{ padding: '10px', border: '1px solid var(--gray-light)', borderRadius: '4px' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600' }}>Dirección de Envío (Opcional)</label>
                  <input type="text" name="address" value={registerForm.address} onChange={handleRegisterChange} style={{ padding: '10px', border: '1px solid var(--gray-light)', borderRadius: '4px' }} />
                </div>

                <button type="submit" disabled={loading} className="btn-secondary" style={{ width: '100%', marginTop: '12px', opacity: loading ? 0.5 : 1 }}>
                  {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
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
