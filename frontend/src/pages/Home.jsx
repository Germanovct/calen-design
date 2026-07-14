import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/Skeleton';
import heroImg from '../assets/hero.png';

const Home = () => {
  const { products, fetchProducts, loading } = useProducts();

  useEffect(() => {
    fetchProducts({ active: true });
  }, []);

  const categories = [
    { name: 'Remeras', slug: 'remeras', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800' },
    { name: 'Buzos', slug: 'buzos', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800' },
    { name: 'Vestidos', slug: 'vestidos', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800' },
    { name: 'Lencería', slug: 'lenceria', image: 'https://images.unsplash.com/photo-1616166330003-8e552a243098?w=800' },
    { name: 'Abrigos', slug: 'abrigos', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800' },
  ];

  return (
    <div style={{ backgroundColor: 'var(--base-dark)' }}>
      {/* ════════════════════════════════════════
          HERO EDITORIAL Fullscreen
      ════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        height: '100vh',
        minHeight: '640px',
        background: `url(${heroImg}) no-repeat center center`,
        backgroundSize: 'cover',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        borderBottom: 'var(--border-brutal)',
        overflow: 'hidden',
      }}>

        {/* Overlay oscuro */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(10,10,10,0.15) 0%, rgba(10,10,10,0.75) 65%, var(--base-dark) 100%)',
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
            fontFamily: "var(--display)",
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.25em',
            color: 'var(--gray-text)',
            textTransform: 'uppercase',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <span style={{ display: 'inline-block', width: '32px', height: '1px', backgroundColor: 'var(--accent-red)' }} />
            COL. 01 — 2026
            <span style={{ display: 'inline-block', width: '32px', height: '1px', backgroundColor: 'var(--accent-red)' }} />
          </div>

          {/* Título gigante — mobile-safe */}
          <h1 className="hero-title" style={{
            fontFamily: "var(--display)",
            fontSize: 'clamp(56px, 12vw, 180px)',
            fontWeight: 900,
            lineHeight: 0.9,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: 'var(--white)',
            marginBottom: '24px',
            marginLeft: '-4px',
          }}>
            CALEN<br />DESIGN
          </h1>

          {/* Subtítulo */}
          <p style={{
            fontFamily: "var(--display)",
            fontSize: '15px',
            fontWeight: 300,
            fontStyle: 'italic',
            color: 'var(--gray-text-light)',
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
            className="hover-lift"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px 40px',
              fontFamily: "var(--display)",
              fontWeight: 900,
              fontSize: '13px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              backgroundColor: 'var(--white)',
              color: 'var(--black)',
              border: 'var(--border-brutal)',
              transition: 'var(--transition)',
              cursor: 'pointer',
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
          <span style={{ display: 'block', fontFamily: "var(--display)", fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', color: 'var(--gray-text)', textTransform: 'uppercase', lineHeight: 2 }}>
            34°36'S — 58°22'O
          </span>
          <span style={{ display: 'block', fontFamily: "var(--display)", fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', color: 'var(--gray-text)', textTransform: 'uppercase', lineHeight: 2 }}>
            Buenos Aires, ARG
          </span>
          <span style={{ display: 'block', fontFamily: "var(--display)", fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--accent-red)', lineHeight: 2 }}>●</span>
        </div>
      </section>


      {/* ════════════════════════════════════════
          CATEGORÍAS — GRILLA OSCURA
      ════════════════════════════════════════ */}
      <section style={{ padding: '100px 0', backgroundColor: 'var(--base-dark)' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '40px',
            paddingBottom: '16px',
            borderBottom: '1px solid var(--gray-mid)',
            flexWrap: 'wrap',
            gap: '16px',
          }}>
            <h2 style={{
              fontFamily: "var(--display)",
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--white)',
            }}>
              COMPRAR POR<br /><span style={{ color: 'var(--accent-red)' }}>CATEGORÍA</span>
            </h2>
            <span style={{
              fontFamily: "var(--display)",
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.2em',
              color: 'var(--gray-text)',
              textTransform: 'uppercase',
            }}>
              01 / 02
            </span>
          </div>
        </div>

        {/* Grid de categorías — responsive */}
        <style>{`
          .cat-grid {
            display: grid;
            grid-template-columns: repeat(${categories.length}, 1fr);
            gap: 1px;
            background-color: var(--bg-card);
          }
          @media (max-width: 900px) {
            .cat-grid {
              grid-template-columns: repeat(3, 1fr) !important;
            }
          }
          @media (max-width: 600px) {
            .cat-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
          .cat-cell { position: relative; overflow: hidden; cursor: pointer; display: block; background: var(--base-dark); }
          .cat-cell img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(100%); transition: filter 0.35s ease, transform 0.4s ease; display: block; }
          .cat-overlay {
            position: absolute; inset: 0; z-index: 1;
            background: linear-gradient(to top, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.15) 60%);
            transition: background 0.35s ease;
          }
          .cat-num {
            font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 700;
            position: absolute; top: 16px; left: 16px; z-index: 2;
            letter-spacing: 0.2em; color: rgba(255,255,255,0.3); text-transform: uppercase;
          }
          /* Label abajo por defecto */
          .cat-label-bottom {
            position: absolute; bottom: 20px; left: 16px; right: 16px; z-index: 2;
            font-family: 'Space Grotesk', sans-serif; font-size: 18px; font-weight: 900;
            text-transform: uppercase; letter-spacing: 0.06em; color: var(--white);
            transition: opacity 0.25s ease, transform 0.25s ease;
          }
          /* Label centrado en hover */
          .cat-label-center {
            position: absolute; inset: 0; z-index: 3;
            display: flex; align-items: center; justify-content: center;
            font-family: 'Space Grotesk', sans-serif; font-size: clamp(32px, 4vw, 56px); font-weight: 900;
            text-transform: uppercase; letter-spacing: 0.04em; color: var(--white);
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

        <div className="cat-grid">
          {categories.map((cat, idx) => (
            <Link
              key={cat.slug}
              to={`/productos?category=${cat.slug}`}
              className="cat-cell"
              style={{ height: '380px' }}
            >
              <span className="cat-num">0{idx + 1}</span>
              <img src={cat.image} alt={cat.name} loading="lazy" />
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
      <section style={{ padding: '80px 0 120px 0', backgroundColor: 'var(--base-dark)' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '40px',
            paddingBottom: '16px',
            borderBottom: '1px solid var(--gray-mid)',
            flexWrap: 'wrap',
            gap: '16px',
          }}>
            <h2 style={{
              fontFamily: "var(--display)",
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--white)',
            }}>
              DESTACADOS
            </h2>
            <Link
              to="/productos"
              style={{
                fontFamily: "var(--display)",
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: 'var(--gray-text)',
                textTransform: 'uppercase',
                borderBottom: '1px solid var(--gray-mid)',
                paddingBottom: '2px',
                transition: 'var(--transition)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--white)'; e.currentTarget.style.borderBottomColor = 'var(--white)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--gray-text)'; e.currentTarget.style.borderBottomColor = 'var(--gray-mid)'; }}
            >
              VER TODO →
            </Link>
          </div>
        </div>

        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1px',
            backgroundColor: 'var(--bg-card)',
          }}>
            {[...Array(4)].map((_, idx) => (
              <ProductCardSkeleton key={idx} />
            ))}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1px',
            backgroundColor: 'var(--bg-card)',
          }}>
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {products.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px 24px', border: '1px solid var(--gray-mid)', fontFamily: "var(--display)", fontWeight: 900, fontSize: '13px', letterSpacing: '0.1em', color: 'var(--gray-text)', textTransform: 'uppercase' }}>
                NO HAY PRODUCTOS DESTACADOS CARGADOS AÚN.
              </div>
            )}
          </div>
        )}
      </section>

      {/* ════════════════════════════════════════
          MANIFESTO EDITORIAL
      ════════════════════════════════════════ */}
      <section style={{ backgroundColor: 'var(--base-dark)', borderTop: '1px solid var(--gray-mid)', padding: '100px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '80px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 340px' }}>
            <span style={{ fontFamily: "var(--display)", fontSize: '11px', fontWeight: 700, letterSpacing: '0.25em', color: 'var(--accent-red)', textTransform: 'uppercase', display: 'block', marginBottom: '24px' }}>
              — NUESTRA FILOSOFÍA
            </span>
            <h2 style={{ fontFamily: "var(--display)", fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.95, color: 'var(--white)', marginBottom: '32px' }}>
              DISEÑO<br /><span style={{ color: 'var(--accent-red)' }}>SIN</span><br />FILTROS
            </h2>
          </div>
          <div style={{ flex: '2 1 400px' }}>
            <p style={{ fontFamily: "var(--sans)", fontSize: '16px', fontWeight: 400, color: 'var(--gray-text)', lineHeight: 1.9, marginBottom: '24px' }}>
              Calen Design nace de la convicción de que la moda no tiene que ser ruidosa para ser poderosa. Cada prenda es un ejercicio de precisión: cortes limpios, materiales que importan, siluetas que permanecen.
            </p>
            <p style={{ fontFamily: "var(--display)", fontSize: '13px', fontWeight: 300, fontStyle: 'italic', color: 'var(--gray-text-light)', lineHeight: 1.8 }}>
              Diseño independiente, con identidad propia.
            </p>
            <div style={{ marginTop: '40px', display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
              {[['100%', 'Diseño propio'], ['0%', 'Fast fashion'], ['∞', 'Calidad']].map(([num, label]) => (
                <div key={label}>
                  <div style={{ fontFamily: "var(--display)", fontSize: '40px', fontWeight: 900, color: 'var(--white)', lineHeight: 1 }}>{num}</div>
                  <div style={{ fontFamily: "var(--display)", fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--gray-text)', textTransform: 'uppercase', marginTop: '6px' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile responsive para hero title y celdas */}
      <style>{`
        @media (max-width: 640px) {
          .hero-title { font-size: clamp(48px, 15vw, 72px) !important; }
          .cat-cell { height: 220px !important; }
          .cat-label-center { font-size: 28px !important; }
        }
      `}</style>
    </div>
  );
};

export default Home;
