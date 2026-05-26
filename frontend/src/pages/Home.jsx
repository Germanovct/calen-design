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

/* ──────────────────────────────────────────
   Estilos inline — Dark Brutalism Editorial
   ────────────────────────────────────────── */
const styles = {
  /* HERO */
  heroSection: {
    position: 'relative',
    width: '100%',
    height: '100vh',
    minHeight: '640px',
    backgroundColor: '#0A0A0A',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'flex-end',
    borderBottom: '1px solid #FFFFFF',
  },
  heroBg: {
    position: 'absolute',
    inset: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 20%',
    backgroundRepeat: 'no-repeat',
    filter: 'grayscale(60%)',
  },
  heroOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, rgba(10,10,10,0.15) 0%, rgba(10,10,10,0.75) 70%, rgba(10,10,10,1) 100%)',
    zIndex: 1,
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    width: '100%',
    padding: '0 40px 60px 40px',
  },
  heroCollectionRef: {
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
  },
  heroCollectionLine: {
    display: 'inline-block',
    width: '32px',
    height: '1px',
    backgroundColor: '#FF2D2D',
  },
  heroTitle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 'clamp(72px, 12vw, 180px)',
    fontWeight: 900,
    lineHeight: 0.9,
    letterSpacing: '-0.02em',
    textTransform: 'uppercase',
    color: '#FFFFFF',
    marginBottom: '32px',
    /* break out of grid */
    marginLeft: '-4px',
  },
  heroSubtitle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '15px',
    fontWeight: 300,
    fontStyle: 'italic',
    color: '#888888',
    marginBottom: '36px',
    maxWidth: '480px',
    letterSpacing: '0.02em',
  },
  heroActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    flexWrap: 'wrap',
  },
  heroCta: {
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
  },
  heroCtaAlt: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#888888',
    borderBottom: '1px solid #333',
    paddingBottom: '2px',
  },
  /* Coordenadas editoriales en hero */
  heroCoords: {
    position: 'absolute',
    right: '40px',
    bottom: '60px',
    zIndex: 2,
    textAlign: 'right',
  },
  heroCoordsText: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.18em',
    color: '#444444',
    textTransform: 'uppercase',
    lineHeight: 2,
    display: 'block',
  },

  /* SECTION HEADER */
  sectionHeader: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: '40px',
    paddingBottom: '16px',
    borderBottom: '1px solid #1A1A1A',
  },
  sectionNumber: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.2em',
    color: '#333',
    textTransform: 'uppercase',
  },
  sectionViewAll: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: '#888888',
    textTransform: 'uppercase',
    borderBottom: '1px solid #333',
    paddingBottom: '2px',
    transition: 'color 0.18s ease',
  },

  /* CATEGORIES */
  categoriesSection: {
    padding: '100px 0',
    backgroundColor: '#0A0A0A',
  },
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '1px',
    backgroundColor: '#1A1A1A', /* lines between cells */
  },
  categoryCell: {
    position: 'relative',
    height: '380px',
    overflow: 'hidden',
    cursor: 'pointer',
    backgroundColor: '#0A0A0A',
    display: 'block',
  },
  categoryImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'grayscale(100%)',
    transition: 'filter 0.4s ease, transform 0.4s ease',
  },
  categoryOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.2) 60%)',
    zIndex: 1,
    transition: 'background 0.4s ease',
  },
  categoryLabel: {
    position: 'absolute',
    bottom: '20px',
    left: '16px',
    zIndex: 2,
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '18px',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: '#FFFFFF',
  },
  categoryNum: {
    position: 'absolute',
    top: '16px',
    left: '16px',
    zIndex: 2,
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.2em',
    color: '#555',
  },

  /* FEATURED PRODUCTS */
  featuredSection: {
    padding: '80px 0 120px 0',
    backgroundColor: '#0A0A0A',
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '1px',
    backgroundColor: '#1A1A1A',
  },
};

