import React from 'react';

const Filters = ({ categories, selectedCategory, onSelectCategory, selectedSize, onSelectSize, selectedColor, onSelectColor, onClearFilters }) => {
  const sizes = ['S', 'M', 'L', 'XL'];
  const colors = ['Negro', 'Blanco', 'Rosa', 'Nude', 'Camel'];

  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      padding: '24px',
      borderRadius: '0px',
      border: 'var(--border-brutal)',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--gray-mid)', paddingBottom: '12px' }}>
        <h3 style={{ fontSize: '18px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: 'var(--white)', letterSpacing: '0.05em' }}>FILTROS</h3>
        <button 
          onClick={onClearFilters} 
          style={{ 
            fontSize: '12px', 
            textDecoration: 'underline', 
            fontWeight: '800',
            fontFamily: 'var(--display)',
            textTransform: 'uppercase',
            color: 'var(--accent-red)'
          }}
        >
          LIMPIAR
        </button>
      </div>

      {/* CATEGORIES */}
      <div>
        <h4 style={{ fontSize: '11px', fontFamily: 'var(--display)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px', fontWeight: '900', color: 'var(--gray-text)' }}>Categoría</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => onSelectCategory(null)}
            aria-pressed={!selectedCategory}
            style={{
              textAlign: 'left',
              padding: '10px 14px',
              borderRadius: '0px',
              border: '1px solid var(--white)',
              fontSize: '13px',
              fontFamily: 'var(--display)',
              fontWeight: '800',
              textTransform: 'uppercase',
              backgroundColor: !selectedCategory ? 'var(--accent-red)' : 'var(--base-dark)',
              color: 'var(--white)',
              transition: 'var(--transition)'
            }}
          >
            TODAS
          </button>
          {categories.map((cat) => {
            const active = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                aria-pressed={active}
                style={{
                  textAlign: 'left',
                  padding: '10px 14px',
                  borderRadius: '0px',
                  border: '1px solid var(--white)',
                  fontSize: '13px',
                  fontFamily: 'var(--display)',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  backgroundColor: active ? 'var(--accent-red)' : 'var(--base-dark)',
                  color: 'var(--white)',
                  transition: 'var(--transition)'
                }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* SIZES */}
      <div>
        <h4 style={{ fontSize: '11px', fontFamily: 'var(--display)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px', fontWeight: '900', color: 'var(--gray-text)' }}>Talle</h4>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {sizes.map((size) => {
            const active = selectedSize === size;
            return (
              <button
                key={size}
                onClick={() => onSelectSize(active ? null : size)}
                aria-pressed={active}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '0px',
                  border: '1px solid var(--white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontFamily: 'var(--display)',
                  fontWeight: '900',
                  backgroundColor: active ? 'var(--accent-red)' : 'var(--base-dark)',
                  color: 'var(--white)',
                  transition: 'var(--transition)'
                }}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* COLORS */}
      <div>
        <h4 style={{ fontSize: '11px', fontFamily: 'var(--display)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px', fontWeight: '900', color: 'var(--gray-text)' }}>Color</h4>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {colors.map((color) => {
            const active = selectedColor === color;
            return (
              <button
                key={color}
                onClick={() => onSelectColor(active ? null : color)}
                aria-pressed={active}
                style={{
                  padding: '8px 14px',
                  borderRadius: '0px',
                  border: '1px solid var(--white)',
                  fontSize: '12px',
                  fontFamily: 'var(--display)',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  backgroundColor: active ? 'var(--accent-red)' : 'var(--base-dark)',
                  color: 'var(--white)',
                  transition: 'var(--transition)'
                }}
              >
                {color}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Filters;
