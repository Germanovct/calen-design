import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import Filters from '../components/Filters';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/Skeleton';

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, categories, fetchProducts, fetchCategories, loading } = useProducts();

  // Inicializar filtros desde la URL solo en el primer render
  const [selectedCategory, setSelectedCategory] = useState(() => searchParams.get('category'));
  const [selectedSize, setSelectedSize] = useState(() => searchParams.get('size'));
  const [selectedColor, setSelectedColor] = useState(() => searchParams.get('color'));

  // Estados de UI adicionales
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState('');

  // Ref para evitar que setSearchParams dispare re-lecturas de URL
  const isInternalUpdate = useRef(false);

  // Cargar categorías una sola vez al montar
  useEffect(() => { fetchCategories(); }, []);

  // Disparar fetchProducts cada vez que cambian los filtros y sincronizar URL
  useEffect(() => {
    isInternalUpdate.current = true;
    const filters = {};
    if (selectedCategory) filters.category = selectedCategory;
    if (selectedSize) filters.size = selectedSize;
    if (selectedColor) filters.color = selectedColor;

    fetchProducts(filters);

    const params = {};
    if (selectedCategory) params.category = selectedCategory;
    if (selectedSize) params.size = selectedSize;
    if (selectedColor) params.color = selectedColor;
    setSearchParams(params, { replace: true });

    // Liberar la bandera en el siguiente tick
    setTimeout(() => { isInternalUpdate.current = false; }, 0);
  }, [selectedCategory, selectedSize, selectedColor]);

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSelectedSize(null);
    setSelectedColor(null);
  };

  // Ordenar productos en base al estado
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-asc') {
      return parseFloat(a.price) - parseFloat(b.price);
    }
    if (sortBy === 'price-desc') {
      return parseFloat(b.price) - parseFloat(a.price);
    }
    if (sortBy === 'name-asc') {
      return a.name.localeCompare(b.name);
    }
    return 0; // Orden por defecto
  });

  return (
    <div style={{ backgroundColor: 'var(--base-dark)', minHeight: '100vh' }}>
      {/* ── HEADER EDITORIAL ── */}
      <div style={{
        borderBottom: '1px solid var(--gray-mid)',
        padding: '40px 0 40px 0',
      }}>
        <div className="container">
          {/* Breadcrumbs */}
          <div style={{
            fontSize: '10px',
            fontFamily: 'var(--display)',
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: 'var(--gray-text)',
            marginBottom: '16px',
            textTransform: 'uppercase',
          }}>
            <Link to="/" style={{ color: 'var(--gray-text)', transition: 'var(--transition)' }} onMouseEnter={(e) => e.target.style.color = 'var(--white)'} onMouseLeave={(e) => e.target.style.color = 'var(--gray-text)'}>INICIO</Link>
            <span style={{ margin: '0 8px' }}>&gt;</span>
            <span style={{ color: 'var(--white)' }}>CATÁLOGO</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={{
                fontFamily: "var(--display)",
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.25em',
                color: 'var(--accent-red)',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '12px',
              }}>
                — COLECCIÓN 2026
              </span>
              <h1 style={{
                fontFamily: "var(--display)",
                fontSize: 'clamp(48px, 8vw, 96px)',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '-0.01em',
                color: 'var(--white)',
                lineHeight: 0.95,
              }}>
                NUESTRAS<br />PRENDAS
              </h1>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
              <span style={{
                fontFamily: "var(--display)",
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.2em',
                color: 'var(--gray-text-light)',
                textTransform: 'uppercase',
                display: 'block',
              }}>
                {products.length} PRENDAS
              </span>
              {(selectedCategory || selectedSize || selectedColor) && (
                <span style={{
                  fontFamily: "var(--display)",
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  color: 'var(--accent-red)',
                  textTransform: 'uppercase',
                  display: 'block',
                }}>
                  FILTROS ACTIVOS
                </span>
              )}
              {/* Dropdown de Ordenamiento */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, fontFamily: 'var(--display)', color: 'var(--gray-text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ORDENAR:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: 'var(--border-brutal)',
                    color: 'var(--white)',
                    fontFamily: 'var(--display)',
                    fontSize: '11px',
                    fontWeight: 900,
                    padding: '4px 8px',
                    outline: 'none',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  <option value="">Recomendados</option>
                  <option value="price-asc">Precio: Menor a Mayor</option>
                  <option value="price-desc">Precio: Mayor a Menor</option>
                  <option value="name-asc">Nombre: A-Z</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── LAYOUT: FILTROS + GRID ── */}
      <div className="container" style={{ padding: '40px 24px 120px 24px' }}>
        {/* Toggle Button for Mobile Filters */}
        <button 
          className="filter-toggle-btn"
          onClick={() => setFiltersOpen(!filtersOpen)}
          style={{
            display: 'none',
            fontFamily: "var(--display)",
            fontSize: '12px',
            fontWeight: 900,
            letterSpacing: '0.1em',
            color: 'var(--white)',
            backgroundColor: 'var(--bg-card)',
            border: 'var(--border-brutal)',
            padding: '12px 24px',
            width: '100%',
            textAlign: 'center',
            marginBottom: '24px',
            textTransform: 'uppercase',
          }}
        >
          {filtersOpen ? 'OCULTAR FILTROS' : 'MOSTRAR FILTROS'}
        </button>

        <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

          {/* Filtros Sidebar */}
          <aside className="catalog-sidebar" style={{
            flex: '0 0 240px',
            position: 'sticky',
            top: '120px',
          }}>
            <Filters
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedSize={selectedSize}
              onSelectSize={setSelectedSize}
              selectedColor={selectedColor}
              onSelectColor={setSelectedColor}
              onClearFilters={handleClearFilters}
            />
          </aside>

          {/* Grid de productos */}
          <main style={{ flex: '1 1 600px', minWidth: 0 }}>
            {loading ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '1px',
                backgroundColor: 'var(--bg-card)',
                outline: '1px solid var(--gray-mid)',
              }}>
                {[...Array(8)].map((_, idx) => (
                  <ProductCardSkeleton key={idx} />
                ))}
              </div>
            ) : (
              <>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: '1px',
                  backgroundColor: 'var(--bg-card)',
                  outline: '1px solid var(--gray-mid)',
                }}>
                  {sortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {sortedProducts.length === 0 && (
                  <div style={{
                    textAlign: 'center',
                    padding: '80px 24px',
                    border: '1px solid var(--gray-mid)',
                    backgroundColor: 'var(--base-dark)',
                  }}>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: 900,
                      fontFamily: "var(--display)",
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      marginBottom: '24px',
                      color: 'var(--gray-text)',
                    }}>
                      NO SE ENCONTRARON PRENDAS
                    </p>
                    <button onClick={handleClearFilters} className="brutal-btn">
                      VER TODAS
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Responsive Stylesheet */}
      <style>{`
        @media (max-width: 767px) {
          .catalog-sidebar {
            display: ${filtersOpen ? 'block' : 'none'} !important;
            flex: 0 0 100% !important;
            width: 100% !important;
            position: static !important;
            margin-bottom: 24px;
          }
          .filter-toggle-btn {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Catalog;
