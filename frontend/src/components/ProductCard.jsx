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
    <div 
      className="product-card" 
      style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '0px',
        border: 'var(--border-brutal)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'var(--transition)',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translate(-2px, -2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-brutal)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <Link 
        to={`/productos/${product.id}`} 
        style={{ 
          display: 'block', 
          position: 'relative', 
          overflow: 'hidden', 
          borderBottom: 'var(--border-brutal-sm)',
          backgroundColor: 'var(--base-dark)'
        }}
      >
        <img
          src={imageUrl}
          alt={product.name}
          className="product-card-img"
          loading="lazy"
          style={{
            width: '100%',
            aspectRatio: '1 / 1',
            objectFit: 'cover',
            display: 'block'
          }}
        />
        {!product.active && (
          <div className="badge" style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: 'var(--base-dark)',
            color: 'var(--accent-red)',
            fontSize: '10px',
            padding: '4px 8px',
            fontWeight: '900',
            textTransform: 'uppercase',
            border: '1px solid var(--accent-red)'
          }}>
            INACTIVO
          </div>
        )}
      </Link>

      <div style={{
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        backgroundColor: 'var(--bg-card)'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '900',
          marginBottom: '8px',
          fontFamily: 'var(--display)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          <Link to={`/productos/${product.id}`} style={{ color: 'var(--white)' }}>{product.name}</Link>
        </h3>
        
        <p style={{
          fontSize: '20px',
          fontWeight: '900',
          fontFamily: 'var(--display)',
          color: 'var(--accent-red)',
          marginBottom: '16px'
        }}>
          ${parseFloat(product.price).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>

        {availableSizes.length > 0 ? (
          <div style={{ marginTop: 'auto' }}>
            <span style={{ 
              fontSize: '11px', 
              fontWeight: '800', 
              fontFamily: 'var(--display)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em', 
              display: 'block', 
              marginBottom: '8px',
              color: 'var(--gray-text)'
            }}>
              TALLES DISPONIBLES
            </span>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {availableSizes.map(size => (
                <span 
                  key={size} 
                  style={{
                    fontSize: '11px',
                    padding: '4px 8px',
                    border: '1px solid var(--white)',
                    borderRadius: '0px',
                    backgroundColor: 'var(--base-dark)',
                    color: 'var(--white)',
                    fontWeight: '900',
                    fontFamily: 'var(--display)'
                  }}
                >
                  {size}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 'auto' }}>
            <span style={{
              fontSize: '11px',
              fontFamily: 'var(--display)',
              color: 'var(--accent-red)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: '900',
              border: '1px solid var(--accent-red)',
              padding: '4px 8px',
              display: 'inline-block',
              backgroundColor: 'var(--base-dark)'
            }}>
              AGOTADO
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
