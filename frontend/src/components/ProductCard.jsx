import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  // Obtener todos los talles disponibles para este producto
  const availableSizes = Array.from(new Set(
    product.variants
      ?.filter(v => v.stock > 0)
      .map(v => v.size)
      .filter(Boolean)
  ));

  // Imagen por defecto si no tiene ninguna cargada
  const defaultImage = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800';
  const imageUrl = product.images && product.images.length > 0 ? product.images[0] : defaultImage;

  return (
    <div style={{
      backgroundColor: 'var(--white)',
      borderRadius: 'var(--border-radius)',
      border: '1px solid var(--gray-light)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      transition: 'var(--transition)',
      position: 'relative'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-6px)';
      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}
    >
      <Link to={`/productos/${product.id}`} style={{ display: 'block', position: 'relative', overflow: 'hidden' }}>
        <img
          src={imageUrl}
          alt={product.name}
          style={{
            width: '100%',
            height: '320px',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
        {!product.active && (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: 'var(--gray-medium)',
            color: 'var(--white)',
            fontSize: '10px',
            padding: '4px 8px',
            borderRadius: '4px',
            fontWeight: '600',
            textTransform: 'uppercase'
          }}>
            Inactivo
          </div>
        )}
      </Link>

      <div style={{
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '500',
          marginBottom: '8px',
          fontFamily: 'var(--serif)',
          color: 'var(--dark-black)'
        }}>
          <Link to={`/productos/${product.id}`}>{product.name}</Link>
        </h3>
        
        <p style={{
          fontSize: '16px',
          fontWeight: '600',
          color: 'var(--dark-black)',
          marginBottom: '12px'
        }}>
          ${parseFloat(product.price).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>

        {availableSizes.length > 0 ? (
          <div style={{ marginTop: 'auto' }}>
            <span style={{ fontSize: '11px', color: 'var(--gray-medium)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>
              Talles Disponibles
            </span>
            <div style={{ display: 'flex', gap: '4px' }}>
              {availableSizes.map(size => (
                <span 
                  key={size} 
                  style={{
                    fontSize: '10px',
                    padding: '2px 6px',
                    border: '1px solid var(--gray-light)',
                    borderRadius: '2px',
                    backgroundColor: 'var(--bg-light)',
                    color: 'var(--dark-black)',
                    fontWeight: '500'
                  }}
                >
                  {size}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 'auto' }}>
            <span style={{ fontSize: '11px', color: 'red', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '500' }}>
              Agotado
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
