import React from 'react';

/* ─────────────────────────────────────────────
   /archivo — Campañas y editoriales
   Dark Brutalism — mismo sistema de diseño
───────────────────────────────────────────── */

const campaigns = [
  {
    id: 1,
    slug: 'col-01-2026',
    title: 'COL. 01 — 2026',
    subtitle: 'Buenos Aires',
    year: '2026',
    city: 'Buenos Aires, ARG',
    description: 'Primera colección de Calen Design. Prendas de corte minimalista inspiradas en la arquitectura porteña y la quietud del atardecer en Palermo.',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&auto=format&fit=crop&q=80',
    pieces: '12 PIEZAS',
    season: 'OTOÑO — INVIERNO',
  },
];

/* Estilos compartidos */
const label = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: '#555',
};

const Archive = () => (
  <div style={{ backgroundColor: '#0A0A0A', minHeight: '100vh' }}>

    {/* ── HEADER EDITORIAL ── */}
    <div style={{ borderBottom: '1px solid #1A1A1A', padding: '80px 0 56px 0' }}>
      <div className="container">
        <span style={{ ...label, color: '#FF2D2D', display: 'block', marginBottom: '20px' }}>
          — ARCHIVO
        </span>
        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(72px, 12vw, 160px)',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '-0.02em',
          color: '#FFFFFF',
          lineHeight: 0.9,
          marginBottom: '32px',
        }}>
          ARCHIVO
        </h1>
        <p style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '16px',
          fontWeight: 300,
          fontStyle: 'italic',
          color: '#555',
          letterSpacing: '0.02em',
        }}>
          Campañas y editoriales — registro visual de cada colección.
        </p>
      </div>
    </div>

    {/* ── GRID DE CAMPAÑAS ── */}
    <div className="container" style={{ padding: '80px 24px 120px 24px' }}>

      {/* Meta: número de campañas */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '48px',
        paddingBottom: '16px',
        borderBottom: '1px solid #1A1A1A',
      }}>
        <span style={label}>{campaigns.length} CAMPAÑA{campaigns.length !== 1 ? 'S' : ''}</span>
        <span style={{ ...label, color: '#333' }}>ORDEN: RECIENTE</span>
      </div>

      {/* Campañas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {campaigns.map((campaign, idx) => (
          <CampaignBlock key={campaign.id} campaign={campaign} index={idx} />
        ))}
      </div>
    </div>

    {/* ── COMING SOON ── */}
    <div style={{
      borderTop: '1px solid #1A1A1A',
      padding: '80px 24px',
      textAlign: 'center',
    }}>
      <span style={{ ...label, display: 'block', marginBottom: '16px' }}>PRÓXIMAMENTE</span>
      <p style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 'clamp(24px, 4vw, 48px)',
        fontWeight: 900,
        textTransform: 'uppercase',
        color: '#1A1A1A',
        letterSpacing: '0.06em',
      }}>
        COL. 02 — 2026
      </p>
    </div>
  </div>
);

/* ── Componente de bloque de campaña ── */
const CampaignBlock = ({ campaign, index }) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        backgroundColor: '#111',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Imagen fullwidth */}
      <div style={{ position: 'relative', width: '100%', height: 'clamp(400px, 60vh, 700px)' }}>
        <img
          src={campaign.image}
          alt={campaign.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
            filter: hovered ? 'grayscale(0%)' : 'grayscale(100%)',
            transform: hovered ? 'scale(1.02)' : 'scale(1)',
            transition: 'filter 0.5s ease, transform 0.6s ease',
          }}
        />

        {/* Overlay oscuro */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: hovered
            ? 'linear-gradient(to bottom, rgba(10,10,10,0.1) 0%, rgba(10,10,10,0.7) 100%)'
            : 'linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.85) 100%)',
          transition: 'background 0.4s ease',
          zIndex: 1,
        }} />

        {/* Número de campaña — top left */}
        <span style={{
          position: 'absolute',
          top: '32px',
          left: '32px',
          zIndex: 2,
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.25em',
          color: 'rgba(255,255,255,0.35)',
          textTransform: 'uppercase',
        }}>
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Metadatos — top right */}
        <div style={{
          position: 'absolute',
          top: '32px',
          right: '32px',
          zIndex: 2,
          textAlign: 'right',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.4)',
            textTransform: 'uppercase',
          }}>
            {campaign.pieces}
          </span>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.4)',
            textTransform: 'uppercase',
          }}>
            {campaign.season}
          </span>
        </div>

        {/* Título superpuesto — bottom */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 2,
          padding: '32px',
        }}>
          <span style={{
            display: 'block',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.22em',
            color: 'rgba(255,255,255,0.4)',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}>
            {campaign.city}
          </span>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(32px, 5vw, 72px)',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            color: '#FFFFFF',
            lineHeight: 1,
            marginBottom: '16px',
          }}>
            {campaign.title}
          </h2>
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '14px',
            fontWeight: 300,
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.6)',
            maxWidth: '560px',
            lineHeight: 1.7,
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
          }}>
            {campaign.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Archive;
