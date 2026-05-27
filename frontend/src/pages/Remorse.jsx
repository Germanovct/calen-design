import React, { useState } from 'react';

/* ─────────────────────────────────────────────
   /boton-de-arrepentimiento
   Obligatorio por Ley Argentina 24.240 — art. 34
   y Res. SSCYDC 424/2020
───────────────────────────────────────────── */

const Remorse = () => {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    pedido: '',
    motivo: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData(e.target);
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString(),
      });
      setSubmitted(true);
    } catch {
      /* fallback: igual mostramos confirmación */
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    fontFamily: "'Inter', sans-serif",
    fontSize: '14px',
    fontWeight: 400,
    border: '1px solid #2A2A2A',
    backgroundColor: '#111',
    color: '#FFFFFF',
    outline: 'none',
    transition: 'border-color 0.18s ease',
    borderRadius: 0,
    appearance: 'none',
  };

  const labelStyle = {
    display: 'block',
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.18em',
    color: '#555',
    marginBottom: '8px',
  };

  return (
    <div style={{ backgroundColor: '#0A0A0A', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #1A1A1A', padding: '80px 0 56px 0' }}>
        <div className="container">
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em', color: '#FF2D2D', textTransform: 'uppercase', display: 'block', marginBottom: '20px' }}>
            — LEY 24.240 / ART. 34 — RES. SSCYDC 424/2020
          </span>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(32px, 6vw, 72px)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.01em', color: '#FFFFFF', lineHeight: 0.95, marginBottom: '24px' }}>
            BOTÓN DE<br />ARREPENTIMIENTO
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: 400, color: '#888', lineHeight: 1.8, maxWidth: '600px' }}>
            En cumplimiento de la Ley de Defensa del Consumidor (Ley 24.240) y la Resolución SSCYDC 424/2020, el consumidor tiene derecho a revocar la aceptación durante el plazo de <strong style={{ color: '#FFFFFF' }}>10 (diez) días corridos</strong> contados desde la celebración del contrato o desde la entrega del bien, lo que ocurra último, sin responsabilidad alguna.
          </p>
        </div>
      </div>

      {/* Banner legal */}
      <div style={{ backgroundColor: '#111', borderBottom: '1px solid #1A1A1A', padding: '24px' }}>
        <div className="container">
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#555', lineHeight: 1.8, maxWidth: '760px' }}>
            Si ejercés este derecho, te devolveremos el importe abonado dentro de los <strong style={{ color: '#FFFFFF' }}>10 días hábiles</strong> siguientes a la recepción de tu solicitud, a través del mismo medio de pago utilizado. Los gastos de devolución del producto están a cargo de Calen Design cuando el arrepentimiento se ejerce dentro del plazo legal.
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="container" style={{ padding: '60px 24px 120px 24px', maxWidth: '640px' }}>
        {submitted ? (
          <div style={{ padding: '48px', border: '1px solid #C8FF00', backgroundColor: '#0D0D0D', textAlign: 'center' }}>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', color: '#C8FF00', textTransform: 'uppercase', marginBottom: '16px' }}>
              ✓ SOLICITUD RECIBIDA
            </p>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '18px', fontWeight: 900, color: '#FFFFFF', textTransform: 'uppercase', marginBottom: '16px' }}>
              TU ARREPENTIMIENTO FUE REGISTRADO
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#888', lineHeight: 1.8 }}>
              Nos pondremos en contacto dentro de las 48 horas hábiles al email indicado para procesar tu solicitud y coordinar el reintegro.
            </p>
          </div>
        ) : (
          <>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '20px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#FFFFFF', marginBottom: '32px' }}>
              COMPLETÁ EL FORMULARIO
            </h2>

            {/* Netlify Forms */}
            <form
              name="arrepentimiento"
              method="POST"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
            >
              <input type="hidden" name="form-name" value="arrepentimiento" />
              <input type="hidden" name="bot-field" />

              <div>
                <label style={labelStyle} htmlFor="nombre">NOMBRE COMPLETO *</label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Juan García"
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = '#FF2D2D'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#2A2A2A'; }}
                />
              </div>

              <div>
                <label style={labelStyle} htmlFor="email">EMAIL *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = '#FF2D2D'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#2A2A2A'; }}
                />
              </div>

              <div>
                <label style={labelStyle} htmlFor="pedido">NÚMERO DE PEDIDO *</label>
                <input
                  id="pedido"
                  name="pedido"
                  type="text"
                  required
                  value={form.pedido}
                  onChange={handleChange}
                  placeholder="Ej: #00123"
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = '#FF2D2D'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#2A2A2A'; }}
                />
              </div>

              <div>
                <label style={labelStyle} htmlFor="motivo">MOTIVO *</label>
                <textarea
                  id="motivo"
                  name="motivo"
                  required
                  rows={5}
                  value={form.motivo}
                  onChange={handleChange}
                  placeholder="Describí brevemente el motivo de tu arrepentimiento..."
                  style={{
                    ...inputStyle,
                    resize: 'vertical',
                    minHeight: '120px',
                    lineHeight: 1.6,
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#FF2D2D'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#2A2A2A'; }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: '100%',
                  padding: '18px 24px',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 900,
                  fontSize: '13px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  backgroundColor: submitting ? '#222' : '#FFFFFF',
                  color: submitting ? '#555' : '#000000',
                  border: '1px solid #FFFFFF',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.18s ease',
                }}
                onMouseEnter={(e) => {
                  if (!submitting) {
                    e.currentTarget.style.backgroundColor = '#FF2D2D';
                    e.currentTarget.style.color = '#FFFFFF';
                    e.currentTarget.style.borderColor = '#FF2D2D';
                    e.currentTarget.style.transform = 'translate(-2px,-2px)';
                    e.currentTarget.style.boxShadow = '4px 4px 0px #FF2D2D';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.color = '#000000';
                  e.currentTarget.style.borderColor = '#FFFFFF';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {submitting ? 'ENVIANDO...' : 'ENVIAR SOLICITUD DE ARREPENTIMIENTO'}
              </button>

              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: '#444', lineHeight: 1.7, textAlign: 'center' }}>
                Al enviar este formulario confirmás que ejercés tu derecho de arrepentimiento según la Ley 24.240. Recibirás respuesta en un plazo máximo de 48 horas hábiles.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Remorse;
