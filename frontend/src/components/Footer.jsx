import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#0A0A0A',
      borderTop: '1px solid #1A1A1A',
      marginTop: 'auto',
      color: '#555',
    }}>
      {/* ── FOOTER MAIN ── */}
      <div className="container" style={{ padding: '64px 24px 48px 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '48px',
        }}>

          {/* Brand */}
          <div style={{ gridColumn: 'span 1' }}>
            <h3 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '20px',
              color: '#FFFFFF',
              marginBottom: '4px',
              fontWeight: 900,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}>
              CALEN<span style={{ color: '#FF2D2D' }}>·</span>DESIGN
            </h3>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.2em',
              color: '#333',
              textTransform: 'uppercase',
              marginBottom: '24px',
            }}>
              COL. 01 — 2026
            </p>
            <p style={{
              fontSize: '13px',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              color: '#555',
              lineHeight: 1.8,
              maxWidth: '280px',
            }}>
              Diseño independiente con una estética atemporal. Hecho para durar.
            </p>
          </div>

          {/* Explorar */}
          <div>
            <h4 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: '#FFFFFF',
              marginBottom: '20px',
              fontWeight: 900,
            }}>
              EXPLORAR
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { to: '/',                           label: 'INICIO'    },
                { to: '/productos',                  label: 'CATÁLOGO'  },
                { to: '/productos?category=remeras', label: 'REMERAS'   },
                { to: '/productos?category=buzos',   label: 'BUZOS'     },
                { to: '/productos?category=vestidos',label: 'VESTIDOS'  },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '12px',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      color: '#555',
                      textTransform: 'uppercase',
                      transition: 'color 0.15s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#555'; }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Soporte */}
          <div>
            <h4 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: '#FFFFFF',
              marginBottom: '20px',
              fontWeight: 900,
            }}>
              SOPORTE
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { to: '/mi-cuenta',     label: 'MI CUENTA'           },
                { href: '#envios',      label: 'POLÍTICAS DE ENVÍO'  },
                { href: '#cambios',     label: 'CAMBIOS Y DEVOLUCIONES' },
              ].map(({ to, href, label }) => (
                <li key={label}>
                  {to ? (
                    <Link
                      to={to}
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: '12px',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        color: '#555',
                        textTransform: 'uppercase',
                        transition: 'color 0.15s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#555'; }}
                    >
                      {label}
                    </Link>
                  ) : (
                    <a
                      href={href}
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: '12px',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        color: '#555',
                        textTransform: 'uppercase',
                        transition: 'color 0.15s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#555'; }}
                    >
                      {label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: '#FFFFFF',
              marginBottom: '20px',
              fontWeight: 900,
            }}>
              CONTACTO
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                'Showroom en Palermo, CABA',
                'info@calendesign.com',
                '+54 9 11 6620 3840',
              ].map(text => (
                <p key={text} style={{
                  fontSize: '12px',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  color: '#555',
                  lineHeight: 1.6,
                }}>
                  {text}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER BOTTOM BAR ── */}
      <div style={{
        borderTop: '1px solid #111',
        padding: '16px 0',
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          padding: '0 24px',
        }}>
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: '#333',
            textTransform: 'uppercase',
          }}>
            © {new Date().getFullYear()} CALEN DESIGN
          </p>
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: '#333',
            textTransform: 'uppercase',
          }}>
            DTS<span style={{ color: '#FF2D2D' }}>·</span>DOG AGENCY
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
