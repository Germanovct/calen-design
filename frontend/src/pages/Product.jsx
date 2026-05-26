import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCartStore } from '../store/cartStore';
import VariantSelector from '../components/VariantSelector';

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
    <div className="container" style={{ padding: '64px 24px' }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '48px',
        alignItems: 'flex-start'
      }}>
        {/* GALERÍA DE IMÁGENES */}
        <div style={{
          flex: '1 1 450px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <img
            src={displayImage}
            alt={currentProduct.name}
            style={{
              width: '100%',
              height: '520px',
              objectFit: 'cover',
              borderRadius: 'var(--border-radius)',
              border: '1px solid var(--gray-light)',
              boxShadow: 'var(--shadow-sm)'
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
                    borderRadius: '4px',
                    overflow: 'hidden',
                    border: activeImage === img ? '2px solid var(--dark-black)' : '1px solid var(--gray-light)',
                    padding: 0
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* DETALLE Y COMPRA */}
        <div style={{
          flex: '1 1 400px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          <div>
            <h1 style={{ fontSize: '36px', marginBottom: '8px', fontFamily: 'var(--serif)' }}>
              {currentProduct.name}
            </h1>
            <p style={{ fontSize: '24px', fontWeight: '600', color: 'var(--dark-black)' }}>
              ${parseFloat(currentProduct.price).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          <div style={{
            height: '1px',
            backgroundColor: 'var(--gray-light)'
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
            <div style={{ color: 'red', fontWeight: '500' }}>Sin stock disponible temporalmente.</div>
          )}

          {/* Muestra información de stock una vez seleccionado */}
          {selectedSize && selectedColor && matchedVariant && (
            <span style={{ fontSize: '13px', color: matchedVariant.stock > 0 ? 'var(--gray-medium)' : 'red' }}>
              {matchedVariant.stock > 0 
                ? `Disponibles en stock: ${matchedVariant.stock} unidades` 
                : 'Agotado en esta combinación'}
            </span>
          )}

          {/* BOTÓN AGREGAR AL CARRITO */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
            <button
              onClick={handleAddToCart}
              disabled={isAddToCartDisabled}
              className={isAddToCartDisabled ? 'btn-outline' : 'btn-secondary'}
              style={{
                width: '100%',
                opacity: isAddToCartDisabled ? 0.5 : 1,
                cursor: isAddToCartDisabled ? 'not-allowed' : 'pointer',
                textAlign: 'center'
              }}
            >
              {!selectedSize || !selectedColor 
                ? 'Seleccionar Talle y Color' 
                : matchedVariant && matchedVariant.stock > 0 
                  ? 'Agregar al Carrito' 
                  : 'Sin Stock'}
            </button>

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  padding: '12px',
                  backgroundColor: '#D4EDDA',
                  color: '#155724',
                  borderRadius: '4px',
                  fontSize: '13px',
                  textAlign: 'center',
                  fontWeight: '500'
                }}
              >
                ¡Agregado al carrito con éxito!
              </motion.div>
            )}
          </div>

          <div style={{
            height: '1px',
            backgroundColor: 'var(--gray-light)'
          }} />

          {/* DESCRIPCIÓN */}
          <div>
            <h3 style={{ fontSize: '16px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px', fontWeight: '600' }}>
              Descripción
            </h3>
            <p style={{
              fontSize: '15px',
              color: 'var(--gray-medium)',
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
