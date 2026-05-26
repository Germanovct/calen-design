import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useOrders } from '../hooks/useOrders';

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
    return <div style={{ textAlign: 'center', padding: '120px 0', color: 'var(--gray-medium)' }}>Cargando tus pedidos...</div>;
  }

  return (
    <div className="container" style={{ padding: '60px 24px 100px 24px', maxWidth: '900px', backgroundColor: '#FFFFFF' }}>
      <h1 style={{ fontFamily: 'var(--display)', fontSize: '48px', fontWeight: '900', marginBottom: '40px', textAlign: 'center', textTransform: 'uppercase' }}>Mis Pedidos</h1>

      {orders.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '64px',
          backgroundColor: 'var(--primary-yellow)',
          borderRadius: '0px',
          border: 'var(--border-brutal)',
          boxShadow: 'var(--shadow-brutal-lg)'
        }}>
          <p style={{ color: '#000000', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', fontSize: '18px', marginBottom: '24px' }}>No has realizado ninguna compra aún.</p>
          <button onClick={() => navigate('/productos')} className="brutal-btn brutal-btn-black">
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
                  backgroundColor: 'var(--white)',
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
                    <span style={{ fontSize: '12px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Nº DE PEDIDO: {order.id.slice(-8).toUpperCase()}
                    </span>
                    <h3 style={{ fontSize: '18px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: 'var(--dark-black)', marginTop: '4px' }}>
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

                <div style={{ height: '3px', backgroundColor: '#000000' }} />

                {/* Shipping tracking info */}
                {(order.status === 'shipped' || order.status === 'delivered') && (
                  <div style={{
                    padding: '16px',
                    backgroundColor: 'var(--primary-yellow)',
                    border: '2px solid #000000',
                    borderRadius: '0px',
                    boxShadow: '3px 3px 0px #000000',
                    fontSize: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    <span style={{ fontWeight: '900', fontFamily: 'var(--display)', color: 'var(--dark-black)', textTransform: 'uppercase' }}>
                      🚚 ¡TU PEDIDO YA FUE DESPACHADO!
                    </span>
                    <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--dark-black)', textTransform: 'uppercase' }}>
                      Estamos preparando tu código de seguimiento. Si ya cargamos tu etiqueta, podés rastrear tu paquete en el sitio del transportista.
                    </p>
                  </div>
                )}

                {/* Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontWeight: '700' }}>
                  {order.order_items?.map((item) => (
                    <div 
                      key={item.id} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        fontSize: '14px' 
                      }}
                    >
                      <span style={{ color: 'var(--black)', textTransform: 'uppercase' }}>
                        Prenda en Variante ID {item.variant_id.slice(-6).toUpperCase()} x{item.quantity}
                      </span>
                      <span style={{ fontWeight: '900', fontFamily: 'var(--display)' }}>
                        ${parseFloat(item.unit_price * item.quantity).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ height: '3px', backgroundColor: '#000000' }} />

                {/* Footer Total */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '14px', fontWeight: '900', fontFamily: 'var(--display)', textTransform: 'uppercase' }}>Total Abonado</span>
                  <span style={{ fontSize: '24px', fontWeight: '900', fontFamily: 'var(--display)', color: 'var(--primary-pink)' }}>
                    ${parseFloat(order.total).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
