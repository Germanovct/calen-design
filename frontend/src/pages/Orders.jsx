import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useOrders } from '../hooks/useOrders';
import Skeleton from '../components/Skeleton';

const Orders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { orders, fetchMyOrders, loading } = useOrders();

  useEffect(() => {
    if (!user) {
      navigate('/mi-cuenta');
      return;
    }
    fetchMyOrders();
  }, [user]);

  if (loading) {
    return (
      <div style={{ backgroundColor: 'var(--base-dark)', minHeight: '80vh', padding: '60px 0 100px 0' }}>
        <div className="container" style={{ maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
          <Skeleton width="40%" height="40px" style={{ alignSelf: 'center', marginBottom: '20px' }} />
          {[...Array(2)].map((_, idx) => (
            <div key={idx} style={{
              backgroundColor: 'var(--bg-card)',
              padding: '32px',
              border: 'var(--border-brutal)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ width: '40%' }}>
                  <Skeleton width="60%" height="16px" style={{ marginBottom: '8px' }} />
                  <Skeleton width="80%" height="24px" />
                </div>
                <Skeleton width="120px" height="24px" />
              </div>
              <Skeleton width="100%" height="1px" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Skeleton width="70%" height="20px" />
                <Skeleton width="60%" height="20px" />
              </div>
              <Skeleton width="100%" height="1px" />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Skeleton width="20%" height="20px" />
                <Skeleton width="30%" height="30px" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--base-dark)', minHeight: '80vh', padding: '60px 0 100px 0' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: '900', marginBottom: '40px', textAlign: 'center', textTransform: 'uppercase', color: 'var(--white)' }}>Mis Pedidos</h1>

        {orders.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '64px',
            backgroundColor: 'var(--bg-card)',
            borderRadius: '0px',
            border: 'var(--border-brutal)',
            boxShadow: 'var(--shadow-brutal-lg)'
          }}>
            <p style={{ color: 'var(--white)', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', fontSize: '18px', marginBottom: '24px', letterSpacing: '0.05em' }}>No has realizado ninguna compra aún.</p>
            <button onClick={() => navigate('/productos')} className="brutal-btn">
              COMENZAR A COMPRAR
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {orders.map((order) => {
              const dateStr = new Date(order.created_at).toLocaleDateString('es-AR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });

              return (
                <div
                  key={order.id}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    padding: '32px',
                    borderRadius: '0px',
                    border: 'var(--border-brutal)',
                    boxShadow: 'var(--shadow-brutal-lg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                  }}
                >
                  {/* Header of card */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    <div>
                      <span style={{ fontSize: '11px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gray-text-light)' }}>
                        Nº DE PEDIDO: {order.id.slice(-8).toUpperCase()}
                      </span>
                      <h3 style={{ fontSize: '18px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: 'var(--white)', marginTop: '4px', letterSpacing: '0.05em' }}>
                        REALIZADO EL {dateStr}
                      </h3>
                    </div>

                    <span className={`badge badge-${order.status}`}>
                      {order.status === 'pending' && 'PENDIENTE DE PAGO'}
                      {order.status === 'approved' && 'APROBADO / EN PREPARACIÓN'}
                      {order.status === 'shipped' && 'DESPACHADO / EN VIAJE'}
                      {order.status === 'delivered' && 'ENTREGADO'}
                      {order.status === 'cancelled' && 'CANCELADO'}
                    </span>
                  </div>

                  <div style={{ height: '1px', backgroundColor: 'var(--gray-mid)' }} />

                  {/* Shipping tracking info */}
                  {(order.status === 'shipped' || order.status === 'delivered') && (
                    <div style={{
                      padding: '16px',
                      backgroundColor: 'var(--base-dark)',
                      border: '1px solid var(--accent-lima)',
                      borderRadius: '0px',
                      fontSize: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px'
                    }}>
                      <span style={{ fontWeight: '900', fontFamily: 'var(--display)', color: 'var(--accent-lima)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        🚚 ¡TU PEDIDO YA FUE DESPACHADO!
                      </span>
                      <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--gray-text-light)' }}>
                        Estamos preparando tu código de seguimiento. Si ya cargamos tu etiqueta, podés rastrear tu paquete en el sitio del transportista.
                      </p>
                    </div>
                  )}

                  {/* Items */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontWeight: '500' }}>
                    {order.order_items?.map((item, idx) => (
                      <div 
                        key={item.id} 
                        style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          fontSize: '14px' 
                        }}
                      >
                        <span style={{ color: 'var(--white)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                          Artículo #{idx + 1} (Var: {item.variant_id.slice(-6).toUpperCase()}) x{item.quantity}
                        </span>
                        <span style={{ fontWeight: '900', fontFamily: 'var(--display)', color: 'var(--white)' }}>
                          ${parseFloat(item.unit_price * item.quantity).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div style={{ height: '1px', backgroundColor: 'var(--gray-mid)' }} />

                  {/* Footer Total */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '14px', fontWeight: '900', fontFamily: 'var(--display)', textTransform: 'uppercase', color: 'var(--white)', letterSpacing: '0.05em' }}>Total Abonado</span>
                    <span style={{ fontSize: '24px', fontWeight: '900', fontFamily: 'var(--display)', color: 'var(--accent-red)' }}>
                      ${parseFloat(order.total).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
