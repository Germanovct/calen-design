import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import Filters from '../components/Filters';
import ProductCard from '../components/ProductCard';

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, categories, fetchProducts, fetchCategories, loading } = useProducts();

  // Inicializar filtros desde la URL solo en el primer render
  const [selectedCategory, setSelectedCategory] = useState(() => searchParams.get('category'));
  const [selectedSize, setSelectedSize] = useState(() => searchParams.get('size'));
  const [selectedColor, setSelectedColor] = useState(() => searchParams.get('color'));

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

  return (
    <div style={{ backgroundColor: '#0A0A0A', minHeight: '100vh' }}>
      {/* ── HEADER EDITORIAL ── */}
      <div style={{
        borderBottom: '1px solid #1A1A1A',
        padding: '60px 0 40px 0',
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.25em',
                color: '#FF2D2D',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '12px',
              }}>
                — COLECCIÓN 2026
              </span>
              <h1 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(48px, 8vw, 96px)',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '-0.01em',
                color: '#FFFFFF',
                lineHeight: 0.95,
              }}>
                NUESTRAS<br />PRENDAS
              </h1>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.2em',
                color: '#333',
                textTransform: 'uppercase',
                display: 'block',
              }}>
                {products.length} PRENDAS
              </span>
              {(selectedCategory || selectedSize || selectedColor) && (
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  color: '#FF2D2D',
                  textTransform: 'uppercase',
                  marginTop: '4px',
                  display: 'block',
                }}>
                  FILTROS ACTIVOS
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── LAYOUT: FILTROS + GRID ── */}
      <div className="container" style={{ padding: '40px 24px 120px 24px' }}>
        <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

          {/* Filtros */}
          <aside style={{
            flex: '0 0 240px',
            position: 'sticky',
            top: '100px',
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
                textAlign: 'center',
                padding: '80px 0',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 900,
                fontSize: '13px',
                letterSpacing: '0.18em',
                color: '#333',
                textTransform: 'uppercase',
              }}>
                CARGANDO CATÁLOGO...
              </div>
            ) : (
              <>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: '1px',
                  backgroundColor: '#1A1A1A',
                  outline: '1px solid #1A1A1A',
                }}>
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {products.length === 0 && (
                  <div style={{
                    textAlign: 'center',
                    padding: '80px 24px',
                    border: '1px solid #1A1A1A',
                    backgroundColor: '#0A0A0A',
                  }}>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: 900,
                      fontFamily: "'Space Grotesk', sans-serif",
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      marginBottom: '24px',
                      color: '#555',
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
    </div>
  );
};

export default Catalog;
