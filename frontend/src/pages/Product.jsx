import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCartStore } from '../store/cartStore';
import VariantSelector from '../components/VariantSelector';
import { motion } from 'framer-motion';
import Skeleton from '../components/Skeleton';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentProduct, fetchProduct, loading } = useProducts();
  const { addItem } = useCartStore();

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => { fetchProduct(id); }, [id]);

  useEffect(() => {
    if (currentProduct?.images?.length > 0) {
      setActiveImage(currentProduct.images[0]);
    }
  }, [currentProduct]);

  if (loading) {
    return (
      <div style={{ backgroundColor: 'var(--base-dark)', minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }} className="product-layout">
        {/* Left Side Skeleton: Large Image placeholder */}
        <Skeleton height="100vh" style={{ borderRight: '1px solid var(--gray-mid)' }} />
        
        {/* Right Side Skeleton: Details panel placeholders */}
        <div style={{ padding: '64px 48px', display: 'flex', flexDirection: 'column', gap: '32px', backgroundColor: 'var(--base-dark)' }}>
          <Skeleton width="40%" height="16px" />
          <Skeleton width="60%" height="60px" />
          <Skeleton width="100%" height="1px" />
          <div style={{ display: 'flex', gap: '8px' }}>
            <Skeleton width="60px" height="40px" />
            <Skeleton width="60px" height="40px" />
            <Skeleton width="60px" height="40px" />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Skeleton width="80px" height="40px" />
            <Skeleton width="80px" height="40px" />
          </div>
          <Skeleton width="100%" height="56px" style={{ marginTop: '20px' }} />
          <Skeleton width="100%" height="1px" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Skeleton width="30%" height="16px" />
            <Skeleton width="100%" height="80px" />
          </div>
        </div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 24px', backgroundColor: 'var(--base-dark)', minHeight: '80vh' }}>
        <h2 style={{ fontSize: '48px', fontFamily: "var(--display)", fontWeight: 900, textTransform: 'uppercase', color: 'var(--white)', marginBottom: '24px' }}>
          PRENDA NO<br />ENCONTRADA
        </h2>
        <button
          onClick={() => navigate('/productos')}
          className="brutal-btn"
          style={{ marginTop: '16px' }}
        >
          VOLVER AL CATÁLOGO
        </button>
      </div>
    );
  }

  function getStockForCombination(size, color) {
    const match = currentProduct.variants?.find(v => v.size === size && v.color === color);
    return match ? match.stock : 0;
  }

  const matchedVariant = currentProduct.variants?.find(
    v => v.size === selectedSize && v.color === selectedColor
  );

  const isAddToCartDisabled = !selectedSize || !selectedColor || !matchedVariant || matchedVariant.stock <= 0;

  const handleAddToCart = () => {
    if (isAddToCartDisabled) return;
    addItem(currentProduct, matchedVariant, 1);
    setSuccessMessage(true);
    setTimeout(() => setSuccessMessage(false), 3000);
  };

  const defaultImage = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200&auto=format&fit=crop';
  const displayImage = activeImage || defaultImage;

  return (
    <div style={{ backgroundColor: 'var(--base-dark)', minHeight: '100vh' }}>

      {/* ── LAYOUT EDITORIAL: Imagen grande + panel de detalle ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        minHeight: 'calc(100vh - 72px)',
      }}
        className="product-layout"
      >

        {/* ── COLUMNA IZQUIERDA: Imagen editorial full-height ── */}
        <div style={{
          position: 'relative',
          backgroundColor: 'var(--bg-card)',
          overflow: 'hidden',
        }}>
          {/* Imagen principal */}
          <img
            src={displayImage}
            alt={currentProduct.name}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              display: 'block',
              minHeight: '600px',
              filter: 'grayscale(20%)',
              transition: 'filter 0.3s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.filter = 'grayscale(0%)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.filter = 'grayscale(20%)'; }}
          />

          {/* Overlay gradiente abajo */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, transparent 60%, rgba(10,10,10,0.8) 100%)',
            pointerEvents: 'none',
            zIndex: 1,
          }} />

          {/* Nombre del producto superpuesto en la parte inferior */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 2,
            padding: '32px',
          }}>
            <span style={{
              fontFamily: "var(--display)",
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.25em',
              color: 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '8px',
            }}>
              — CALEN DESIGN / COL. 01
            </span>
            <h1 style={{
              fontFamily: "var(--display)",
              fontSize: 'clamp(28px, 4vw, 52px)',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: 'var(--white)',
              lineHeight: 1,
            }}>
              {currentProduct.name}
            </h1>
          </div>

          {/* Thumbnails de imágenes adicionales */}
          {currentProduct.images?.length > 1 && (
            <div style={{
              position: 'absolute',
              top: '24px',
              right: '16px',
              zIndex: 3,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}>
              {currentProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  aria-label={`Ver imagen ${idx + 1}`}
                  style={{
                    width: '56px',
                    height: '72px',
                    padding: 0,
                    overflow: 'hidden',
                    backgroundColor: 'var(--bg-card)',
                    border: activeImage === img ? '1px solid var(--white)' : '1px solid var(--gray-mid)',
                    opacity: activeImage === img ? 1 : 0.5,
                    transition: 'var(--transition)',
                    cursor: 'pointer',
                  }}
                >
                  <img src={img} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── COLUMNA DERECHA: Panel de compra ── */}
        <div style={{
          backgroundColor: 'var(--base-dark)',
          borderLeft: '1px solid var(--gray-mid)',
          padding: '64px 48px',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          overflowY: 'auto',
        }}>
          {/* Breadcrumb editorial */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontFamily: 'var(--display)', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            <Link to="/" style={{ color: 'var(--gray-text)', transition: 'var(--transition)' }} onMouseEnter={(e) => e.target.style.color = 'var(--white)'} onMouseLeave={(e) => e.target.style.color = 'var(--gray-text)'}>
              INICIO
            </Link>
            <span style={{ color: 'var(--gray-mid)' }}>&gt;</span>
            <button
              onClick={() => navigate('/productos')}
              style={{
                fontFamily: "var(--display)",
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.15em',
                color: 'var(--gray-text)',
                textTransform: 'uppercase',
                transition: 'color 0.18s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--white)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--gray-text)'; }}
            >
              CATÁLOGO
            </button>
            <span style={{ color: 'var(--gray-mid)' }}>&gt;</span>
            <span style={{ color: 'var(--accent-red)' }}>
              {currentProduct.name}
            </span>
          </div>

          {/* Precio — enorme, en rojo */}
          <div>
            <p style={{
              fontFamily: "var(--display)",
              fontSize: 'clamp(40px, 5vw, 64px)',
              fontWeight: 900,
              color: 'var(--accent-red)',
              letterSpacing: '-0.01em',
              lineHeight: 1,
            }}>
              ${parseFloat(currentProduct.price).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          {/* Separador */}
          <div style={{ height: '1px', backgroundColor: 'var(--gray-mid)' }} />

          {/* Selector de variantes */}
          {currentProduct.variants?.length > 0 ? (
            <VariantSelector
              variants={currentProduct.variants}
              selectedSize={selectedSize}
              onSelectSize={setSelectedSize}
              selectedColor={selectedColor}
              onSelectColor={(c) => {
                setSelectedColor(c);
                if (selectedSize && getStockForCombination(selectedSize, c) <= 0) {
                  setSelectedSize(null);
                }
              }}
            />
          ) : (
            <div style={{
              fontFamily: "var(--display)",
              fontWeight: 900,
              fontSize: '13px',
              color: 'var(--accent-red)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
            }}>
              SIN STOCK DISPONIBLE TEMPORALMENTE
            </div>
          )}

          {/* Info de stock seleccionado */}
          {selectedSize && selectedColor && matchedVariant && (
            <span style={{
              fontSize: '12px',
              fontFamily: "var(--display)",
              fontWeight: 700,
              color: matchedVariant.stock > 0 ? 'var(--accent-lima)' : 'var(--accent-red)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}>
              {matchedVariant.stock > 0
                ? `✓ ${matchedVariant.stock} UNIDADES DISPONIBLES`
                : '✗ AGOTADO EN ESTA COMBINACIÓN'}
            </span>
          )}

          {/* ── BOTÓN AGREGAR AL CARRITO ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={handleAddToCart}
              disabled={isAddToCartDisabled}
              style={{
                width: '100%',
                padding: '20px 24px',
                fontFamily: "var(--display)",
                fontWeight: 900,
                fontSize: '14px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                backgroundColor: isAddToCartDisabled ? 'var(--bg-card)' : 'var(--white)',
                color: isAddToCartDisabled ? 'var(--gray-text)' : 'var(--black)',
                border: isAddToCartDisabled ? '1px solid var(--gray-mid)' : 'var(--border-brutal)',
                cursor: isAddToCartDisabled ? 'not-allowed' : 'pointer',
                transition: 'var(--transition)',
              }}
              onMouseEnter={(e) => {
                if (!isAddToCartDisabled) {
                  e.currentTarget.style.backgroundColor = 'var(--accent-red)';
                  e.currentTarget.style.color = 'var(--white)';
                  e.currentTarget.style.borderColor = 'var(--accent-red)';
                  e.currentTarget.style.transform = 'translate(-2px, -2px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-brutal-hover)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isAddToCartDisabled) {
                  e.currentTarget.style.backgroundColor = 'var(--white)';
                  e.currentTarget.style.color = 'var(--black)';
                  e.currentTarget.style.borderColor = 'var(--white)';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {!selectedSize || !selectedColor
                ? 'SELECCIONAR TALLE Y COLOR'
                : matchedVariant?.stock > 0
                  ? 'AGREGAR AL CARRITO'
                  : 'SIN STOCK'}
            </button>

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                role="alert"
                aria-live="polite"
                style={{
                  padding: '14px',
                  backgroundColor: 'var(--base-dark)',
                  color: 'var(--accent-lima)',
                  border: '1px solid var(--accent-lima)',
                  fontSize: '12px',
                  fontFamily: "var(--display)",
                  textAlign: 'center',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                }}
              >
                ✓ AGREGADO AL CARRITO
              </motion.div>
            )}
          </div>

          {/* Separador */}
          <div style={{ height: '1px', backgroundColor: 'var(--gray-mid)' }} />

          {/* Descripción */}
          <div>
            <h3 style={{
              fontFamily: "var(--display)",
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              color: 'var(--gray-text)',
              marginBottom: '16px',
            }}>
              DESCRIPCIÓN
            </h3>
            <p style={{
              fontSize: '14px',
              fontFamily: "var(--sans)",
              fontWeight: 400,
              color: 'var(--gray-text-light)',
              lineHeight: 1.9,
              whiteSpace: 'pre-line',
            }}>
              {currentProduct.description || 'Prenda exclusiva de diseño independiente de la colección Calen Design. Confeccionada con materiales de primera calidad y excelentes terminaciones.'}
            </p>
          </div>

          {/* Tags editoriales */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '8px' }}>
            {['ENVÍO A TODO EL PAÍS', 'DISEÑO PROPIO', 'CALIDAD PREMIUM'].map(tag => (
              <span key={tag} style={{
                fontFamily: "var(--display)",
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: 'var(--gray-text)',
                textTransform: 'uppercase',
                border: '1px solid var(--gray-mid)',
                padding: '5px 10px',
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── RESPONSIVE: Mobile stacked layout ── */}
      <style>{`
        @media (max-width: 768px) {
          .product-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Product;
