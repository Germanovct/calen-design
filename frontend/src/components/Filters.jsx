import React from 'react';

const Filters = ({ categories, selectedCategory, onSelectCategory, selectedSize, onSelectSize, selectedColor, onSelectColor, onClearFilters }) => {
  const sizes = ['S', 'M', 'L', 'XL'];
  const colors = ['Negro', 'Blanco', 'Rosa', 'Nude', 'Camel'];

  return (
    <div style={{
      backgroundColor: 'var(--white)',
      padding: '24px',
      borderRadius: '0px',
      border: 'var(--border-brutal)',
      boxShadow: 'var(--shadow-brutal)',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #000000', paddingBottom: '12px' }}>
        <h3 style={{ fontSize: '20px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>FILTROS</h3>
        <button 
          onClick={onClearFilters} 
          style={{ 
            fontSize: '12px', 
            textDecoration: 'underline', 
            fontWeight: '800',
            fontFamily: 'var(--display)',
            textTransform: 'uppercase',
            color: 'var(--black)'
          }}
        >
          LIMPIAR
        </button>
      </div>

      {/* CATEGORIES */}
      <div>
        <h4 style={{ fontSize: '12px', fontFamily: 'var(--display)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px', fontWeight: '900' }}>Categoría</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => onSelectCategory(null)}
            style={{
              textAlign: 'left',
              padding: '10px 14px',
              borderRadius: '0px',
              border: '2px solid #000000',
              fontSize: '13px',
              fontFamily: 'var(--display)',
              fontWeight: '800',
              textTransform: 'uppercase',
              backgroundColor: !selectedCategory ? 'var(--primary-yellow)' : 'var(--white)',
              color: 'var(--black)',
              boxShadow: !selectedCategory ? '2px 2px 0px #000000' : 'none',
              transform: !selectedCategory ? 'translate(-1px, -1px)' : 'none',
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
                style={{
                  textAlign: 'left',
                  padding: '10px 14px',
                  borderRadius: '0px',
                  border: '2px solid #000000',
                  fontSize: '13px',
                  fontFamily: 'var(--display)',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  backgroundColor: active ? 'var(--primary-yellow)' : 'var(--white)',
                  color: 'var(--black)',
                  boxShadow: active ? '2px 2px 0px #000000' : 'none',
                  transform: active ? 'translate(-1px, -1px)' : 'none',
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
        <h4 style={{ fontSize: '12px', fontFamily: 'var(--display)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px', fontWeight: '900' }}>Talle</h4>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {sizes.map((size) => {
            const active = selectedSize === size;
            return (
              <button
                key={size}
                onClick={() => onSelectSize(active ? null : size)}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '0px',
                  border: '2px solid #000000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontFamily: 'var(--display)',
                  fontWeight: '900',
                  backgroundColor: active ? 'var(--primary-pink)' : 'var(--white)',
                  color: 'var(--black)',
                  boxShadow: active ? '2px 2px 0px #000000' : 'none',
                  transform: active ? 'translate(-1px, -1px)' : 'none',
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
        <h4 style={{ fontSize: '12px', fontFamily: 'var(--display)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px', fontWeight: '900' }}>Color</h4>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {colors.map((color) => {
            const active = selectedColor === color;
            return (
              <button
                key={color}
                onClick={() => onSelectColor(active ? null : color)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '0px',
                  border: '2px solid #000000',
                  fontSize: '12px',
                  fontFamily: 'var(--display)',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  backgroundColor: active ? 'var(--primary-pink)' : 'var(--white)',
                  color: 'var(--black)',
                  boxShadow: active ? '2px 2px 0px #000000' : 'none',
                  transform: active ? 'translate(-1px, -1px)' : 'none',
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
