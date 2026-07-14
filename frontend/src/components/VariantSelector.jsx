import React from 'react';

const VariantSelector = ({ variants, selectedSize, onSelectSize, selectedColor, onSelectColor }) => {
  const allSizes  = Array.from(new Set(variants.map(v => v.size).filter(Boolean)));
  const allColors = Array.from(new Set(variants.map(v => v.color).filter(Boolean)));

  const getStock = (size, color) => {
    const match = variants.find(v => v.size === size && v.color === color);
    return match ? match.stock : 0;
  };

  const isSizeAvailable = (size) => {
    if (selectedColor) return getStock(size, selectedColor) > 0;
    return variants.some(v => v.size === size && v.stock > 0);
  };

  const isColorAvailable = (color) => {
    if (selectedSize) return getStock(selectedSize, color) > 0;
    return variants.some(v => v.color === color && v.stock > 0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* TALLE */}
      {allSizes.length > 0 && (
        <div>
          <span style={{
            fontSize: '11px',
            fontFamily: "var(--display)",
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            display: 'block',
            marginBottom: '12px',
            color: 'var(--gray-text)',
          }}>
            TALLE
            {selectedSize && (
              <span style={{ color: 'var(--white)', marginLeft: '8px' }}>— {selectedSize}</span>
            )}
          </span>
          <div 
            role="radiogroup" 
            aria-label="Seleccionar talle" 
            style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}
          >
            {allSizes.map((size) => {
              const available = isSizeAvailable(size);
              const active    = selectedSize === size;
              return (
                <button
                  key={size}
                  onClick={() => onSelectSize(active ? null : size)}
                  disabled={!available}
                  role="radio"
                  aria-checked={active}
                  aria-label={`Talle ${size}${!available ? ' (Agotado)' : ''}`}
                  style={{
                    width: '44px',
                    height: '44px',
                    border: active ? '1px solid var(--white)' : '1px solid var(--gray-mid)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontFamily: "var(--display)",
                    fontWeight: 900,
                    backgroundColor: active ? 'var(--white)' : 'transparent',
                    color: active ? 'var(--black)' : available ? 'var(--white)' : 'var(--gray-mid)',
                    opacity: available ? 1 : 0.3,
                    cursor: available ? 'pointer' : 'not-allowed',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    transition: 'var(--transition)',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    if (available && !active) {
                      e.currentTarget.style.borderColor = 'var(--white)';
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.borderColor = 'var(--gray-mid)';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {size}
                  {/* Tachado si no disponible */}
                  {!available && (
                    <span style={{
                      position: 'absolute',
                      width: '1px',
                      height: '120%',
                      backgroundColor: 'var(--gray-mid)',
                      transform: 'rotate(45deg)',
                      pointerEvents: 'none',
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* COLOR */}
      {allColors.length > 0 && (
        <div>
          <span style={{
            fontSize: '11px',
            fontFamily: "var(--display)",
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            display: 'block',
            marginBottom: '12px',
            color: 'var(--gray-text)',
          }}>
            COLOR
            {selectedColor && (
              <span style={{ color: 'var(--white)', marginLeft: '8px' }}>— {selectedColor}</span>
            )}
          </span>
          <div 
            role="radiogroup" 
            aria-label="Seleccionar color" 
            style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}
          >
            {allColors.map((color) => {
              const available = isColorAvailable(color);
              const active    = selectedColor === color;
              return (
                <button
                  key={color}
                  onClick={() => onSelectColor(active ? null : color)}
                  disabled={!available}
                  role="radio"
                  aria-checked={active}
                  aria-label={`Color ${color}${!available ? ' (Agotado)' : ''}`}
                  style={{
                    padding: '10px 18px',
                    border: active ? '1px solid var(--white)' : '1px solid var(--gray-mid)',
                    fontSize: '12px',
                    fontFamily: "var(--display)",
                    fontWeight: 900,
                    backgroundColor: active ? 'var(--white)' : 'transparent',
                    color: active ? 'var(--black)' : available ? 'var(--white)' : 'var(--gray-mid)',
                    opacity: available ? 1 : 0.3,
                    cursor: available ? 'pointer' : 'not-allowed',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    transition: 'var(--transition)',
                  }}
                  onMouseEnter={(e) => {
                    if (available && !active) {
                      e.currentTarget.style.borderColor = 'var(--white)';
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.borderColor = 'var(--gray-mid)';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
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
