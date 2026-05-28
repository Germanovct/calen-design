import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// ── Ícono ojito ────────────────────────────────────────────────────
const EyeIcon = ({ open }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

// ── Campo de input reutilizable ────────────────────────────────────
const Field = ({ label, required, type = 'text', name, value, onChange, placeholder, rightSlot }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <label style={{
      fontFamily: "'Space Grotesk', sans-serif",
      fontSize: '11px',
      fontWeight: 700,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: '#888',
    }}>
      {label}{required && <span style={{ color: '#FF2D2D', marginLeft: '3px' }}>*</span>}
    </label>
    <div style={{ position: 'relative' }}>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={name === 'password' || name === 'confirmPassword' ? 'current-password' : name}
        style={{
          width: '100%',
          padding: rightSlot ? '14px 48px 14px 16px' : '14px 16px',
          backgroundColor: '#1A1A1A',
          border: '1px solid #333',
          color: '#FFFFFF',
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '15px',
          fontWeight: 500,
          outline: 'none',
          boxSizing: 'border-box',
          transition: 'border-color 0.2s',
        }}
        onFocus={e => { e.target.style.borderColor = '#FFFFFF'; }}
        onBlur={e => { e.target.style.borderColor = '#333'; }}
      />
      {rightSlot && (
        <div style={{
          position: 'absolute', right: '14px', top: '50%',
          transform: 'translateY(-50%)',
          color: '#555', cursor: 'pointer', display: 'flex', alignItems: 'center',
        }}>
          {rightSlot}
        </div>
      )}
    </div>
  </div>
);

// ── Mensaje de error ───────────────────────────────────────────────
const ErrorMsg = ({ msg }) => msg ? (
  <div style={{
    padding: '12px 16px',
    backgroundColor: 'rgba(255, 45, 45, 0.08)',
    border: '1px solid #FF2D2D',
    color: '#FF2D2D',
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '13px',
    fontWeight: 700,
    letterSpacing: '0.04em',
    borderRadius: '2px',
  }}>
    {msg}
  </div>
) : null;

// ── Mensaje de éxito ───────────────────────────────────────────────
const SuccessMsg = ({ msg }) => msg ? (
  <div style={{
    padding: '12px 16px',
    backgroundColor: 'rgba(0, 200, 83, 0.08)',
    border: '1px solid #00C853',
    color: '#00C853',
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '13px',
    fontWeight: 700,
    letterSpacing: '0.04em',
    borderRadius: '2px',
  }}>
    {msg}
  </div>
) : null;

// ── Botón principal ────────────────────────────────────────────────
const PrimaryBtn = ({ children, loading, onClick, type = 'submit', accent = false }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={loading}
    style={{
      width: '100%',
      padding: '16px',
      backgroundColor: accent ? '#FF2D2D' : '#FFFFFF',
      color: accent ? '#FFFFFF' : '#0A0A0A',
      fontFamily: "'Space Grotesk', sans-serif",
      fontWeight: 900,
      fontSize: '13px',
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      border: 'none',
      cursor: loading ? 'not-allowed' : 'pointer',
      opacity: loading ? 0.6 : 1,
      transition: 'opacity 0.2s, transform 0.1s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
    }}
    onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.88'; }}
    onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
  >
    {loading && (
      <span style={{
        width: '14px', height: '14px', border: '2px solid currentColor',
        borderTopColor: 'transparent', borderRadius: '50%',
        animation: 'spin 0.7s linear infinite', display: 'inline-block',
      }} />
    )}
    {children}
  </button>
);

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════
const Account = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, login, register, loading, error, checkUser } = useAuth();

  const redirectTarget = searchParams.get('redirect');

  const [activeTab, setActiveTab] = useState('login');

  const [loginForm, setLoginForm]       = useState({ email: '', password: '' });
  const [showLoginPwd, setShowLoginPwd] = useState(false);

  const [registerForm, setRegisterForm]   = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showRegPwd, setShowRegPwd]       = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);

  const [formError, setFormError]       = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => { checkUser(); }, []);

  useEffect(() => {
    if (user) {
      if (redirectTarget === 'checkout') navigate('/checkout');
    }
  }, [user, redirectTarget]);

  // ── Limpiar errores al cambiar de tab ──
  const switchTab = (tab) => {
    setActiveTab(tab);
    setFormError('');
    setSuccessMessage('');
  };

  // ── Login ──────────────────────────────────────────────────────
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await login(loginForm.email, loginForm.password);
      if (redirectTarget === 'checkout') navigate('/checkout');
      else navigate('/');
    } catch (err) {
      setFormError(err.message || 'Email o contraseña incorrectos.');
    }
  };

  // ── Registro ────────────────────────────────────────────────────
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    if (registerForm.password !== registerForm.confirmPassword) {
      setFormError('Las contraseñas no coinciden.');
      return;
    }
    if (registerForm.password.length < 6) {
      setFormError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      await register(registerForm.name, registerForm.email, registerForm.password);
      setSuccessMessage('¡Cuenta creada! Ya podés iniciar sesión.');
      setRegisterForm({ name: '', email: '', password: '', confirmPassword: '' });
      // No redirigir — mantener en tab registro con el mensaje
    } catch (err) {
      setFormError(err.message || 'Error al crear la cuenta. Intentá de nuevo.');
    }
  };

  // ── Shared style ───────────────────────────────────────────────
  const pageStyle = {
    minHeight: '100vh',
    backgroundColor: '#0A0A0A',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '80px 24px 120px 24px',
  };

  const cardStyle = {
    width: '100%',
    maxWidth: '480px',
    backgroundColor: '#111',
    border: '1px solid #1E1E1E',
  };

  // ═══════════════════════════════════════════════════════════════
  // VISTA: Usuario autenticado
  // ═══════════════════════════════════════════════════════════════
  if (user) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          {/* Header */}
          <div style={{
            padding: '40px 40px 32px 40px',
            borderBottom: '1px solid #1E1E1E',
          }}>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '11px', fontWeight: 700,
              letterSpacing: '0.25em', color: '#FF2D2D',
              textTransform: 'uppercase', display: 'block', marginBottom: '12px',
            }}>— Mi cuenta</span>
            <h1 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '40px', fontWeight: 900,
              color: '#FFFFFF', textTransform: 'uppercase',
              letterSpacing: '-0.02em', lineHeight: 1,
            }}>
              Hola, {user.name?.split(' ')[0] || 'Usuaria'} 👋
            </h1>
          </div>

          {/* Info */}
          <div style={{ padding: '32px 40px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { label: 'Email', val: user.email },
              { label: 'Teléfono', val: user.phone },
              { label: 'Dirección', val: user.address },
              { label: 'Rol', val: user.role },
            ].filter(r => r.val).map(row => (
              <div key={row.label} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '10px', fontWeight: 700,
                  letterSpacing: '0.2em', color: '#555',
                  textTransform: 'uppercase',
                }}>{row.label}</span>
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '14px', fontWeight: 500, color: '#FFFFFF',
                }}>{row.val}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ padding: '0 40px 40px 40px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link to="/mi-cuenta/pedidos" style={{
              display: 'block', width: '100%', padding: '16px',
              backgroundColor: '#FFFFFF', color: '#0A0A0A',
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 900, fontSize: '13px', letterSpacing: '0.2em',
              textTransform: 'uppercase', textDecoration: 'none', textAlign: 'center',
              boxSizing: 'border-box',
            }}>Ver mis pedidos</Link>

            {user.role === 'admin' && (
              <Link to="/admin" style={{
                display: 'block', width: '100%', padding: '16px',
                backgroundColor: 'transparent', color: '#FFFFFF',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 900, fontSize: '13px', letterSpacing: '0.2em',
                textTransform: 'uppercase', textDecoration: 'none', textAlign: 'center',
                border: '1px solid #333', boxSizing: 'border-box',
              }}>Panel Admin</Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // VISTA: Auth (login / registro)
  // ═══════════════════════════════════════════════════════════════
  return (
    <div style={pageStyle}>
      <div style={cardStyle}>

        {/* ── Logo / Título ── */}
        <div style={{ padding: '48px 40px 0 40px', textAlign: 'center' }}>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '13px', fontWeight: 700,
            letterSpacing: '0.3em', color: '#555',
            textTransform: 'uppercase', marginBottom: '32px',
          }}>CALEN DESIGN</h1>
        </div>

        {/* ── Tabs ── */}
        <div style={{ display: 'flex', borderBottom: '1px solid #1E1E1E', margin: '0 40px' }}>
          {['login', 'register'].map(tab => {
            const label = tab === 'login' ? 'Ingresar' : 'Crear cuenta';
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => switchTab(tab)}
                style={{
                  flex: 1,
                  padding: '16px 0',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '12px', fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: isActive ? '#FFFFFF' : '#444',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '2px solid #FFFFFF' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  marginBottom: '-1px',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* ── Form area ── */}
        <div style={{ padding: '32px 40px 48px 40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          <ErrorMsg msg={formError || error} />
          <SuccessMsg msg={successMessage} />

          {/* ── LOGIN ── */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <Field
                label="Email" required
                type="email" name="email"
                value={loginForm.email}
                onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                placeholder="tu@email.com"
              />
              <Field
                label="Contraseña" required
                type={showLoginPwd ? 'text' : 'password'}
                name="password"
                value={loginForm.password}
                onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="••••••••"
                rightSlot={
                  <span onClick={() => setShowLoginPwd(v => !v)}>
                    <EyeIcon open={showLoginPwd} />
                  </span>
                }
              />

              <div style={{ marginTop: '4px' }}>
                <PrimaryBtn loading={loading}>
                  {loading ? 'Ingresando...' : 'Ingresar'}
                </PrimaryBtn>
              </div>

              <p style={{
                textAlign: 'center',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '12px', color: '#444',
                marginTop: '4px',
              }}>
                ¿No tenés cuenta?{' '}
                <span
                  onClick={() => switchTab('register')}
                  style={{ color: '#FFFFFF', cursor: 'pointer', fontWeight: 700, textDecoration: 'underline' }}
                >
                  Créala gratis
                </span>
              </p>
            </form>
          )}

          {/* ── REGISTRO ── */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <Field
                label="Nombre completo" required
                type="text" name="name"
                value={registerForm.name}
                onChange={e => setRegisterForm({ ...registerForm, name: e.target.value })}
                placeholder="Valentina García"
              />
              <Field
                label="Email" required
                type="email" name="email"
                value={registerForm.email}
                onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })}
                placeholder="tu@email.com"
              />
              <Field
                label="Contraseña" required
                type={showRegPwd ? 'text' : 'password'}
                name="password"
                value={registerForm.password}
                onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })}
                placeholder="Mínimo 6 caracteres"
                rightSlot={
                  <span onClick={() => setShowRegPwd(v => !v)}>
                    <EyeIcon open={showRegPwd} />
                  </span>
                }
              />
              <Field
                label="Confirmar contraseña" required
                type={showRegConfirm ? 'text' : 'password'}
                name="confirmPassword"
                value={registerForm.confirmPassword}
                onChange={e => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                placeholder="Repetí tu contraseña"
                rightSlot={
                  <span onClick={() => setShowRegConfirm(v => !v)}>
                    <EyeIcon open={showRegConfirm} />
                  </span>
                }
              />

              {/* Indicador de coincidencia */}
              {registerForm.confirmPassword.length > 0 && (
                <p style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '11px', fontWeight: 700,
                  color: registerForm.password === registerForm.confirmPassword ? '#00C853' : '#FF2D2D',
                  letterSpacing: '0.08em',
                  marginTop: '-8px',
                }}>
                  {registerForm.password === registerForm.confirmPassword
                    ? '✓ Las contraseñas coinciden'
                    : '✗ Las contraseñas no coinciden'}
                </p>
              )}

              <div style={{ marginTop: '4px' }}>
                <PrimaryBtn loading={loading} accent>
                  {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                </PrimaryBtn>
              </div>

              <p style={{
                textAlign: 'center',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '12px', color: '#444',
                marginTop: '4px',
              }}>
                ¿Ya tenés cuenta?{' '}
                <span
                  onClick={() => switchTab('login')}
                  style={{ color: '#FFFFFF', cursor: 'pointer', fontWeight: 700, textDecoration: 'underline' }}
                >
                  Ingresá acá
                </span>
              </p>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Account;
