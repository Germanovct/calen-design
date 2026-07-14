import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// ── Eye Icon Component ────────────────────────────────────────────
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

// ── Reusable Input Field ────────────────────────────────────────────
const Field = ({ label, required, type = 'text', name, value, onChange, placeholder, rightSlot, id }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <label htmlFor={id} style={{
      fontFamily: "var(--display)",
      fontSize: '11px',
      fontWeight: 700,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'var(--gray-text)',
    }}>
      {label}{required && <span style={{ color: 'var(--accent-red)', marginLeft: '3px' }}>*</span>}
    </label>
    <div style={{ position: 'relative' }}>
      <input
        id={id}
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
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--gray-mid)',
          color: 'var(--white)',
          fontFamily: "var(--display)",
          fontSize: '15px',
          fontWeight: 500,
          outline: 'none',
          boxSizing: 'border-box',
          transition: 'border-color 0.2s',
        }}
        onFocus={e => { e.target.style.borderColor = 'var(--white)'; }}
        onBlur={e => { e.target.style.borderColor = 'var(--gray-mid)'; }}
      />
      {rightSlot && (
        <div style={{
          position: 'absolute', right: '14px', top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--gray-text)', display: 'flex', alignItems: 'center',
        }}>
          {rightSlot}
        </div>
      )}
    </div>
  </div>
);

// ── Error Message ───────────────────────────────────────────────────
const ErrorMsg = ({ msg }) => msg ? (
  <div style={{
    padding: '12px 16px',
    backgroundColor: 'rgba(255, 45, 45, 0.08)',
    border: '1px solid var(--accent-red)',
    color: 'var(--accent-red)',
    fontFamily: "var(--display)",
    fontSize: '13px',
    fontWeight: 700,
    letterSpacing: '0.04em',
    borderRadius: '2px',
  }}>
    {msg}
  </div>
) : null;

// ── Success Message ─────────────────────────────────────────────────
const SuccessMsg = ({ msg }) => msg ? (
  <div style={{
    padding: '12px 16px',
    backgroundColor: 'rgba(0, 200, 83, 0.08)',
    border: '1px solid #00C853',
    color: '#00C853',
    fontFamily: "var(--display)",
    fontSize: '13px',
    fontWeight: 700,
    letterSpacing: '0.04em',
    borderRadius: '2px',
  }}>
    {msg}
  </div>
) : null;

