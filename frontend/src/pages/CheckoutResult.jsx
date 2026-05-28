import React, { useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';

// ── CheckoutSuccess ──────────────────────────────────────────────
export const CheckoutSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const paymentId = params.get('payment_id');
  const externalRef = params.get('external_reference');
  const status = params.get('status');

  useEffect(() => {
    // Redirigir a mis pedidos después de 5s
    const t = setTimeout(() => navigate('/mi-cuenta/pedidos'), 5000);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0A0A0A',
      padding: '40px 24px',
      textAlign: 'center',
    }}>
      {/* Checkmark animado */}
      <div style={{
        width: '80px', height: '80px', borderRadius: '50%',
        backgroundColor: '#00C853',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '32px',
        animation: 'popIn 0.4s ease',
      }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h1 style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 'clamp(32px, 6vw, 64px)',
        fontWeight: 900,
        textTransform: 'uppercase',
        color: '#FFFFFF',
        letterSpacing: '-0.02em',
        marginBottom: '16px',
      }}>
        ¡Pago Aprobado!
      </h1>

      <p style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: '16px',
        color: '#888',
        marginBottom: '8px',
        maxWidth: '400px',
      }}>
        Tu compra fue procesada exitosamente. Recibirás un email de confirmación a la brevedad.
      </p>

      {paymentId && (
        <p style={{ fontSize: '12px', color: '#444', fontFamily: 'monospace', marginBottom: '32px' }}>
          ID de pago: {paymentId}
        </p>
      )}

      <p style={{ fontSize: '13px', color: '#555', fontFamily: "'Space Grotesk', sans-serif", marginBottom: '32px' }}>
        Redirigiendo a tus pedidos en 5 segundos...
      </p>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/mi-cuenta/pedidos" style={{
          padding: '14px 32px',
          backgroundColor: '#FFFFFF',
          color: '#0A0A0A',
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 900,
          textTransform: 'uppercase',
          fontSize: '13px',
          letterSpacing: '0.1em',
          textDecoration: 'none',
        }}>
          Ver mis pedidos
        </Link>
        <Link to="/productos" style={{
          padding: '14px 32px',
          backgroundColor: 'transparent',
          color: '#FFFFFF',
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 900,
          textTransform: 'uppercase',
          fontSize: '13px',
          letterSpacing: '0.1em',
          textDecoration: 'none',
          border: '1px solid #333',
        }}>
          Seguir comprando
        </Link>
      </div>

      <style>{`
        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          80% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// ── CheckoutFailure ──────────────────────────────────────────────
export const CheckoutFailure = () => {
  const [params] = useSearchParams();
  const paymentId = params.get('payment_id');

  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0A0A0A',
      padding: '40px 24px',
      textAlign: 'center',
    }}>
      <div style={{
        width: '80px', height: '80px', borderRadius: '50%',
        backgroundColor: '#FF2D2D',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '32px',
      }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </div>

      <h1 style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 'clamp(32px, 6vw, 64px)',
        fontWeight: 900,
        textTransform: 'uppercase',
        color: '#FFFFFF',
        letterSpacing: '-0.02em',
        marginBottom: '16px',
      }}>
        Pago Rechazado
      </h1>

      <p style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: '16px',
        color: '#888',
        marginBottom: '32px',
        maxWidth: '400px',
      }}>
        No se pudo procesar tu pago. Podés intentar con otro medio de pago o contactarnos.
      </p>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/checkout" style={{
          padding: '14px 32px',
          backgroundColor: '#FFFFFF',
          color: '#0A0A0A',
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 900,
          textTransform: 'uppercase',
          fontSize: '13px',
          letterSpacing: '0.1em',
          textDecoration: 'none',
        }}>
          Reintentar
        </Link>
        <Link to="/productos" style={{
          padding: '14px 32px',
          backgroundColor: 'transparent',
          color: '#FFFFFF',
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 900,
          textTransform: 'uppercase',
          fontSize: '13px',
          letterSpacing: '0.1em',
          textDecoration: 'none',
          border: '1px solid #333',
        }}>
          Volver a la tienda
        </Link>
      </div>
    </div>
  );
};

// ── CheckoutPending ──────────────────────────────────────────────
export const CheckoutPending = () => {
  const [params] = useSearchParams();
  const paymentId = params.get('payment_id');

  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0A0A0A',
      padding: '40px 24px',
      textAlign: 'center',
    }}>
      <div style={{
        width: '80px', height: '80px', borderRadius: '50%',
        backgroundColor: '#F5A623',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '32px',
      }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      <h1 style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 'clamp(32px, 6vw, 64px)',
        fontWeight: 900,
        textTransform: 'uppercase',
        color: '#FFFFFF',
        letterSpacing: '-0.02em',
        marginBottom: '16px',
      }}>
        Pago Pendiente
      </h1>

      <p style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: '16px',
        color: '#888',
        marginBottom: '16px',
        maxWidth: '420px',
      }}>
        Tu pago está siendo procesado. Te notificaremos por email cuando se confirme.
      </p>

      {paymentId && (
        <p style={{ fontSize: '12px', color: '#444', fontFamily: 'monospace', marginBottom: '32px' }}>
          ID de pago: {paymentId}
        </p>
      )}

      <Link to="/mi-cuenta/pedidos" style={{
        padding: '14px 32px',
        backgroundColor: '#FFFFFF',
        color: '#0A0A0A',
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 900,
        textTransform: 'uppercase',
        fontSize: '13px',
        letterSpacing: '0.1em',
        textDecoration: 'none',
      }}>
        Ver mis pedidos
      </Link>
    </div>
  );
};
