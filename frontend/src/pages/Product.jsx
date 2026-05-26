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

  // Estados de variantes seleccionadas
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
    fetchProduct(id);
  }, [id]);

  useEffect(() => {
    if (currentProduct && currentProduct.images && currentProduct.images.length > 0) {
      setActiveImage(currentProduct.images[0]);
    }
  }, [currentProduct]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '120px 0', color: 'var(--gray-medium)' }}>Cargando prenda...</div>;
  }

  if (!currentProduct) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 0', color: 'var(--gray-medium)' }}>
        <h2>Prenda no encontrada</h2>
        <button onClick={() => navigate('/productos')} className="btn-primary" style={{ marginTop: '16px' }}>
          Volver al Catálogo
        </button>
      </div>
    );
  }

  // Buscar variantes que coincidan con la selección actual
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

  const defaultImage = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800';
  const displayImage = activeImage || defaultImage;

  return (
    <div className="container" style={{ padding: '60px 24px 100px 24px' }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '64px',
        alignItems: 'flex-start'
      }}>
        {/* GALERÍA DE IMÁGENES */}
        <div style={{
          flex: '1 1 450px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <img
            src={displayImage}
            alt={currentProduct.name}
            style={{
              width: '100%',
              height: '520px',
              objectFit: 'cover',
              borderRadius: '0px',
              border: 'var(--border-brutal)',
              boxShadow: 'var(--shadow-brutal-lg)'
            }}
          />

          {currentProduct.images && currentProduct.images.length > 1 && (
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {currentProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  style={{
                    width: '80px',
                    height: '100px',
                    borderRadius: '0px',
                    overflow: 'hidden',
                    border: activeImage === img ? 'var(--border-brutal)' : '2px solid var(--black)',
                    boxShadow: activeImage === img ? '3px 3px 0px #000000' : 'none',
                    transform: activeImage === img ? 'translate(-2px, -2px)' : 'none',
                    padding: 0
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* DETALLE Y COMPRA (Columna rota, desplazada verticalmente y enmarcada) */}
        <div style={{
          flex: '1 1 400px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          border: 'var(--border-brutal)',
          padding: '32px',
          backgroundColor: 'var(--white)',
          boxShadow: 'var(--shadow-brutal-lg)',
          marginTop: '40px', // Broken offset
          borderRadius: '0px'
        }}>
          <div>
            <h1 style={{ fontSize: '40px', lineHeight: '1.1', marginBottom: '12px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>
              {currentProduct.name}
            </h1>
            <p style={{ fontSize: '32px', fontWeight: '900', fontFamily: 'var(--display)', color: 'var(--primary-pink)' }}>
              ${parseFloat(currentProduct.price).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          <div style={{
            height: '4px',
            backgroundColor: 'var(--black)'
          }} />

          {/* SELECTOR DE VARIANTES */}
          {currentProduct.variants && currentProduct.variants.length > 0 ? (
            <VariantSelector
              variants={currentProduct.variants}
              selectedSize={selectedSize}
              onSelectSize={setSelectedSize}
              selectedColor={selectedColor}
              onSelectColor={onSelectColor => {
                setSelectedColor(onSelectColor);
                // Si la combinación no es válida, limpiar talle para forzar nueva selección
                if (selectedSize && getStockForCombination(selectedSize, onSelectColor) <= 0) {
                  setSelectedSize(null);
                }
              }}
            />
          ) : (
            <div style={{ color: '#FF0000', fontWeight: '900', fontFamily: 'var(--display)', textTransform: 'uppercase' }}>Sin stock disponible temporalmente.</div>
          )}

          {/* Muestra información de stock una vez seleccionado */}
          {selectedSize && selectedColor && matchedVariant && (
            <span style={{ fontSize: '13px', fontFamily: 'var(--display)', fontWeight: '800', color: matchedVariant.stock > 0 ? 'var(--black)' : '#FF0000', textTransform: 'uppercase' }}>
              {matchedVariant.stock > 0 
                ? `DISPONIBLES EN STOCK: ${matchedVariant.stock} UNIDADES` 
                : 'AGOTADO EN ESTA COMBINACIÓN'}
            </span>
          )}

          {/* BOTÓN AGREGAR AL CARRITO */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
            <button
              onClick={handleAddToCart}
              disabled={isAddToCartDisabled}
              className="brutal-btn brutal-btn-black"
              style={{
                width: '100%',
                padding: '20px',
                fontSize: '18px',
                fontFamily: 'var(--display)',
                fontWeight: '900',
                letterSpacing: '1px',
                cursor: isAddToCartDisabled ? 'not-allowed' : 'pointer'
              }}
            >
              {!selectedSize || !selectedColor 
                ? 'SELECCIONAR TALLE Y COLOR' 
                : matchedVariant && matchedVariant.stock > 0 
                  ? 'AGREGAR AL CARRITO' 
                  : 'SIN STOCK'}
            </button>

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  padding: '14px',
                  backgroundColor: 'var(--primary-yellow)',
                  color: 'var(--black)',
                  border: '2px solid var(--black)',
                  fontSize: '13px',
                  fontFamily: 'var(--display)',
                  textAlign: 'center',
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  boxShadow: '3px 3px 0px #000000'
                }}
              >
                ¡Agregado al carrito con éxito!
              </motion.div>
            )}
          </div>

          <div style={{
            height: '2px',
            backgroundColor: 'var(--black)'
          }} />

          {/* DESCRIPCIÓN */}
          <div>
            <h3 style={{ fontSize: '14px', fontFamily: 'var(--display)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px', fontWeight: '900' }}>
              Descripción
            </h3>
            <p style={{
              fontSize: '14px',
              fontFamily: 'var(--sans)',
              fontWeight: '500',
              color: 'var(--black)',
              lineHeight: '1.8',
              whiteSpace: 'pre-line'
            }}>
              {currentProduct.description || 'Prenda exclusiva de diseño independiente de la colección Calen Design. Confeccionada con materiales de primera calidad y excelentes terminaciones.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  function getStockForCombination(size, color) {
    const match = currentProduct.variants?.find(v => v.size === size && v.color === color);
    return match ? match.stock : 0;
  }
};

export default Product;
