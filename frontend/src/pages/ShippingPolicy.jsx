import React from 'react';

/* ─────────────────────────────────────────────
   /politicas-de-envio
   Dark Brutalism
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

const Row = ({ label, value }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 0',
    borderBottom: '1px solid #111',
    flexWrap: 'wrap',
    gap: '8px',
  }}>
    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 400, color: '#888' }}>{value}</span>
  </div>
);

const ShippingPolicy = () => (
  <div style={{ backgroundColor: '#0A0A0A', minHeight: '100vh' }}>
    {/* Header */}
    <div style={{ borderBottom: '1px solid #1A1A1A', padding: '80px 0 56px 0' }}>
      <div className="container">
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em', color: '#FF2D2D', textTransform: 'uppercase', display: 'block', marginBottom: '20px' }}>
          — LEGAL
        </span>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(40px, 7vw, 80px)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.01em', color: '#FFFFFF', lineHeight: 0.95, marginBottom: '24px' }}>
          POLÍTICAS<br />DE ENVÍO
        </h1>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '12px', fontWeight: 500, color: '#444', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Última actualización: Mayo 2026
        </p>
      </div>
    </div>

    <div className="container" style={{ padding: '60px 24px 120px 24px', maxWidth: '760px' }}>

      <Section title="Cobertura de envíos">
        <P>Realizamos envíos a todo el territorio de la República Argentina, incluyendo todas las provincias y zonas de difícil acceso (sujeto a disponibilidad logística del correo elegido).</P>
        <P>No realizamos envíos internacionales por el momento.</P>
      </Section>

      <Section title="Tiempos de entrega estimados">
        <div style={{ border: '1px solid #1A1A1A', backgroundColor: '#0D0D0D' }}>
          <Row label="AMBA (Ciudad y GBA)" value="3 a 5 días hábiles" />
          <Row label="Buenos Aires interior" value="5 a 7 días hábiles" />
          <Row label="Centro del país" value="5 a 8 días hábiles" />
          <Row label="NOA / NEA" value="7 a 12 días hábiles" />
          <Row label="Patagonia" value="8 a 15 días hábiles" />
          <Row label="Retiro en showroom (Palermo)" value="Coordinar por WhatsApp" />
        </div>
        <P style={{ marginTop: '16px' }}>Los plazos son estimativos y pueden variar según la demanda, feriados nacionales o condiciones de cada prestador logístico.</P>
      </Section>

      <Section title="Costos de envío">
        <P>El costo de envío se calcula automáticamente al momento del checkout según la provincia de destino y el peso del paquete. Se muestra antes de confirmar el pago.</P>
        <P><strong style={{ color: '#FFFFFF' }}>Envío bonificado:</strong> para compras que superen un monto mínimo determinado (sujeto a promociones vigentes mostradas en el sitio).</P>
      </Section>

      <Section title="Despacho y confirmación">
        <P>Los pedidos se despachan dentro de las 48 a 72 horas hábiles posteriores a la confirmación del pago. Una vez despachado, te enviamos el número de tracking al email o WhatsApp registrado.</P>
        <P>Si no recibís confirmación de envío dentro de los 5 días hábiles de realizado el pago, escribinos a <a href="mailto:info@calendesign.com" style={{ color: '#FF2D2D', borderBottom: '1px solid rgba(255,45,45,0.3)' }}>info@calendesign.com</a>.</P>
      </Section>

      <Section title="Responsabilidad por el envío">
        <P>Una vez entregado el paquete al correo, la responsabilidad de entrega recae en la empresa de logística. Calen Design no se hace responsable por demoras imputables al correo, extravíos o daños ocurridos durante el transporte.</P>
        <P>En caso de pérdida o daño, te asistimos en el proceso de reclamo con el prestador logístico.</P>
      </Section>

      <Section title="Contacto">
        <P>Para consultas sobre tu envío escribinos a <a href="mailto:info@calendesign.com" style={{ color: '#FF2D2D', borderBottom: '1px solid rgba(255,45,45,0.3)' }}>info@calendesign.com</a> o por WhatsApp al +54 9 11 6620 3840.</P>
      </Section>
    </div>
  </div>
);

export default ShippingPolicy;
