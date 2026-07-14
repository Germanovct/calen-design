import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCartStore } from '../store/cartStore';
import { useOrders } from '../hooks/useOrders';
import { redirectToMercadoPago } from '../lib/mp';
import CheckoutStepper from '../components/CheckoutStepper';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { createOrder, createPaymentPreference, loading: orderLoading } = useOrders();

  // Stepper state
  const [step, setStep] = useState(1);

  // Form states
  const [shippingForm, setShippingForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    address: user?.address || '',
    city: '',
    zipCode: '',
    phone: user?.phone || ''
  });

  const [formError, setFormError] = useState('');
  const [shippingCost, setShippingCost] = useState(0);

  if (!user) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center', backgroundColor: 'var(--base-dark)' }}>
        <h2 style={{ fontFamily: 'var(--display)', marginBottom: '16px', color: 'var(--white)', fontWeight: 900, textTransform: 'uppercase' }}>Iniciá sesión para comprar</h2>
        <p style={{ color: 'var(--gray-text)', marginBottom: '24px', fontFamily: 'var(--sans)' }}>
          Para poder registrar tu compra y coordinar el envío, necesitamos que estés autenticado.
        </p>
        <button onClick={() => navigate('/mi-cuenta?redirect=checkout')} className="brutal-btn">
          Iniciar Sesión
        </button>
      </div>
    );
  }

  if (items.length === 0 && step < 3) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center', backgroundColor: 'var(--base-dark)' }}>
        <h2 style={{ fontFamily: 'var(--display)', marginBottom: '16px', color: 'var(--white)', fontWeight: 900, textTransform: 'uppercase' }}>Tu carrito está vacío</h2>
        <p style={{ color: 'var(--gray-text)', marginBottom: '24px', fontFamily: 'var(--sans)' }}>
          Agregá prendas al carrito antes de realizar el checkout.
        </p>
        <button onClick={() => navigate('/productos')} className="brutal-btn">
          Ir a la tienda
        </button>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setShippingForm({
      ...shippingForm,
      [e.target.name]: e.target.value
    });
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    const { fullName, email, address, city, zipCode, phone } = shippingForm;
    if (!fullName || !email || !address || !city || !zipCode || !phone) {
      setFormError('Por favor completa todos los campos obligatorios.');
      return;
    }
    setFormError('');

    // Cotización de envío simplificada según Código Postal
    const zip = parseInt(zipCode);
    if (zip >= 1000 && zip <= 1999) {
      setShippingCost(1500); // Envío CABA/GBA
    } else {
      setShippingCost(3000); // Envío resto del país
    }

    setStep(2);
  };

  const handleOrderExecution = async () => {
    try {
      // 1. Registrar la orden en el backend
      const shippingAddressJson = {
        name: shippingForm.fullName,
        email: shippingForm.email,
        address: shippingForm.address,
        city: shippingForm.city,
        zip_code: shippingForm.zipCode,
        phone: shippingForm.phone,
        shipping_cost: shippingCost
      };

      const order = await createOrder(shippingAddressJson, items);
      
      setStep(3); // Pasar al paso de pago

      // 2. Crear la preferencia en Mercado Pago
      const preference = await createPaymentPreference(order.id);
      
      // 3. Vaciar carrito local
      clearCart();
      
      // 4. Redirigir a Mercado Pago Checkout Pro
      redirectToMercadoPago(preference.init_point);
    } catch (err) {
      setFormError(err.message || 'Error al procesar la compra.');
    }
  };

  const subtotal = getTotalPrice();
  const grandTotal = subtotal + shippingCost;

  return (
    <div className="container" style={{ padding: '60px 24px 100px 24px', maxWidth: '800px', backgroundColor: 'var(--base-dark)', color: 'var(--white)' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '24px', fontFamily: 'var(--display)', fontSize: '48px', fontWeight: '900', textTransform: 'uppercase', color: 'var(--white)' }}>Finalizar Compra</h1>
      
      <CheckoutStepper currentStep={step} />
      
      {formError && (
        <div style={{
          padding: '16px',
          backgroundColor: 'var(--accent-red)',
          color: 'var(--white)',
          border: 'var(--border-brutal)',
          borderRadius: '0px',
          boxShadow: 'var(--shadow-brutal)',
          marginBottom: '32px',
          fontSize: '14px',
          fontWeight: '900',
          fontFamily: 'var(--display)',
          textTransform: 'uppercase'
        }}>
          {formError}
        </div>
      )}

      {/* STEP 1: SHIPPING ADDRESS FORM */}
      {step === 1 && (
        <form onSubmit={handleStep1Submit} style={{
          backgroundColor: 'var(--bg-card)',
          padding: '32px',
          borderRadius: '0px',
          border: 'var(--border-brutal)',
          boxShadow: 'var(--shadow-brutal-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          <h2 style={{ fontSize: '24px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', borderBottom: '1px solid var(--gray-mid)', paddingBottom: '12px', marginBottom: '8px', color: 'var(--white)' }}>
            Dirección de Envío
          </h2>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ flex: '1 1 100%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="checkout-fullname" style={{ fontSize: '11px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: 'var(--gray-text)', letterSpacing: '0.18em' }}>Nombre Completo *</label>
              <input id="checkout-fullname" type="text" name="fullName" value={shippingForm.fullName} onChange={handleInputChange} required className="brutal-input" style={{ backgroundColor: 'var(--base-dark)', color: 'var(--white)', border: '1px solid var(--gray-mid)' }} />
            </div>
            <div style={{ flex: '1 1 45%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="checkout-email" style={{ fontSize: '11px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: 'var(--gray-text)', letterSpacing: '0.18em' }}>Email *</label>
              <input id="checkout-email" type="email" name="email" value={shippingForm.email} onChange={handleInputChange} required className="brutal-input" style={{ backgroundColor: 'var(--base-dark)', color: 'var(--white)', border: '1px solid var(--gray-mid)' }} />
            </div>
            <div style={{ flex: '1 1 45%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="checkout-phone" style={{ fontSize: '11px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: 'var(--gray-text)', letterSpacing: '0.18em' }}>Teléfono de Contacto *</label>
              <input id="checkout-phone" type="tel" name="phone" value={shippingForm.phone} onChange={handleInputChange} required className="brutal-input" style={{ backgroundColor: 'var(--base-dark)', color: 'var(--white)', border: '1px solid var(--gray-mid)' }} />
            </div>
            <div style={{ flex: '1 1 100%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="checkout-address" style={{ fontSize: '11px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: 'var(--gray-text)', letterSpacing: '0.18em' }}>Calle y Altura (Dirección) *</label>
              <input id="checkout-address" type="text" name="address" value={shippingForm.address} onChange={handleInputChange} required className="brutal-input" style={{ backgroundColor: 'var(--base-dark)', color: 'var(--white)', border: '1px solid var(--gray-mid)' }} />
            </div>
            <div style={{ flex: '1 1 45%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="checkout-city" style={{ fontSize: '11px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: 'var(--gray-text)', letterSpacing: '0.18em' }}>Ciudad / Localidad *</label>
              <input id="checkout-city" type="text" name="city" value={shippingForm.city} onChange={handleInputChange} required className="brutal-input" style={{ backgroundColor: 'var(--base-dark)', color: 'var(--white)', border: '1px solid var(--gray-mid)' }} />
            </div>
            <div style={{ flex: '1 1 45%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="checkout-zipcode" style={{ fontSize: '11px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: 'var(--gray-text)', letterSpacing: '0.18em' }}>Código Postal *</label>
              <input id="checkout-zipcode" type="text" name="zipCode" value={shippingForm.zipCode} onChange={handleInputChange} required className="brutal-input" style={{ backgroundColor: 'var(--base-dark)', color: 'var(--white)', border: '1px solid var(--gray-mid)' }} />
            </div>
          </div>

          <button type="submit" className="brutal-btn" style={{ marginTop: '16px', alignSelf: 'flex-end', backgroundColor: 'var(--accent-lima)', color: 'var(--black)' }}>
            Continuar al Resumen
          </button>
        </form>
      )}

      {/* STEP 2: SUMMARY AND CONFIRM */}
      {step === 2 && (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          padding: '32px',
          borderRadius: '0px',
          border: 'var(--border-brutal)',
          boxShadow: 'var(--shadow-brutal-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          <div>
            <h2 style={{ fontSize: '24px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', borderBottom: '1px solid var(--gray-mid)', paddingBottom: '12px', marginBottom: '16px', color: 'var(--white)' }}>Resumen del Pedido</h2>
            
            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {items.map((item) => (
                <div key={item.variant.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '700', color: 'var(--white)' }}>
                  <span>{item.product.name} (TALLE: {item.variant.size} · {item.variant.color}) x{item.quantity}</span>
                  <span style={{ fontWeight: '900', fontFamily: 'var(--display)' }}>${(item.product.price * item.quantity).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ height: '1px', backgroundColor: 'var(--gray-mid)' }} />

          {/* Shipping Address Recap */}
          <div>
            <h3 style={{ fontSize: '11px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '8px', color: 'var(--gray-text)' }}>Datos de Envío</h3>
            <p style={{ fontSize: '16px', fontWeight: '800', color: 'var(--white)' }}><strong>{shippingForm.fullName}</strong></p>
            <p style={{ fontSize: '14px', color: 'var(--gray-text-light)', fontWeight: '600', marginTop: '4px' }}>
              {shippingForm.address}, {shippingForm.city} (CP: {shippingForm.zipCode}) · Tel: {shippingForm.phone}
            </p>
          </div>

          <div style={{ height: '1px', backgroundColor: 'var(--gray-mid)' }} />

          {/* Pricing Recap */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '700', color: 'var(--white)' }}>
              <span>Subtotal</span>
              <span style={{ fontWeight: '900' }}>${subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '700', color: 'var(--white)' }}>
              <span>Costo de Envío</span>
              <span style={{ fontWeight: '900' }}>${shippingCost.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '24px', fontFamily: 'var(--display)', fontWeight: '900', marginTop: '8px', borderTop: '1px solid var(--gray-mid)', paddingTop: '12px', color: 'var(--white)' }}>
              <span>TOTAL FINAL</span>
              <span style={{ color: 'var(--accent-lima)' }}>${grandTotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <button onClick={() => setStep(1)} className="btn-outline">
              Modificar Dirección
            </button>
            <button 
              onClick={handleOrderExecution} 
              disabled={orderLoading}
              className="brutal-btn"
              style={{ cursor: orderLoading ? 'not-allowed' : 'pointer', backgroundColor: 'var(--accent-lima)', color: 'var(--black)' }}
            >
              {orderLoading ? 'REGISTRANDO...' : 'CONFIRMAR Y PAGAR'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: REDIRECTING TO PAYMENT */}
      {step === 3 && (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          padding: '48px 32px',
          borderRadius: '0px',
          border: 'var(--border-brutal)',
          boxShadow: 'var(--shadow-brutal-lg)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            border: '4px solid var(--accent-red)',
            borderTopColor: 'var(--white)',
            animation: 'spin 0.8s linear infinite'
          }} />
          <h2 style={{ fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: 'var(--white)' }}>Redirigiéndote a Mercado Pago</h2>
          <p style={{ color: 'var(--gray-text)', fontWeight: '600', maxWidth: '400px' }}>
            Estamos abriendo la pasarela de pago segura de Mercado Pago. Si no se abre automáticamente, podés reintentar con el botón de abajo.
          </p>
          
          <button 
            onClick={() => window.location.reload()} 
            className="brutal-btn" 
            style={{ marginTop: '24px' }}
          >
            REINTENTAR PAGO
          </button>
          
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default Checkout;
