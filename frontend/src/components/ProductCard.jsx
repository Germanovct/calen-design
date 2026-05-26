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
      borderRadius: '0px',
      border: 'var(--border-brutal)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      transition: 'var(--transition)',
      position: 'relative',
      boxShadow: 'var(--shadow-brutal)'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translate(-3px, -3px)';
      e.currentTarget.style.boxShadow = 'var(--shadow-brutal-hover)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'none';
      e.currentTarget.style.boxShadow = 'var(--shadow-brutal)';
    }}
    >
      <Link to={`/productos/${product.id}`} style={{ display: 'block', position: 'relative', overflow: 'hidden', borderBottom: 'var(--border-brutal-sm)' }}>
        <img
          src={imageUrl}
          alt={product.name}
          style={{
            width: '100%',
            aspectRatio: '1 / 1',
            objectFit: 'cover',
            transition: 'var(--transition)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
        {!product.active && (
          <div className="badge" style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: '#E6E6E6',
            color: 'var(--black)',
            fontSize: '10px',
            padding: '4px 8px',
            fontWeight: '900',
            textTransform: 'uppercase',
            border: '2px solid var(--black)',
            boxShadow: '2px 2px 0px #000000'
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
        backgroundColor: '#FFFFFF'
      }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: '900',
          marginBottom: '8px',
          fontFamily: 'var(--display)',
          color: 'var(--dark-black)'
        }}>
          <Link to={`/productos/${product.id}`} style={{ color: 'var(--black)' }}>{product.name}</Link>
        </h3>
        
        <p style={{
          fontSize: '20px',
          fontWeight: '900',
          fontFamily: 'var(--display)',
          color: 'var(--dark-black)',
          marginBottom: '12px'
        }}>
          ${parseFloat(product.price).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>

        {availableSizes.length > 0 ? (
          <div style={{ marginTop: 'auto' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', fontFamily: 'var(--display)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
              TALLES DISPONIBLES
            </span>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {availableSizes.map(size => (
                <span 
                  key={size} 
                  style={{
                    fontSize: '11px',
                    padding: '4px 8px',
                    border: '2px solid var(--black)',
                    borderRadius: '0px',
                    backgroundColor: 'var(--primary-yellow)',
                    color: 'var(--dark-black)',
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
              color: '#FF0000',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: '900',
              border: '2px solid #FF0000',
              padding: '4px 8px',
              display: 'inline-block'
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
