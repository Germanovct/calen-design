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
    <div className="container" style={{ padding: '40px 24px 80px 24px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px', fontFamily: 'var(--serif)' }}>Nuestras Prendas</h1>

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
          top: '100px'
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
            <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--gray-medium)' }}>
              Cargando catálogo de prendas...
            </div>
          ) : (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '32px'
              }}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {products.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '80px 0',
                  color: 'var(--gray-medium)',
                  backgroundColor: 'var(--white)',
                  borderRadius: 'var(--border-radius)',
                  border: '1px solid var(--gray-light)',
                  width: '100%'
                }}>
                  <p style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>
                    No se encontraron prendas que coincidan.
                  </p>
                  <button onClick={handleClearFilters} className="btn-primary" style={{ marginTop: '12px' }}>
                    Ver todos los productos
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
