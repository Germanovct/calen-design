import React from 'react';

const VariantSelector = ({ variants, selectedSize, onSelectSize, selectedColor, onSelectColor }) => {
  // Obtener todos los talles y colores únicos del listado de variantes
  const allSizes = Array.from(new Set(variants.map(v => v.size).filter(Boolean)));
  const allColors = Array.from(new Set(variants.map(v => v.color).filter(Boolean)));

  // Determinar stock para un color y talle específicos
  const getStock = (size, color) => {
    const match = variants.find(v => v.size === size && v.color === color);
    return match ? match.stock : 0;
  };

  // Determinar si un talle está disponible para el color seleccionado (o en general)
  const isSizeAvailable = (size) => {
    if (selectedColor) {
      return getStock(size, selectedColor) > 0;
    }
    return variants.some(v => v.size === size && v.stock > 0);
  };

  // Determinar si un color está disponible para el talle seleccionado (o en general)
  const isColorAvailable = (color) => {
    if (selectedSize) {
      return getStock(selectedSize, color) > 0;
    }
    return variants.some(v => v.color === color && v.stock > 0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* SELECCIÓN DE TALLE */}
      {allSizes.length > 0 && (
        <div>
          <span style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
            Talle: {selectedSize || 'Seleccionar'}
          </span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {allSizes.map((size) => {
              const available = isSizeAvailable(size);
              const active = selectedSize === size;
              
              return (
                <button
                  key={size}
                  onClick={() => onSelectSize(active ? null : size)}
                  disabled={!available}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: active ? '2px solid var(--dark-black)' : '1px solid var(--gray-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    backgroundColor: active ? 'var(--dark-black)' : 'var(--white)',
                    color: active ? 'var(--white)' : 'var(--dark-black)',
                    opacity: available ? 1 : 0.25,
                    cursor: available ? 'pointer' : 'not-allowed',
                    fontWeight: active ? '600' : '400'
                  }}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* SELECCIÓN DE COLOR */}
      {allColors.length > 0 && (
        <div>
          <span style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
            Color: {selectedColor || 'Seleccionar'}
          </span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {allColors.map((color) => {
              const available = isColorAvailable(color);
              const active = selectedColor === color;
              
              return (
                <button
                  key={color}
                  onClick={() => onSelectColor(active ? null : color)}
                  disabled={!available}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: active ? '2px solid var(--dark-black)' : '1px solid var(--gray-light)',
                    fontSize: '12px',
                    backgroundColor: active ? 'var(--dark-black)' : 'var(--white)',
                    color: active ? 'var(--white)' : 'var(--dark-black)',
                    opacity: available ? 1 : 0.25,
                    cursor: available ? 'pointer' : 'not-allowed',
                    fontWeight: active ? '600' : '400'
                  }}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default VariantSelector;
