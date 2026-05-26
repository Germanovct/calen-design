import React from 'react';

const Filters = ({ categories, selectedCategory, onSelectCategory, selectedSize, onSelectSize, selectedColor, onSelectColor, onClearFilters }) => {
  const sizes = ['S', 'M', 'L', 'XL'];
  const colors = ['Negro', 'Blanco', 'Rosa', 'Nude', 'Camel'];

  return (
    <div style={{
      backgroundColor: 'var(--white)',
      padding: '24px',
      borderRadius: 'var(--border-radius)',
      border: '1px solid var(--gray-light)',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '18px', fontFamily: 'var(--serif)' }}>Filtros</h3>
        <button 
          onClick={onClearFilters} 
          style={{ 
            fontSize: '12px', 
            textDecoration: 'underline', 
            color: 'var(--gray-medium)' 
          }}
        >
          Limpiar
        </button>
      </div>

      {/* CATEGORIES */}
      <div>
        <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px', fontWeight: '600' }}>Categoría</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => onSelectCategory(null)}
            style={{
              textAlign: 'left',
              padding: '6px 8px',
              borderRadius: '4px',
              fontSize: '14px',
              backgroundColor: !selectedCategory ? 'var(--nude-light)' : 'transparent',
              fontWeight: !selectedCategory ? '600' : '400'
            }}
          >
            Todas
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              style={{
                textAlign: 'left',
                padding: '6px 8px',
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: selectedCategory === cat.slug ? 'var(--nude-light)' : 'transparent',
                fontWeight: selectedCategory === cat.slug ? '600' : '400'
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* SIZES */}
      <div>
        <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px', fontWeight: '600' }}>Talle</h4>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => onSelectSize(selectedSize === size ? null : size)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '1px solid var(--gray-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                backgroundColor: selectedSize === size ? 'var(--dark-black)' : 'var(--white)',
                color: selectedSize === size ? 'var(--white)' : 'var(--dark-black)'
              }}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* COLORS */}
      <div>
        <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px', fontWeight: '600' }}>Color</h4>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => onSelectColor(selectedColor === color ? null : color)}
              style={{
                padding: '6px 12px',
                borderRadius: '20px',
                border: '1px solid var(--gray-light)',
                fontSize: '12px',
                backgroundColor: selectedColor === color ? 'var(--dark-black)' : 'var(--white)',
                color: selectedColor === color ? 'var(--white)' : 'var(--dark-black)'
              }}
            >
              {color}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filters;
