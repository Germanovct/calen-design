import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import heroImg from '../assets/hero.png';

const Home = () => {
  const { products, fetchProducts, loading } = useProducts();

  useEffect(() => {
    // Cargar productos activos destacados para la Home
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
    <div style={{ paddingBottom: '80px', backgroundColor: '#FFFFFF' }}>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        height: '80vh',
        minHeight: '600px',
        background: `url(${heroImg}) no-repeat center center`,
        backgroundSize: 'cover',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '0 80px',
        borderBottom: 'var(--border-brutal)',
        marginBottom: '80px'
      }}>
        {/* Semi-transparent overlay to ensure contrast */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          zIndex: 1
        }} />

        <div style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '600px',
          backgroundColor: 'var(--primary-yellow)',
          padding: '48px',
          border: 'var(--border-brutal)',
          boxShadow: 'var(--shadow-brutal-lg)',
          borderRadius: '0px'
        }}>
          <h1 style={{ fontSize: '64px', lineHeight: '1.0', marginBottom: '20px', fontWeight: '900', fontFamily: 'var(--display)' }}>
            CALEN DESIGN
          </h1>
          <p style={{ fontSize: '18px', color: '#000000', marginBottom: '32px', lineHeight: '1.6', fontWeight: '800', fontFamily: 'var(--display)' }}>
            ROPA DE DISEÑO ATEMPORAL, CON CORTES MINIMALISTAS Y TEXTURAS QUE INSPIRAN COMODIDAD. CREADO ESPECIALMENTE PARA VOS.
          </p>
          <Link to="/productos" className="brutal-btn brutal-btn-black" style={{ padding: '16px 36px', fontSize: '16px' }}>
            VER COLECCIÓN
          </Link>
        </div>
      </section>

      {/* Grid de Categorías */}
      <section className="container" style={{ marginBottom: '100px' }}>
        <h2 className="section-title">COMPRAR POR CATEGORÍA</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '32px',
          marginTop: '32px'
        }}>
          {categories.map((cat) => (
            <Link 
              key={cat.slug} 
              to={`/productos?category=${cat.slug}`}
              style={{
                position: 'relative',
                height: '260px',
                borderRadius: '0px',
                border: 'var(--border-brutal)',
                boxShadow: 'var(--shadow-brutal)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'var(--transition)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(-3px, -3px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-brutal-hover)';
                const img = e.currentTarget.querySelector('img');
                if (img) img.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'var(--shadow-brutal)';
                const img = e.currentTarget.querySelector('img');
                if (img) img.style.transform = 'scale(1)';
              }}
            >
              <img 
                src={cat.image} 
                alt={cat.name} 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  transition: 'var(--transition)'
                }}
              />
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                zIndex: 1
              }} />
              <span style={{
                position: 'relative',
                zIndex: 2,
                color: 'var(--white)',
                fontSize: '22px',
                fontFamily: 'var(--display)',
                fontWeight: '900',
                textTransform: 'uppercase',
                backgroundColor: '#000000',
                border: '2px solid var(--white)',
                padding: '8px 16px',
                boxShadow: '3px 3px 0px #000000'
              }}>
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="container">
        <h2 className="section-title">DESTACADOS</h2>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px 0', fontFamily: 'var(--display)', fontWeight: '800' }}>CARGANDO CATÁLOGO...</div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '40px',
            marginTop: '32px'
          }}>
            {products.slice(0, 4).map((product, idx) => (
              <div 
                key={product.id} 
                style={{
                  transform: idx % 2 === 0 ? 'translateY(16px)' : 'none',
                  marginTop: idx % 2 !== 0 ? '16px' : '0px'
                }}
              >
                <ProductCard product={product} />
              </div>
            ))}
            {products.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', fontFamily: 'var(--display)', fontWeight: '800', padding: '32px', border: 'var(--border-brutal)', backgroundColor: 'var(--primary-pink)' }}>
                NO HAY PRODUCTOS DESTACADOS CARGADOS AÚN.
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
