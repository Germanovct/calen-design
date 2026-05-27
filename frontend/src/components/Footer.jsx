import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const waUrl = `https://wa.me/5491166203840?text=${encodeURIComponent('Hola! Vengo de la web de Calen Design y quería hacer una consulta.')}`;

  const linkStyle = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '13px',
    fontWeight: 700,
    letterSpacing: '0.06em',
    color: '#555',
    textTransform: 'uppercase',
    transition: 'color 0.15s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  };

  const colHeader = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    color: '#FFFFFF',
    marginBottom: '20px',
    fontWeight: 900,
  };

  const hoverOn = (e) => { e.currentTarget.style.color = '#FFFFFF'; };
  const hoverOff = (e) => { e.currentTarget.style.color = '#555'; };

  return (
    <footer style={{
      backgroundColor: '#0A0A0A',
      borderTop: '1px solid #1A1A1A',
      marginTop: 'auto',
      color: '#555',
    }}>
      {/* ── FOOTER MAIN — 4 columnas ── */}
      <div className="container" style={{ padding: '64px 24px 48px 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '48px',
          alignItems: 'start',
        }}>

          {/* ── COL 1: Logo + Tagline ── */}
          <div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '20px', color: '#FFFFFF', marginBottom: '4px', fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              CALEN<span style={{ color: '#FF2D2D' }}>·</span>DESIGN
            </h3>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', color: '#333', textTransform: 'uppercase', marginBottom: '24px' }}>
              COL. 01 — 2026
            </p>
            <p style={{ fontSize: '13px', fontFamily: "'Inter', sans-serif", fontWeight: 400, color: '#555', lineHeight: 1.8, maxWidth: '260px' }}>
              Diseño independiente con una estética atemporal. Hecho para durar.
            </p>
          </div>

          {/* ── COL 2: Navegar ── */}
          <div>
            <h4 style={colHeader}>NAVEGAR</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { to: '/',          label: 'INICIO'   },
                { to: '/productos', label: 'CATÁLOGO' },
                { to: '/archivo',   label: 'ARCHIVO'  },
                { to: '/mi-cuenta', label: 'MI CUENTA'},
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} style={linkStyle}
                    onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
                    <span style={{ color: '#FF2D2D', fontSize: '8px' }}>▶</span>{label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── COL 3: Legal ── */}
          <div>
            <h4 style={colHeader}>LEGAL</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { to: '/preguntas-frecuentes',     label: 'PREGUNTAS FRECUENTES'     },
                { to: '/politicas-de-envio',        label: 'POLÍTICAS DE ENVÍO'       },
                { to: '/cambios-y-devoluciones',    label: 'CAMBIOS Y DEVOLUCIONES'   },
                { to: '/boton-de-arrepentimiento',  label: 'BOTÓN DE ARREPENTIMIENTO' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} style={{ ...linkStyle, fontSize: '12px' }}
                    onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
                    <span style={{ color: '#FF2D2D', fontSize: '8px' }}>▶</span>{label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── COL 4: Contacto ── */}
          <div>
            <h4 style={colHeader}>CONTACTO</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="mailto:info@calendesign.com" style={{ ...linkStyle, textTransform: 'lowercase' }}
                onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
                info@calendesign.com
              </a>
              <a href="tel:+5491166203840" style={linkStyle}
                onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
                +54 9 11 6620 3840
              </a>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '12px',
                  fontWeight: 900,
                  letterSpacing: '0.1em',
                  color: '#C8FF00',
                  textTransform: 'uppercase',
                  border: '1px solid #C8FF00',
                  padding: '8px 14px',
                  marginTop: '8px',
                  transition: 'all 0.18s ease',
                  width: 'fit-content',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#C8FF00'; e.currentTarget.style.color = '#000'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#C8FF00'; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WHATSAPP
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div style={{ borderTop: '1px solid #111', padding: '16px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', padding: '0 24px' }}>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', color: '#333', textTransform: 'uppercase' }}>
            © {new Date().getFullYear()} CALEN DESIGN
          </p>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: '#333', textTransform: 'uppercase' }}>
            DTS<span style={{ color: '#FF2D2D' }}>·</span>DOG AGENCY
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
