import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCartStore } from '../store/cartStore';
import VariantSelector from '../components/VariantSelector';
import { motion } from 'framer-motion';

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
      <div style={{
        textAlign: 'center',
        padding: '160px 0',
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 900,
        fontSize: '13px',
        letterSpacing: '0.2em',
        color: '#333',
        textTransform: 'uppercase',
      }}>
        CARGANDO PRENDA...
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 24px', backgroundColor: '#0A0A0A' }}>
        <h2 style={{ fontSize: '48px', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, textTransform: 'uppercase', color: '#FFFFFF', marginBottom: '24px' }}>
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
    <div style={{ backgroundColor: '#0A0A0A', minHeight: '100vh' }}>

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
          backgroundColor: '#111111',
          overflow: 'hidden',
        }}>
          {/* Imagen principal */}
          <img
            src={displayImage}
            alt={currentProduct.name}
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
              fontFamily: "'Space Grotesk', sans-serif",
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
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(28px, 4vw, 52px)',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: '#FFFFFF',
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
                  style={{
                    width: '56px',
                    height: '72px',
                    padding: 0,
                    overflow: 'hidden',
                    border: activeImage === img ? '1px solid #FFFFFF' : '1px solid #333',
                    opacity: activeImage === img ? 1 : 0.5,
                    transition: 'all 0.18s ease',
                    cursor: 'pointer',
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── COLUMNA DERECHA: Panel de compra ── */}
        <div style={{
          backgroundColor: '#0A0A0A',
          borderLeft: '1px solid #1A1A1A',
          padding: '64px 48px',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          overflowY: 'auto',
        }}>
          {/* Breadcrumb editorial */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => navigate('/productos')}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.15em',
                color: '#555',
                textTransform: 'uppercase',
                transition: 'color 0.18s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#555'; }}
            >
              CATÁLOGO
            </button>
            <span style={{ color: '#333', fontSize: '11px' }}>—</span>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              color: '#FF2D2D',
              textTransform: 'uppercase',
            }}>
              {currentProduct.name}
            </span>
          </div>

          {/* Precio — enorme, en rojo */}
          <div>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(40px, 5vw, 64px)',
              fontWeight: 900,
              color: '#FF2D2D',
              letterSpacing: '-0.01em',
              lineHeight: 1,
            }}>
              ${parseFloat(currentProduct.price).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          {/* Separador */}
          <div style={{ height: '1px', backgroundColor: '#1A1A1A' }} />

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
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 900,
              fontSize: '13px',
              color: '#FF2D2D',
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
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              color: matchedVariant.stock > 0 ? '#C8FF00' : '#FF2D2D',
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
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 900,
                fontSize: '14px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                backgroundColor: isAddToCartDisabled ? '#1A1A1A' : '#FFFFFF',
                color: isAddToCartDisabled ? '#444' : '#000000',
                border: isAddToCartDisabled ? '1px solid #2A2A2A' : '1px solid #FFFFFF',
                cursor: isAddToCartDisabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.18s ease',
              }}
              onMouseEnter={(e) => {
                if (!isAddToCartDisabled) {
                  e.currentTarget.style.backgroundColor = '#FF2D2D';
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#FF2D2D';
                  e.currentTarget.style.transform = 'translate(-2px, -2px)';
                  e.currentTarget.style.boxShadow = '4px 4px 0px #FF2D2D';
                }
              }}
              onMouseLeave={(e) => {
                if (!isAddToCartDisabled) {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.color = '#000000';
                  e.currentTarget.style.borderColor = '#FFFFFF';
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
                style={{
                  padding: '14px',
                  backgroundColor: '#0A0A0A',
                  color: '#C8FF00',
                  border: '1px solid #C8FF00',
                  fontSize: '12px',
                  fontFamily: "'Space Grotesk', sans-serif",
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
          <div style={{ height: '1px', backgroundColor: '#1A1A1A' }} />

          {/* Descripción */}
          <div>
            <h3 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              color: '#555',
              marginBottom: '16px',
            }}>
              DESCRIPCIÓN
            </h3>
            <p style={{
              fontSize: '14px',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              color: '#888',
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
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: '#444',
                textTransform: 'uppercase',
                border: '1px solid #2A2A2A',
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
