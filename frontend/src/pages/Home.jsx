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
    <div style={{ paddingBottom: '64px' }}>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        height: '600px',
        background: `url(${heroImg}) no-repeat center center`,
        backgroundSize: 'cover',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: '80px',
        marginBottom: '64px'
      }}>
        {/* Dark overlay for readability */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          zIndex: 1
        }} />

        <div style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '500px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '48px',
          borderRadius: 'var(--border-radius)',
          boxShadow: 'var(--shadow-md)'
        }}>
          <h1 style={{ fontSize: '44px', lineHeight: '1.2', marginBottom: '16px' }}>Calen Design</h1>
          <p style={{ fontSize: '16px', color: 'var(--gray-medium)', marginBottom: '32px', lineHeight: '1.8' }}>
            Ropa de diseño atemporal, con cortes minimalistas y texturas que inspiran comodidad. Creado especialmente para vos.
          </p>
          <Link to="/productos" className="btn-primary">
            Ver Colección
          </Link>
        </div>
      </section>

      {/* Grid de Categorías */}
      <section className="container" style={{ marginBottom: '80px' }}>
        <h2 className="section-title">Comprar por Categoría</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '24px',
          marginTop: '32px'
        }}>
          {categories.map((cat) => (
            <Link 
              key={cat.slug} 
              to={`/productos?category=${cat.slug}`}
              style={{
                position: 'relative',
                height: '240px',
                borderRadius: 'var(--border-radius)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)'
              }}
              onMouseEnter={(e) => {
                const img = e.currentTarget.querySelector('img');
                if (img) img.style.transform = 'scale(1.08)';
              }}
              onMouseLeave={(e) => {
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
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                zIndex: 1
              }} />
              <span style={{
                position: 'relative',
                zIndex: 2,
                color: 'var(--white)',
                fontSize: '20px',
                fontFamily: 'var(--serif)',
                fontWeight: '600',
                letterSpacing: '0.5px'
              }}>
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="container">
        <h2 className="section-title">Destacados</h2>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--gray-medium)' }}>Cargando catálogo...</div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '32px',
            marginTop: '32px'
          }}>
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {products.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--gray-medium)', padding: '32px' }}>
                No hay productos destacados cargados aún.
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
