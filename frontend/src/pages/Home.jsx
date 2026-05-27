import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import heroImg from '../assets/hero.png';

const categories = [
  { name: 'Remeras',  slug: 'remeras',  image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200&auto=format&fit=crop' },
  { name: 'Buzos',    slug: 'buzos',    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1200&auto=format&fit=crop' },
  { name: 'Vestidos', slug: 'vestidos', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200&auto=format&fit=crop' },
  { name: 'Lencería', slug: 'lenceria', image: 'https://images.unsplash.com/photo-1616166330003-8e552a243098?w=1200&auto=format&fit=crop' },
  { name: 'Abrigos',  slug: 'abrigos',  image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=1200&auto=format&fit=crop' },
];

const TICKER_TEXT = 'ENVÍOS A TODO EL PAÍS — DISEÑO INDEPENDIENTE — COL. 01 2026 — HECHO EN ARGENTINA — ';

const Home = () => {
  const { products, fetchProducts, loading } = useProducts();

  useEffect(() => {
    fetchProducts({ active: true });
  }, []);

  return (
    <div style={{ backgroundColor: '#0A0A0A', paddingBottom: 0 }}>

      {/* ════════════════════════════════════════
          HERO FULLSCREEN
      ════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: '640px',
        backgroundColor: '#0A0A0A',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-end',
        borderBottom: 'none',
      }}>
        {/* Imagen de fondo */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${heroImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
          backgroundRepeat: 'no-repeat',
          filter: 'grayscale(60%)',
        }} />

        {/* Overlay oscuro */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(10,10,10,0.15) 0%, rgba(10,10,10,0.75) 65%, rgba(10,10,10,1) 100%)',
          zIndex: 1,
        }} />

        {/* Contenido principal del hero */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          padding: '0 40px 56px 40px',
        }}>
          {/* Referencia de colección */}
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.25em',
            color: '#888888',
            textTransform: 'uppercase',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <span style={{ display: 'inline-block', width: '32px', height: '1px', backgroundColor: '#FF2D2D' }} />
            COL. 01 — 2026
            <span style={{ display: 'inline-block', width: '32px', height: '1px', backgroundColor: '#FF2D2D' }} />
          </div>

          {/* Título gigante — mobile-safe */}
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(56px, 12vw, 180px)',
            fontWeight: 900,
            lineHeight: 0.9,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: '#FFFFFF',
            marginBottom: '24px',
            marginLeft: '-4px',
          }}>
            CALEN<br />DESIGN
          </h1>

          {/* Subtítulo */}
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '15px',
            fontWeight: 300,
            fontStyle: 'italic',
            color: '#888888',
            marginBottom: '32px',
            maxWidth: '440px',
            letterSpacing: '0.02em',
            lineHeight: 1.6,
          }}>
            Ropa de diseño independiente — minimalista, atemporal, hecha para durar.
          </p>

          {/* CTA — solo "VER COLECCIÓN" */}
          <Link
            to="/productos"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px 40px',
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 900,
              fontSize: '13px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              backgroundColor: '#FFFFFF',
              color: '#000000',
              border: '1px solid #FFFFFF',
              transition: 'all 0.18s ease-in-out',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FF2D2D';
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.borderColor = '#FF2D2D';
              e.currentTarget.style.transform = 'translate(-2px, -2px)';
              e.currentTarget.style.boxShadow = '4px 4px 0px #FF2D2D';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.color = '#000000';
              e.currentTarget.style.borderColor = '#FFFFFF';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            VER COLECCIÓN
          </Link>
        </div>

        {/* Coordenadas editoriales — esquina inferior derecha */}
        <div style={{
          position: 'absolute',
          right: '40px',
          bottom: '56px',
          zIndex: 2,
          textAlign: 'right',
        }}>
          <span style={{ display: 'block', fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', color: '#444444', textTransform: 'uppercase', lineHeight: 2 }}>
            34°36'S — 58°22'O
          </span>
          <span style={{ display: 'block', fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', color: '#444444', textTransform: 'uppercase', lineHeight: 2 }}>
            Buenos Aires, ARG
          </span>
          <span style={{ display: 'block', fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', color: '#FF2D2D', lineHeight: 2 }}>●</span>
        </div>
      </section>

      {/* ════════════════════════════════════════
          MARQUEE / TICKER ROJO
      ════════════════════════════════════════ */}
      <div style={{
        backgroundColor: '#FF2D2D',
        height: '44px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        borderTop: 'none',
        borderBottom: 'none',
      }}>
        <style>{`
          @keyframes marquee-scroll {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .marquee-track {
            display: flex;
            white-space: nowrap;
            animation: marquee-scroll 30s linear infinite;
            will-change: transform;
          }
          .marquee-item {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 13px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            color: #FFFFFF;
            padding: 0 0;
          }
          .marquee-sep {
            color: rgba(255,255,255,0.5);
            margin: 0 16px;
          }
        `}</style>
        {/* Duplicamos el texto para que el loop sea infinito y seamless */}
        <div className="marquee-track">
          {[...Array(8)].map((_, i) => (
            <span key={i} className="marquee-item">
              {TICKER_TEXT}
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════
          CATEGORÍAS — GRILLA OSCURA
      ════════════════════════════════════════ */}
      <section style={{ padding: '100px 0', backgroundColor: '#0A0A0A' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '40px',
            paddingBottom: '16px',
            borderBottom: '1px solid #1A1A1A',
            flexWrap: 'wrap',
            gap: '16px',
          }}>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#FFFFFF',
            }}>
              COMPRAR POR<br /><span style={{ color: '#FF2D2D' }}>CATEGORÍA</span>
            </h2>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.2em',
              color: '#333',
              textTransform: 'uppercase',
            }}>
              01 / 02
            </span>
          </div>
        </div>

        {/* Grid de categorías — flush, sin container */}
        <style>{`
          .cat-cell { position: relative; overflow: hidden; cursor: pointer; display: block; background: #0A0A0A; }
          .cat-cell img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(100%); transition: filter 0.35s ease, transform 0.4s ease; display: block; }
          .cat-overlay {
            position: absolute; inset: 0; z-index: 1;
            background: linear-gradient(to top, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.15) 60%);
            transition: background 0.35s ease;
          }
          .cat-num {
            position: absolute; top: 16px; left: 16px; z-index: 2;
            font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 700;
            letter-spacing: 0.2em; color: rgba(255,255,255,0.3); text-transform: uppercase;
          }
          /* Label abajo por defecto */
          .cat-label-bottom {
            position: absolute; bottom: 20px; left: 16px; right: 16px; z-index: 2;
            font-family: 'Space Grotesk', sans-serif; font-size: 18px; font-weight: 900;
            text-transform: uppercase; letter-spacing: 0.06em; color: #FFFFFF;
            transition: opacity 0.25s ease, transform 0.25s ease;
          }
          /* Label centrado en hover */
          .cat-label-center {
            position: absolute; inset: 0; z-index: 3;
            display: flex; align-items: center; justify-content: center;
            font-family: 'Space Grotesk', sans-serif; font-size: clamp(32px, 4vw, 56px); font-weight: 900;
            text-transform: uppercase; letter-spacing: 0.04em; color: #FFFFFF;
            opacity: 0; transform: translateY(10px);
            transition: opacity 0.3s ease, transform 0.3s ease;
            text-align: center; padding: 16px;
            pointer-events: none;
          }
          /* HOVER STATES */
          .cat-cell:hover img { filter: grayscale(0%); transform: scale(1.06); }
          .cat-cell:hover .cat-overlay { background: rgba(0,0,0,0.45); }
          .cat-cell:hover .cat-label-bottom { opacity: 0; transform: translateY(8px); }
          .cat-cell:hover .cat-label-center { opacity: 1; transform: translateY(0); }
        `}</style>

        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${categories.length}, 1fr)`,
          gap: '1px',
          backgroundColor: '#1A1A1A',
        }}>
          {categories.map((cat, idx) => (
            <Link
              key={cat.slug}
              to={`/productos?category=${cat.slug}`}
              className="cat-cell"
              style={{ height: '380px' }}
            >
              <span className="cat-num">0{idx + 1}</span>
              <img src={cat.image} alt={cat.name} />
              <div className="cat-overlay" />
              <span className="cat-label-bottom">{cat.name}</span>
              <span className="cat-label-center">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          PRODUCTOS DESTACADOS
      ════════════════════════════════════════ */}
      <section style={{ padding: '80px 0 120px 0', backgroundColor: '#0A0A0A' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '40px',
            paddingBottom: '16px',
            borderBottom: '1px solid #1A1A1A',
            flexWrap: 'wrap',
            gap: '16px',
          }}>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#FFFFFF',
            }}>
              DESTACADOS
            </h2>
            <Link
              to="/productos"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: '#888888',
                textTransform: 'uppercase',
                borderBottom: '1px solid #333',
                paddingBottom: '2px',
                transition: 'color 0.18s ease, border-color 0.18s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.borderBottomColor = '#FFFFFF'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#888888'; e.currentTarget.style.borderBottomColor = '#333'; }}
            >
              VER TODO →
            </Link>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, fontSize: '13px', letterSpacing: '0.18em', color: '#333', textTransform: 'uppercase' }}>
            CARGANDO CATÁLOGO...
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1px',
            backgroundColor: '#1A1A1A',
          }}>
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {products.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px 24px', border: '1px solid #1A1A1A', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, fontSize: '13px', letterSpacing: '0.1em', color: '#333', textTransform: 'uppercase' }}>
                NO HAY PRODUCTOS DESTACADOS CARGADOS AÚN.
              </div>
            )}
          </div>
        )}
      </section>

      {/* ════════════════════════════════════════
          MANIFESTO EDITORIAL
      ════════════════════════════════════════ */}
      <section style={{ backgroundColor: '#0A0A0A', borderTop: '1px solid #1A1A1A', padding: '100px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '80px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 340px' }}>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.25em', color: '#FF2D2D', textTransform: 'uppercase', display: 'block', marginBottom: '24px' }}>
              — NUESTRA FILOSOFÍA
            </span>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.95, color: '#FFFFFF', marginBottom: '32px' }}>
              DISEÑO<br /><span style={{ color: '#FF2D2D' }}>SIN</span><br />FILTROS
            </h2>
          </div>
          <div style={{ flex: '2 1 400px' }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px', fontWeight: 400, color: '#888888', lineHeight: 1.9, marginBottom: '24px' }}>
              Calen Design nace de la convicción de que la moda no tiene que ser ruidosa para ser poderosa. Cada prenda es un ejercicio de precisión: cortes limpios, materiales que importan, siluetas que permanecen.
            </p>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px', fontWeight: 300, fontStyle: 'italic', color: '#555', lineHeight: 1.8 }}>
              Diseño independiente, con identidad propia.
            </p>
            <div style={{ marginTop: '40px', display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
              {[['100%', 'Diseño propio'], ['0%', 'Fast fashion'], ['∞', 'Calidad']].map(([num, label]) => (
                <div key={label}>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '40px', fontWeight: 900, color: '#FFFFFF', lineHeight: 1 }}>{num}</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', color: '#555', textTransform: 'uppercase', marginTop: '6px' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile responsive para hero title */}
      <style>{`
        @media (max-width: 640px) {
          .hero-title { font-size: clamp(48px, 15vw, 72px) !important; }
          .cat-cell { height: 220px !important; }
          .cat-label-center { font-size: 28px !important; }
        }
        @media (max-width: 768px) {
          .cat-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
};

export default Home;
