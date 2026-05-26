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
    <div className="container" style={{ padding: '40px 24px 80px 24px', maxWidth: '900px' }}>
      <h1 style={{ fontFamily: 'var(--serif)', marginBottom: '32px', textAlign: 'center' }}>Mis Pedidos</h1>

      {orders.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '64px',
          backgroundColor: 'var(--white)',
          borderRadius: 'var(--border-radius)',
          border: '1px solid var(--gray-light)'
        }}>
          <p style={{ color: 'var(--gray-medium)', marginBottom: '16px' }}>No has realizado ninguna compra aún.</p>
          <button onClick={() => navigate('/productos')} className="btn-primary">
            Comenzar a Comprar
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
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
                  borderRadius: 'var(--border-radius)',
                  border: '1px solid var(--gray-light)',
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
                    <span style={{ fontSize: '12px', color: 'var(--gray-medium)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Nº de Pedido: {order.id.slice(-8).toUpperCase()}
                    </span>
                    <h3 style={{ fontSize: '15px', color: 'var(--dark-black)', marginTop: '4px' }}>
                      Realizado el {dateStr}
                    </h3>
                  </div>

                  <span className={`badge badge-${order.status}`}>
                    {order.status === 'pending' && 'Pendiente de Pago'}
                    {order.status === 'approved' && 'Pago Aprobado / En Preparación'}
                    {order.status === 'shipped' && 'Despachado / En Viaje'}
                    {order.status === 'delivered' && 'Entregado'}
                    {order.status === 'cancelled' && 'Cancelado'}
                  </span>
                </div>

                <div style={{ height: '1px', backgroundColor: 'var(--gray-light)' }} />

                {/* Shipping tracking info */}
                {order.status === 'shipped' || order.status === 'delivered' ? (
                  <div style={{
                    padding: '16px',
                    backgroundColor: 'var(--nude-light)',
                    borderRadius: '4px',
                    fontSize: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <span style={{ fontWeight: '600', color: 'var(--dark-black)' }}>
                      🚚 ¡Tu pedido ya fue despachado!
                    </span>
                    {/* Buscaremos si tiene tracking en la orden o informamos */}
                    <p style={{ fontSize: '13px', color: 'var(--gray-medium)' }}>
                      Estamos preparando tu código de seguimiento. Si ya cargamos tu etiqueta, podés rastrear tu paquete en el sitio del transportista.
                    </p>
                  </div>
                ) : null}

                {/* Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {order.order_items?.map((item) => (
                    <div 
                      key={item.id} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        fontSize: '14px' 
                      }}
                    >
                      <span style={{ color: 'var(--gray-medium)' }}>
                        Prenda en Variante ID {item.variant_id.slice(-6).toUpperCase()} x{item.quantity}
                      </span>
                      <span style={{ fontWeight: '500' }}>
                        ${parseFloat(item.unit_price * item.quantity).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ height: '1px', backgroundColor: 'var(--gray-light)' }} />

                {/* Footer Total */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>Total Abonado</span>
                  <span style={{ fontSize: '18px', fontWeight: '600' }}>
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
