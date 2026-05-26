import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const availableSizes = Array.from(new Set(
    product.variants
      ?.filter(v => v.stock > 0)
      .map(v => v.size)
      .filter(Boolean)
  ));

  const defaultImage = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop';
  const imageUrl = product.images && product.images.length > 0 ? product.images[0] : defaultImage;

  return (
    <div
      className="product-card"
      style={{
        backgroundColor: '#1A1A1A',
        border: 'none',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'all 0.2s ease-in-out',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.zIndex = '2';
        e.currentTarget.style.outline = '1px solid #FFFFFF';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.zIndex = '1';
        e.currentTarget.style.outline = 'none';
      }}
    >
      {/* Imagen — grayscale → color en hover */}
      <Link
        to={`/productos/${product.id}`}
        style={{
          display: 'block',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#111111',
        }}
      >
        <img
          src={imageUrl}
          alt={product.name}
          className="product-card-img"
          style={{
            width: '100%',
            aspectRatio: '3 / 4',
            objectFit: 'cover',
            display: 'block',
          }}
        />

        {/* Overlay sutil */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(10,10,10,0.6) 0%, transparent 50%)',
          zIndex: 1,
          pointerEvents: 'none',
        }} />

        {/* Número editorial */}
        <span style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          zIndex: 2,
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.2em',
          color: 'rgba(255,255,255,0.4)',
        }}>
          —
        </span>

        {!product.active && (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 3,
            backgroundColor: '#0A0A0A',
            color: '#FF2D2D',
            fontSize: '10px',
            padding: '4px 8px',
            fontWeight: 900,
            textTransform: 'uppercase',
            fontFamily: "'Space Grotesk', sans-serif",
            border: '1px solid #FF2D2D',
            letterSpacing: '0.1em',
          }}>
            INACTIVO
          </div>
        )}
      </Link>

      {/* Info del producto */}
      <div style={{
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        borderTop: '1px solid #222',
      }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: 900,
          marginBottom: '6px',
          fontFamily: "'Space Grotesk', sans-serif",
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: '#FFFFFF',
          lineHeight: 1.2,
        }}>
          <Link to={`/productos/${product.id}`} style={{ color: '#FFFFFF' }}>
            {product.name}
          </Link>
        </h3>

        <p style={{
          fontSize: '18px',
          fontWeight: 900,
          fontFamily: "'Space Grotesk', sans-serif",
          color: '#FF2D2D',
          marginBottom: '14px',
          letterSpacing: '0.02em',
        }}>
          ${parseFloat(product.price).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>

        {/* Talles */}
        {availableSizes.length > 0 ? (
          <div style={{ marginTop: 'auto', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {availableSizes.map(size => (
              <span
                key={size}
                style={{
                  fontSize: '10px',
                  padding: '3px 7px',
                  border: '1px solid #333',
                  backgroundColor: 'transparent',
                  color: '#666',
                  fontWeight: 700,
                  fontFamily: "'Space Grotesk', sans-serif",
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {size}
              </span>
            ))}
          </div>
        ) : (
          <div style={{ marginTop: 'auto' }}>
            <span style={{
              fontSize: '10px',
              fontFamily: "'Space Grotesk', sans-serif",
              color: '#FF2D2D',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 700,
              border: '1px solid #FF2D2D',
              padding: '3px 8px',
              display: 'inline-block',
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
