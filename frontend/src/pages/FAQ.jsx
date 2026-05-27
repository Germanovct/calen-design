import React, { useState } from 'react';

/* ─────────────────────────────────────────────
   /preguntas-frecuentes — FAQ con acordeón
   Dark Brutalism
───────────────────────────────────────────── */

const faqs = [
  {
    category: 'ENVÍOS',
    items: [
      {
        q: '¿Hacen envíos a todo el país?',
        a: 'Sí. Hacemos envíos a todo el territorio argentino a través de correo oficial y servicios de mensajería privada. El costo y tiempo de entrega varía según la provincia de destino.',
      },
      {
        q: '¿Cuánto tarda en llegar mi pedido?',
        a: 'Los pedidos dentro del AMBA demoran entre 3 a 5 días hábiles. Para el interior del país, el tiempo estimado es de 5 a 10 días hábiles dependiendo de la zona.',
      },
      {
        q: '¿Puedo retirar mi pedido en persona?',
        a: 'Sí. Contamos con showroom en Palermo, CABA. Podés coordinar el retiro escribiéndonos por WhatsApp o email una vez realizado el pago.',
      },
      {
        q: '¿Cómo hago el seguimiento de mi envío?',
        a: 'Una vez despachado tu pedido te enviamos el número de seguimiento por email o WhatsApp para que puedas rastrearlo en tiempo real.',
      },
    ],
  },
  {
    category: 'PAGOS',
    items: [
      {
        q: '¿Qué métodos de pago aceptan?',
        a: 'Aceptamos tarjetas de débito y crédito (Visa, Mastercard, American Express), transferencia bancaria y pago con Mercado Pago.',
      },
      {
        q: '¿Puedo pagar en cuotas?',
        a: 'Sí. Con tarjetas de crédito a través de Mercado Pago podés pagar en hasta 12 cuotas sin interés (sujeto a disponibilidad según banco y promociones vigentes).',
      },
      {
        q: '¿Es seguro pagar en la web?',
        a: 'Sí. Todos los pagos se procesan a través de Mercado Pago, plataforma certificada con los más altos estándares de seguridad (PCI DSS). Nunca almacenamos datos de tarjetas.',
      },
    ],
  },
  {
    category: 'TALLES Y PRODUCTOS',
    items: [
      {
        q: '¿Cómo sé qué talle elegir?',
        a: 'En cada producto encontrás la guía de talles específica. Si tenés dudas, escribinos por WhatsApp con tus medidas (busto, cintura, cadera) y te asesoramos.',
      },
      {
        q: '¿Los colores en foto son exactos?',
        a: 'Trabajamos para que las fotografías representen fielmente los colores reales, pero puede haber pequeñas variaciones según la calibración del monitor. En caso de duda, consultanos.',
      },
      {
        q: '¿Los productos tienen garantía?',
        a: 'Sí. Todos nuestros productos tienen garantía de calidad de 30 días desde la recepción. Si detectás algún defecto de fabricación, nos ponemos en contacto para resolverlo.',
      },
    ],
  },
  {
    category: 'DEVOLUCIONES',
    items: [
      {
        q: '¿Puedo devolver un producto?',
        a: 'Sí. Aceptamos devoluciones dentro de los 30 días corridos desde la fecha de recepción, siempre que el producto esté sin uso, con etiquetas originales y en su embalaje original.',
      },
      {
        q: '¿El costo de devolución es gratis?',
        a: 'Sí. Las devoluciones por defecto de fabricación no tienen costo para vos. Para cambios por talle u otro motivo personal, el costo del envío de devolución está a cargo del comprador.',
      },
      {
        q: '¿Cómo inicio una devolución?',
        a: 'Escribinos por email a info@calendesign.com o por WhatsApp indicando tu número de pedido y el motivo. Te guiamos en el proceso paso a paso.',
      },
    ],
  },
];

/* Ítem del acordeón */
const AccordionItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid #1A1A1A' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 0',
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '16px',
          fontWeight: 700,
          color: open ? '#FFFFFF' : '#888',
          textAlign: 'left',
          gap: '16px',
          transition: 'color 0.18s ease',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => { if (!open) e.currentTarget.style.color = '#FFFFFF'; }}
        onMouseLeave={(e) => { if (!open) e.currentTarget.style.color = '#888'; }}
      >
        <span>{question}</span>
        <span style={{
          flexShrink: 0,
          width: '24px',
          height: '24px',
          border: '1px solid #2A2A2A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: open ? '#FF2D2D' : '#555',
          fontSize: '18px',
          lineHeight: 1,
          transition: 'all 0.18s ease',
          transform: open ? 'rotate(45deg)' : 'none',
        }}>+</span>
      </button>
      {open && (
        <div style={{
          paddingBottom: '24px',
          paddingRight: '40px',
        }}>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '15px',
            fontWeight: 400,
            color: '#888',
            lineHeight: 1.8,
          }}>
            {answer}
          </p>
        </div>
      )}
    </div>
  );
};

const FAQ = () => (
  <div style={{ backgroundColor: '#0A0A0A', minHeight: '100vh' }}>
    {/* Header */}
    <div style={{ borderBottom: '1px solid #1A1A1A', padding: '80px 0 56px 0' }}>
      <div className="container">
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em', color: '#FF2D2D', textTransform: 'uppercase', display: 'block', marginBottom: '20px' }}>
          — PREGUNTAS FRECUENTES
        </span>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(48px, 8vw, 96px)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.01em', color: '#FFFFFF', lineHeight: 0.95, marginBottom: '24px' }}>
          FAQ
        </h1>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '16px', fontWeight: 300, fontStyle: 'italic', color: '#555', maxWidth: '480px', lineHeight: 1.6 }}>
          Todo lo que necesitás saber antes de comprar.
        </p>
      </div>
    </div>

    {/* Acordeón */}
    <div className="container" style={{ padding: '60px 24px 120px 24px', maxWidth: '800px' }}>
      {faqs.map((section) => (
        <div key={section.category} style={{ marginBottom: '48px' }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', fontWeight: 900, letterSpacing: '0.22em', color: '#FF2D2D', textTransform: 'uppercase', marginBottom: '8px' }}>
            {section.category}
          </h2>
          <div style={{ borderTop: '1px solid #1A1A1A' }}>
            {section.items.map((item) => (
              <AccordionItem key={item.q} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      ))}

      {/* CTA contacto */}
      <div style={{ marginTop: '64px', padding: '32px', border: '1px solid #1A1A1A', backgroundColor: '#111' }}>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '14px', fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
          ¿No encontraste tu respuesta?
        </p>
        <a href="mailto:info@calendesign.com" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#FFFFFF', borderBottom: '1px solid #FF2D2D', paddingBottom: '2px' }}>
          ESCRIBINOS → info@calendesign.com
        </a>
      </div>
    </div>
  </div>
);

export default FAQ;