// ── Primary Button ──────────────────────────────────────────────────
const PrimaryBtn = ({ children, loading, onClick, type = 'submit', accent = false }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={loading}
    style={{
      width: '100%',
      padding: '16px',
      backgroundColor: accent ? 'var(--accent-red)' : 'var(--white)',
      color: accent ? 'var(--white)' : 'var(--base-dark)',
      fontFamily: "var(--display)",
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

  // ── Clear errors on tab switch ──
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

  // ── Register ────────────────────────────────────────────────────
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
    } catch (err) {
      setFormError(err.message || 'Error al crear la cuenta. Intentá de nuevo.');
    }
  };

  // ── Shared styles ───────────────────────────────────────────────
  const pageStyle = {
    minHeight: '100vh',
    backgroundColor: 'var(--base-dark)',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '80px 24px 120px 24px',
  };

  const cardStyle = {
    width: '100%',
    maxWidth: '480px',
    backgroundColor: 'var(--bg-card)',
    border: 'var(--border-brutal)',
  };

  // ═══════════════════════════════════════════════════════════════
  // VIEW: Authenticated User
  // ═══════════════════════════════════════════════════════════════
  if (user) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          {/* Header */}
          <div style={{
            padding: '40px 40px 32px 40px',
            borderBottom: '1px solid var(--gray-mid)',
          }}>
            <span style={{
              fontFamily: "var(--display)",
              fontSize: '11px', fontWeight: 700,
              letterSpacing: '0.25em', color: 'var(--accent-red)',
              textTransform: 'uppercase', display: 'block', marginBottom: '12px',
            }}>— Mi cuenta</span>
            <h1 style={{
              fontFamily: "var(--display)",
              fontSize: '40px', fontWeight: 900,
              color: 'var(--white)', textTransform: 'uppercase',
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
                  fontFamily: "var(--display)",
                  fontSize: '10px', fontWeight: 700,
                  letterSpacing: '0.2em', color: 'var(--gray-text)',
                  textTransform: 'uppercase',
                }}>{row.label}</span>
                <span style={{
                  fontFamily: "var(--display)",
                  fontSize: '14px', fontWeight: 500, color: 'var(--white)',
                }}>{row.val}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ padding: '0 40px 40px 40px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link to="/mi-cuenta/pedidos" style={{
              display: 'block', width: '100%', padding: '16px',
              backgroundColor: 'var(--white)', color: 'var(--base-dark)',
              fontFamily: "var(--display)",
              fontWeight: 900, fontSize: '13px', letterSpacing: '0.2em',
              textTransform: 'uppercase', textDecoration: 'none', textAlign: 'center',
              boxSizing: 'border-box',
            }}>Ver mis pedidos</Link>

            {user.role === 'admin' && (
              <Link to="/admin" style={{
                display: 'block', width: '100%', padding: '16px',
                backgroundColor: 'transparent', color: 'var(--white)',
                fontFamily: "var(--display)",
                fontWeight: 900, fontSize: '13px', letterSpacing: '0.2em',
                textTransform: 'uppercase', textDecoration: 'none', textAlign: 'center',
                border: '1px solid var(--gray-mid)', boxSizing: 'border-box',
              }}>Panel Admin</Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // VIEW: Auth (login / register)
  // ═══════════════════════════════════════════════════════════════
  return (
    <div style={pageStyle}>
      <div style={cardStyle}>

        {/* Logo / Title */}
        <div style={{ padding: '48px 40px 0 40px', textAlign: 'center' }}>
          <h1 style={{
            fontFamily: "var(--display)",
            fontSize: '13px', fontWeight: 700,
            letterSpacing: '0.3em', color: 'var(--gray-text)',
            textTransform: 'uppercase', marginBottom: '32px',
          }}>CALEN DESIGN</h1>
        </div>

        {/* Tabs switcher */}
        <div role="tablist" style={{ display: 'flex', borderBottom: '1px solid var(--gray-mid)', margin: '0 40px' }}>
          {['login', 'register'].map(tab => {
            const label = tab === 'login' ? 'Ingresar' : 'Crear cuenta';
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                role="tab"
                aria-selected={isActive}
                onClick={() => switchTab(tab)}
                style={{
                  flex: 1,
                  padding: '16px 0',
                  fontFamily: "var(--display)",
                  fontSize: '12px', fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: isActive ? 'var(--white)' : 'var(--gray-text)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '2px solid var(--white)' : '2px solid transparent',
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

        {/* Form area */}
        <div style={{ padding: '32px 40px 48px 40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          <ErrorMsg msg={formError || error} />
          <SuccessMsg msg={successMessage} />

          {/* ── LOGIN ── */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <Field
                id="login-email"
                label="Email" required
                type="email" name="email"
                value={loginForm.email}
                onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                placeholder="tu@email.com"
              />
              <Field
                id="login-password"
                label="Contraseña" required
                type={showLoginPwd ? 'text' : 'password'}
                name="password"
                value={loginForm.password}
                onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="••••••••"
                rightSlot={
                  <button 
                    type="button" 
                    onClick={() => setShowLoginPwd(v => !v)}
                    aria-label={showLoginPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'inherit',
                      padding: 0,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <EyeIcon open={showLoginPwd} />
                  </button>
                }
              />

              <div style={{ marginTop: '4px' }}>
                <PrimaryBtn loading={loading}>
                  {loading ? 'Ingresando...' : 'Ingresar'}
                </PrimaryBtn>
              </div>

              <p style={{
                textAlign: 'center',
                fontFamily: "var(--display)",
                fontSize: '12px', color: 'var(--gray-text)',
                marginTop: '4px',
              }}>
                ¿No tenés cuenta?{' '}
                <button
                  type="button"
                  onClick={() => switchTab('register')}
                  style={{ 
                    color: 'var(--white)', 
                    cursor: 'pointer', 
                    fontWeight: 700, 
                    textDecoration: 'underline',
                    background: 'none',
                    border: 'none',
                    fontFamily: 'inherit',
                    padding: 0
                  }}
                >
                  Créala gratis
                </button>
              </p>
            </form>
          )}

          {/* ── REGISTER ── */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <Field
                id="register-name"
                label="Nombre completo" required
                type="text" name="name"
                value={registerForm.name}
                onChange={e => setRegisterForm({ ...registerForm, name: e.target.value })}
                placeholder="Valentina García"
              />
              <Field
                id="register-email"
                label="Email" required
                type="email" name="email"
                value={registerForm.email}
                onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })}
                placeholder="tu@email.com"
              />
              <Field
                id="register-password"
                label="Contraseña" required
                type={showRegPwd ? 'text' : 'password'}
                name="password"
                value={registerForm.password}
                onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })}
                placeholder="Mínimo 6 caracteres"
                rightSlot={
                  <button 
                    type="button" 
                    onClick={() => setShowRegPwd(v => !v)}
                    aria-label={showRegPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'inherit',
                      padding: 0,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <EyeIcon open={showRegPwd} />
                  </button>
                }
              />
              <Field
                id="register-confirm-password"
                label="Confirmar contraseña" required
                type={showRegConfirm ? 'text' : 'password'}
                name="confirmPassword"
                value={registerForm.confirmPassword}
                onChange={e => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                placeholder="Repetí tu contraseña"
                rightSlot={
                  <button 
                    type="button" 
                    onClick={() => setShowRegConfirm(v => !v)}
                    aria-label={showRegConfirm ? "Ocultar contraseña" : "Mostrar contraseña"}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'inherit',
                      padding: 0,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <EyeIcon open={showRegConfirm} />
                  </button>
                }
              />

              {/* Match indicator */}
              {registerForm.confirmPassword.length > 0 && (
                <p style={{
                  fontFamily: "var(--display)",
                  fontSize: '11px', fontWeight: 700,
                  color: registerForm.password === registerForm.confirmPassword ? '#00C853' : 'var(--accent-red)',
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
                fontFamily: "var(--display)",
                fontSize: '12px', color: 'var(--gray-text)',
                marginTop: '4px',
              }}>
                ¿Ya tenés cuenta?{' '}
                <button
                  type="button"
                  onClick={() => switchTab('login')}
                  style={{ 
                    color: 'var(--white)', 
                    cursor: 'pointer', 
                    fontWeight: 700, 
                    textDecoration: 'underline',
                    background: 'none',
                    border: 'none',
                    fontFamily: 'inherit',
                    padding: 0
                  }}
                >
                  Ingresá acá
                </button>
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
