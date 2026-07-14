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

  // Dynamic Shipping options state
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loadingQuotes, setLoadingQuotes] = useState(false);

  const fetchQuotes = async (zipCode) => {
    setLoadingQuotes(true);
    setFormError('');
    try {
      // Estimar peso total (ej. 350gr por prenda)
      const totalWeight = items.reduce((acc, item) => acc + (item.quantity * 350), 0);
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'}/shipping/quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cp_destino: zipCode,
          peso_gr: totalWeight || 500,
          largo_cm: 20,
          ancho_cm: 15,
          alto_cm: 10
        })
      });
      if (res.ok) {
        const data = await res.json();
        setShippingOptions(data);
        if (data.length > 0) {
          setSelectedOption(data[0]);
          setShippingCost(data[0].precio);
        }
      } else {
        throw new Error('Fallo al obtener cotizaciones.');
      }
    } catch (err) {
      console.error(err);
      // Fallback local realista si se cae el servidor o no hay red
      const zip = parseInt(zipCode) || 2000;
      const fallbackOptions = [
        { modalidad: "Encomienda Clásica", precio: zip >= 1000 && zip <= 1999 ? 2500 : 3800, dias_estimados: 5 },
        { modalidad: "Encomienda Prioridad", precio: zip >= 1000 && zip <= 1999 ? 4200 : 5600, dias_estimados: 2 }
      ];
      if (zip >= 1000 && zip <= 1899) {
        fallbackOptions.push({ modalidad: "Envío Express Same-Day", precio: 2900, dias_estimados: 0 });
      }
      setShippingOptions(fallbackOptions);
      setSelectedOption(fallbackOptions[0]);
      setShippingCost(fallbackOptions[0].precio);
    } finally {
      setLoadingQuotes(false);
    }
  };

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

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    const { fullName, email, address, city, zipCode, phone } = shippingForm;
    if (!fullName || !email || !address || !city || !zipCode || !phone) {
      setFormError('Por favor completa todos los campos obligatorios.');
      return;
    }
    setFormError('');

    if (shippingOptions.length === 0) {
      await fetchQuotes(zipCode);
      return;
    }

    if (!selectedOption) {
      setFormError('Por favor selecciona una opción de envío.');
      return;
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
        shipping_cost: shippingCost,
        shipping_method: selectedOption?.modalidad || 'Encomienda Clásica'
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

          {loadingQuotes && (
            <div style={{ color: 'var(--accent-lima)', fontFamily: 'var(--display)', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', margin: '12px 0' }}>
              Cotizando Opciones de Envío...
            </div>
          )}

          {shippingOptions.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              <h3 style={{ fontSize: '13px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: 'var(--white)', letterSpacing: '0.1em' }}>
                Selecciona la opción de envío:
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {shippingOptions.map((opt) => (
                  <label 
                    key={opt.modalidad} 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px',
                      border: '1px solid var(--gray-mid)',
                      cursor: 'pointer',
                      backgroundColor: selectedOption?.modalidad === opt.modalidad ? 'rgba(200, 255, 0, 0.05)' : 'transparent',
                      borderColor: selectedOption?.modalidad === opt.modalidad ? 'var(--accent-lima)' : 'var(--gray-mid)',
                      transition: 'var(--transition)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input 
                        type="radio" 
                        name="shipping_option"
                        checked={selectedOption?.modalidad === opt.modalidad}
                        onChange={() => {
                          setSelectedOption(opt);
                          setShippingCost(opt.precio);
                        }}
                        style={{ accentColor: 'var(--accent-lima)', width: '16px', height: '16px' }}
                      />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--white)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {opt.modalidad}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--gray-text-light)', textTransform: 'uppercase' }}>
                          {opt.dias_estimados === 0 ? 'Entrega en el día (Horas)' : `Llega en ${opt.dias_estimados} días hábiles`}
                        </span>
                      </div>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: '900', color: 'var(--white)', fontFamily: 'var(--display)' }}>
                      ${opt.precio.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <button type="submit" className="brutal-btn" style={{ marginTop: '16px', alignSelf: 'flex-end', backgroundColor: 'var(--accent-lima)', color: 'var(--base-dark)' }}>
            {shippingOptions.length === 0 ? 'Calcular Envío' : 'Continuar al Resumen'}
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
            <p style={{ fontSize: '13px', color: 'var(--gray-text)', marginTop: '4px', lineHeight: '1.5' }}>
              {shippingForm.address}, {shippingForm.city} (CP: {shippingForm.zipCode}) · Tel: {shippingForm.phone}
            </p>
            <p style={{ fontSize: '13px', color: 'var(--accent-lima)', fontWeight: '900', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Método: {selectedOption?.modalidad || 'Encomienda Clásica'}
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