const Home = () => {
  const { products, fetchProducts, loading } = useProducts();
  const [hoveredCat, setHoveredCat] = useState(null);

  useEffect(() => {
    fetchProducts({ active: true });
  }, []);

  return (
    <div style={{ backgroundColor: '#0A0A0A', paddingBottom: 0 }}>

      {/* ── HERO FULLSCREEN ── */}
      <section style={styles.heroSection}>
        {/* Imagen de fondo en escala de grises con overlay oscuro */}
        <div
          style={{
            ...styles.heroBg,
            backgroundImage: `url(${heroImg})`,
          }}
        />
        <div style={styles.heroOverlay} />

        {/* Texto héroe editorial */}
        <div style={styles.heroContent}>
          {/* Referencia colección */}
          <div style={styles.heroCollectionRef}>
            <span style={styles.heroCollectionLine} />
            COL. 01 — 2026
            <span style={styles.heroCollectionLine} />
          </div>

          {/* Título gigante que desborda */}
          <h1 style={styles.heroTitle}>
            CALEN<br />DESIGN
          </h1>

          <p style={styles.heroSubtitle}>
            Ropa de diseño independiente — minimalista, atemporal, hecha para durar.
          </p>

          <div style={styles.heroActions}>
            <Link
              to="/productos"
              style={styles.heroCta}
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
            <Link to="/productos" style={styles.heroCtaAlt}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.borderBottomColor = '#FFFFFF'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#888888'; e.currentTarget.style.borderBottomColor = '#333'; }}
            >
              EXPLORAR CATÁLOGO →
            </Link>
          </div>
        </div>

        {/* Coordenadas editoriales */}
        <div style={styles.heroCoords}>
          <span style={styles.heroCoordsText}>34°36'S — 58°22'O</span>
          <span style={styles.heroCoordsText}>Buenos Aires, ARG</span>
          <span style={{ ...styles.heroCoordsText, color: '#FF2D2D', letterSpacing: '0.1em' }}>●</span>
        </div>
      </section>

      {/* ── CATEGORÍAS — GRILLA OSCURA ── */}
      <section style={styles.categoriesSection}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#FFFFFF' }}>
              COMPRAR POR<br /><span style={{ color: '#FF2D2D' }}>CATEGORÍA</span>
            </h2>
            <span style={styles.sectionNumber}>01 / 02</span>
          </div>
        </div>

        {/* Grid de categorías — sin contenedor para que lleguen al borde */}
        <div style={{ ...styles.categoriesGrid, gridTemplateColumns: `repeat(${categories.length}, 1fr)` }}>
          {categories.map((cat, idx) => (
            <Link
              key={cat.slug}
              to={`/productos?category=${cat.slug}`}
              style={styles.categoryCell}
              onMouseEnter={(e) => {
                setHoveredCat(cat.slug);
                const img = e.currentTarget.querySelector('img');
                if (img) { img.style.filter = 'grayscale(0%)'; img.style.transform = 'scale(1.06)'; }
                const overlay = e.currentTarget.querySelector('.cat-overlay');
                if (overlay) overlay.style.background = 'linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.3) 60%)';
              }}
              onMouseLeave={(e) => {
                setHoveredCat(null);
                const img = e.currentTarget.querySelector('img');
                if (img) { img.style.filter = 'grayscale(100%)'; img.style.transform = 'scale(1)'; }
                const overlay = e.currentTarget.querySelector('.cat-overlay');
                if (overlay) overlay.style.background = 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.2) 60%)';
              }}
            >
              <span style={styles.categoryNum}>0{idx + 1}</span>
              <img src={cat.image} alt={cat.name} style={styles.categoryImg} />
              <div className="cat-overlay" style={styles.categoryOverlay} />
              <span style={styles.categoryLabel}>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── PRODUCTOS DESTACADOS ── */}
      <section style={styles.featuredSection}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#FFFFFF' }}>
              DESTACADOS
            </h2>
            <Link to="/productos" style={styles.sectionViewAll}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.borderBottomColor = '#FFFFFF'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#888888'; e.currentTarget.style.borderBottomColor = '#333'; }}
            >
              VER TODO →
            </Link>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, fontSize: '14px', letterSpacing: '0.15em', color: '#333' }}>
            CARGANDO CATÁLOGO...
          </div>
        ) : (
          <div style={{ ...styles.productsGrid, margin: '0' }}>
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {products.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px 24px', border: '1px solid #1A1A1A', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, fontSize: '14px', letterSpacing: '0.1em', color: '#333' }}>
                NO HAY PRODUCTOS DESTACADOS CARGADOS AÚN.
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── MANIFESTO EDITORIAL ── */}
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
    </div>
  );
};

export default Home;
