import React from 'react';

/* ─────────────────────────────────────────────
   /cambios-y-devoluciones
   Dark Brutalism — 30 días
───────────────────────────────────────────── */

const Section = ({ title, children }) => (
  <div style={{ marginBottom: '48px' }}>
    <h2 style={{
      fontFamily: "'Space Grotesk', sans-serif",
      fontSize: '13px',
      fontWeight: 900,
      textTransform: 'uppercase',
      letterSpacing: '0.2em',
      color: '#FF2D2D',
      marginBottom: '20px',
      paddingBottom: '12px',
      borderBottom: '1px solid #1A1A1A',
    }}>{title}</h2>
    {children}
  </div>
);

const P = ({ children }) => (
  <p style={{
    fontFamily: "'Inter', sans-serif",
    fontSize: '15px',
    fontWeight: 400,
    color: '#888',
    lineHeight: 1.9,
    marginBottom: '16px',
  }}>{children}</p>
);

const Bullet = ({ children }) => (
  <li style={{
    fontFamily: "'Inter', sans-serif",
    fontSize: '15px',
    fontWeight: 400,
    color: '#888',
    lineHeight: 1.9,
    marginBottom: '8px',
    paddingLeft: '8px',
  }}>
    <span style={{ color: '#FF2D2D', marginRight: '8px' }}>—</span>
    {children}
  </li>
);

const Returns = () => (
  <div style={{ backgroundColor: '#0A0A0A', minHeight: '100vh' }}>
    {/* Header */}
    <div style={{ borderBottom: '1px solid #1A1A1A', padding: '80px 0 56px 0' }}>
      <div className="container">
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em', color: '#FF2D2D', textTransform: 'uppercase', display: 'block', marginBottom: '20px' }}>
          — LEGAL
        </span>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(40px, 7vw, 80px)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.01em', color: '#FFFFFF', lineHeight: 0.95, marginBottom: '24px' }}>
          CAMBIOS Y<br />DEVOLUCIONES
        </h1>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '12px', fontWeight: 500, color: '#444', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Última actualización: Mayo 2026
        </p>
      </div>
    </div>

    {/* Banner 30 días */}
    <div style={{ backgroundColor: '#FF2D2D', padding: '24px' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(40px, 8vw, 72px)', fontWeight: 900, color: '#FFFFFF', lineHeight: 1 }}>30</span>
        <div>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '16px', fontWeight: 900, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>DÍAS DE GARANTÍA</p>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px', fontWeight: 400, color: 'rgba(255,255,255,0.7)' }}>para cambios y devoluciones sin complicaciones</p>
        </div>
      </div>
    </div>

    <div className="container" style={{ padding: '60px 24px 120px 24px', maxWidth: '760px' }}>

      <Section title="Condiciones para aceptar una devolución">
        <P>Aceptamos devoluciones dentro de los <strong style={{ color: '#FFFFFF' }}>30 días corridos</strong> desde la fecha de recepción del producto, siempre que se cumplan las siguientes condiciones:</P>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <Bullet>El producto no fue usado, lavado ni alterado</Bullet>
          <Bullet>Conserva todas sus etiquetas originales intactas</Bullet>
          <Bullet>Se encuentra en su embalaje original o equivalente</Bullet>
          <Bullet>Se presenta el comprobante de compra (número de pedido)</Bullet>
        </ul>
      </Section>

      <Section title="Productos excluidos">
        <P>No aceptamos devoluciones ni cambios de:</P>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <Bullet>Ropa interior y lencería (por higiene)</Bullet>
          <Bullet>Productos en liquidación o con descuento mayor al 40% (salvo defecto de fabricación)</Bullet>
          <Bullet>Productos personalizados o confeccionados a medida</Bullet>
        </ul>
      </Section>

      <Section title="Proceso de cambio o devolución">
        <P>Para iniciar un cambio o devolución:</P>
        <ol style={{ listStyle: 'none', padding: 0, counterReset: 'steps' }}>
          {[
            'Escribinos a info@calendesign.com con tu número de pedido y el motivo del cambio o devolución.',
            'Te respondemos en un plazo máximo de 48 horas hábiles con las instrucciones de envío.',
            'Enviás el producto al domicilio indicado.',
            'Una vez recibido e inspeccionado, procesamos el cambio de talle o la devolución del dinero.',
          ].map((step, i) => (
            <li key={i} style={{ fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: 400, color: '#888', lineHeight: 1.9, marginBottom: '16px', display: 'flex', gap: '16px' }}>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, color: '#FF2D2D', flexShrink: 0, width: '24px' }}>0{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Costos">
        <P><strong style={{ color: '#FFFFFF' }}>Defecto de fabricación:</strong> el costo del envío de devolución está a cargo de Calen Design. Se te envía una etiqueta prepaga.</P>
        <P><strong style={{ color: '#FFFFFF' }}>Cambio de talle u otro motivo personal:</strong> el costo del envío de devolución está a cargo del comprador. El reenvío del nuevo producto no tiene costo adicional.</P>
      </Section>

      <Section title="Reintegro del dinero">
        <P>Una vez aprobada la devolución, el reintegro se realiza mediante el mismo método de pago original en un plazo de 5 a 10 días hábiles según el banco o plataforma.</P>
      </Section>

      <Section title="Contacto">
        <P>Cualquier consulta sobre cambios y devoluciones: <a href="mailto:info@calendesign.com" style={{ color: '#FF2D2D', borderBottom: '1px solid rgba(255,45,45,0.3)' }}>info@calendesign.com</a> o WhatsApp +54 9 11 6620 3840.</P>
      </Section>
    </div>
  </div>
);

export default Returns;
