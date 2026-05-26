import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import Filters from '../components/Filters';
import ProductCard from '../components/ProductCard';

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, categories, fetchProducts, fetchCategories, loading } = useProducts();

  // Filtros locales
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category'));
  const [selectedSize, setSelectedSize] = useState(searchParams.get('size'));
  const [selectedColor, setSelectedColor] = useState(searchParams.get('color'));

  useEffect(() => {
    fetchCategories();
  }, []);

  // Recargar productos ante cualquier cambio de filtro
  useEffect(() => {
    const filters = {
      category: selectedCategory,
      size: selectedSize,
      color: selectedColor,
      active: true
    };
    fetchProducts(filters);

    // Sincronizar parámetros de búsqueda en la URL
    const params = {};
    if (selectedCategory) params.category = selectedCategory;
    if (selectedSize) params.size = selectedSize;
    if (selectedColor) params.color = selectedColor;
    setSearchParams(params);
  }, [selectedCategory, selectedSize, selectedColor]);

  // Si cambia la URL externamente, actualizar estados de filtros
  useEffect(() => {
    setSelectedCategory(searchParams.get('category'));
    setSelectedSize(searchParams.get('size'));
    setSelectedColor(searchParams.get('color'));
  }, [searchParams]);

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSelectedSize(null);
    setSelectedColor(null);
  };

  return (
    <div className="container" style={{ padding: '60px 24px 100px 24px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '48px', fontFamily: 'var(--display)', fontSize: '56px', fontWeight: '900', textTransform: 'uppercase' }}>
        Nuestras Prendas
      </h1>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '40px',
        alignItems: 'flex-start'
      }}>
        {/* Panel lateral de filtros */}
        <aside style={{
          flex: '1 1 260px',
          maxWidth: '320px',
          width: '100%',
          position: 'sticky',
          top: '120px'
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

        {/* Grilla de productos */}
        <main style={{
          flex: '3 1 600px',
          width: '100%'
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '64px 0', fontFamily: 'var(--display)', fontWeight: '800', fontSize: '18px' }}>
              CARGANDO CATÁLOGO DE PRENDAS...
            </div>
          ) : (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '40px'
              }}>
                {products.map((product, idx) => (
                  <div 
                    key={product.id}
                    style={{
                      transform: idx % 2 === 0 ? 'translateY(12px)' : 'none',
                      marginTop: idx % 2 !== 0 ? '12px' : '0px'
                    }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {products.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '80px 24px',
                  color: 'var(--black)',
                  backgroundColor: 'var(--primary-pink)',
                  borderRadius: '0px',
                  border: 'var(--border-brutal)',
                  boxShadow: 'var(--shadow-brutal)',
                  width: '100%'
                }}>
                  <p style={{ fontSize: '20px', fontWeight: '900', fontFamily: 'var(--display)', textTransform: 'uppercase', marginBottom: '16px' }}>
                    No se encontraron prendas que coincidan.
                  </p>
                  <button onClick={handleClearFilters} className="brutal-btn brutal-btn-black">
                    VER TODAS LAS PRENDAS
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Catalog;
