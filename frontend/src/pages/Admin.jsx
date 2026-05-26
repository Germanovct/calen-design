import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProducts } from '../hooks/useProducts';
import { useOrders } from '../hooks/useOrders';

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    products, categories, fetchProducts, fetchCategories, 
    createProduct, deleteProduct, uploadImage, updateVariant
  } = useProducts();
  const { orders, fetchOrders, updateOrderStatus, addShippingInfo } = useOrders();

  // Tab: 'dashboard' | 'products' | 'orders' | 'stock'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loadingData, setLoadingData] = useState(true);

  // Form states for creating product
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category_id: '',
    price: '',
    active: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Editing stock state
  const [editingStock, setEditingStock] = useState({}); // { variantId: stock }

  // Shipping details state
  const [shippingForm, setShippingForm] = useState({
    orderId: '',
    carrier: '',
    trackingNumber: ''
  });

  useEffect(() => {
    // Si no es admin, redirigir a Mi Cuenta
    if (!user || user.role !== 'admin') {
      navigate('/mi-cuenta');
      return;
    }

    const loadAll = async () => {
      setLoadingData(true);
      await fetchCategories();
      await fetchProducts({ active: null }); // Traer todos, activos e inactivos
      await fetchOrders();
      setLoadingData(false);
    };

    loadAll();
  }, [user]);

  if (!user || user.role !== 'admin') return null;

  if (loadingData) {
    return <div style={{ textAlign: 'center', padding: '120px 0', color: 'var(--gray-medium)' }}>Cargando panel de control...</div>;
  }

  // CÁLCULO DE MÉTRICAS (Dashboard)
  const approvedOrders = orders.filter(o => o.status === 'approved' || o.status === 'shipped' || o.status === 'delivered');
  const totalSales = approvedOrders.reduce((sum, o) => sum + parseFloat(o.total), 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
  
  // Extraer todas las variantes para stock bajo
  const allVariants = [];
  products.forEach(p => {
    p.variants?.forEach(v => {
      allVariants.push({
        ...v,
        productName: p.name
      });
    });
  });
  const lowStockCount = allVariants.filter(v => v.stock < 5).length;

  // CREAR PRODUCTO
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    try {
      if (!newProduct.category_id) {
        setErrorMsg('Por favor selecciona una categoría.');
        return;
      }
      
      const created = await createProduct({
        ...newProduct,
        price: parseFloat(newProduct.price)
      });

      // Subir imagen si se seleccionó una
      if (imageFile && created.id) {
        await uploadImage(created.id, imageFile);
      }

      setSuccessMsg('Producto creado con éxito!');
      setNewProduct({ name: '', description: '', category_id: '', price: '', active: true });
      setImageFile(null);
      
      // Recargar catálogo
      await fetchProducts({ active: null });
    } catch (err) {
      setErrorMsg(err.message || 'Error al crear producto');
    }
  };

  const handleProductDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
      try {
        await deleteProduct(id);
        alert('Producto eliminado correctamente.');
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // ACTUALIZAR STOCK DE VARIANTE
  const handleStockUpdate = async (variantId) => {
    const stockVal = editingStock[variantId];
    if (stockVal === undefined) return;
    try {
      await updateVariant(variantId, { stock: parseInt(stockVal) });
      alert('Stock actualizado con éxito.');
      fetchProducts({ active: null });
    } catch (err) {
      alert(err.message);
    }
  };

  // REGISTRAR ENVÍO / CARGAR TRACKING
  const handleShippingSubmit = async (e) => {
    e.preventDefault();
    try {
      await addShippingInfo(shippingForm.orderId, {
        carrier: shippingForm.carrier,
        tracking_number: shippingForm.trackingNumber
      });
      alert('Tracking cargado y orden despachada.');
      setShippingForm({ orderId: '', carrier: '', trackingNumber: '' });
      fetchOrders();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 24px 80px 24px' }}>
      <h1 style={{ fontFamily: 'var(--serif)', marginBottom: '32px' }}>Panel Admin</h1>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--gray-light)',
        marginBottom: '32px',
        gap: '8px'
      }}>
        {['dashboard', 'products', 'orders', 'stock'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '12px 20px',
              fontWeight: '600',
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              borderBottom: activeTab === tab ? '3px solid var(--primary-pink)' : 'none',
              color: activeTab === tab ? 'var(--dark-black)' : 'var(--gray-medium)'
            }}
          >
            {tab === 'dashboard' && 'Resumen'}
            {tab === 'products' && 'Productos'}
            {tab === 'orders' && 'Pedidos'}
            {tab === 'stock' && 'Control de Stock'}
          </button>
        ))}
      </div>

      {/* TAB 1: SUMMARY / DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {/* KPI Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px'
          }}>
            <div style={{ backgroundColor: 'var(--white)', padding: '24px', borderRadius: 'var(--border-radius)', border: '1px solid var(--gray-light)', textAlign: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--gray-medium)', textTransform: 'uppercase' }}>Ventas Acumuladas</span>
              <h3 style={{ fontSize: '28px', marginTop: '8px' }}>${totalSales.toLocaleString('es-AR')}</h3>
            </div>
            <div style={{ backgroundColor: 'var(--white)', padding: '24px', borderRadius: 'var(--border-radius)', border: '1px solid var(--gray-light)', textAlign: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--gray-medium)', textTransform: 'uppercase' }}>Pedidos Pendientes</span>
              <h3 style={{ fontSize: '28px', marginTop: '8px', color: pendingOrdersCount > 0 ? 'orange' : 'var(--dark-black)' }}>{pendingOrdersCount}</h3>
            </div>
            <div style={{ backgroundColor: 'var(--white)', padding: '24px', borderRadius: 'var(--border-radius)', border: '1px solid var(--gray-light)', textAlign: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--gray-medium)', textTransform: 'uppercase' }}>Alertas de Stock Bajo</span>
              <h3 style={{ fontSize: '28px', marginTop: '8px', color: lowStockCount > 0 ? 'red' : 'var(--dark-black)' }}>{lowStockCount}</h3>
            </div>
          </div>

          {/* List of pending orders */}
          <div style={{
            backgroundColor: 'var(--white)',
            padding: '32px',
            borderRadius: 'var(--border-radius)',
            border: '1px solid var(--gray-light)'
          }}>
            <h2 style={{ fontSize: '20px', fontFamily: 'var(--serif)', marginBottom: '16px' }}>Pedidos Pendientes</h2>
            {orders.filter(o => o.status === 'pending').length === 0 ? (
              <p style={{ color: 'var(--gray-medium)' }}>No hay pedidos pendientes de pago.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--gray-light)' }}>
                    <th style={{ padding: '12px 8px' }}>ID de Pedido</th>
                    <th style={{ padding: '12px 8px' }}>Cliente</th>
                    <th style={{ padding: '12px 8px' }}>Fecha</th>
                    <th style={{ padding: '12px 8px' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.filter(o => o.status === 'pending').map(order => (
                    <tr key={order.id} style={{ borderBottom: '1px solid var(--gray-light)' }}>
                      <td style={{ padding: '12px 8px' }}>{order.id.slice(-8).toUpperCase()}</td>
                      <td style={{ padding: '12px 8px' }}>{order.shipping_address?.name || 'Cliente'}</td>
                      <td style={{ padding: '12px 8px' }}>{new Date(order.created_at).toLocaleDateString('es-AR')}</td>
                      <td style={{ padding: '12px 8px', fontWeight: '600' }}>${parseFloat(order.total).toLocaleString('es-AR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS CRUD */}
      {activeTab === 'products' && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '40px',
          alignItems: 'flex-start'
        }}>
          {/* Form to create */}
          <div style={{
            flex: '1 1 300px',
            backgroundColor: 'var(--white)',
            padding: '24px',
            borderRadius: 'var(--border-radius)',
            border: '1px solid var(--gray-light)'
          }}>
            <h2 style={{ fontSize: '20px', fontFamily: 'var(--serif)', marginBottom: '16px' }}>Nuevo Producto</h2>
            {errorMsg && <div style={{ color: 'red', fontSize: '13px', marginBottom: '12px' }}>{errorMsg}</div>}
            {successMsg && <div style={{ color: 'green', fontSize: '13px', marginBottom: '12px' }}>{successMsg}</div>}
            
            <form onSubmit={handleProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600' }}>Nombre *</label>
                <input type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required style={{ padding: '8px', border: '1px solid var(--gray-light)', borderRadius: '4px' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600' }}>Precio *</label>
                <input type="number" step="0.01" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required style={{ padding: '8px', border: '1px solid var(--gray-light)', borderRadius: '4px' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600' }}>Categoría *</label>
                <select value={newProduct.category_id} onChange={e => setNewProduct({...newProduct, category_id: e.target.value})} required style={{ padding: '8px', border: '1px solid var(--gray-light)', borderRadius: '4px' }}>
                  <option value="">Seleccionar...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600' }}>Descripción</label>
                <textarea value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} style={{ padding: '8px', border: '1px solid var(--gray-light)', borderRadius: '4px', height: '80px' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600' }}>Imagen Principal</label>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ fontSize: '13px' }} />
              </div>
              
              <button type="submit" className="btn-secondary" style={{ marginTop: '12px' }}>
                Crear Producto
              </button>
            </form>
          </div>

          {/* List/Table */}
          <div style={{
            flex: '3 1 500px',
            backgroundColor: 'var(--white)',
            padding: '24px',
            borderRadius: 'var(--border-radius)',
            border: '1px solid var(--gray-light)'
          }}>
            <h2 style={{ fontSize: '20px', fontFamily: 'var(--serif)', marginBottom: '16px' }}>Listado de Productos</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--gray-light)' }}>
                  <th style={{ padding: '12px 8px' }}>Nombre</th>
                  <th style={{ padding: '12px 8px' }}>Categoría</th>
                  <th style={{ padding: '12px 8px' }}>Precio</th>
                  <th style={{ padding: '12px 8px' }}>Estado</th>
                  <th style={{ padding: '12px 8px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => {
                  const cat = categories.find(c => c.id === p.category_id);
                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--gray-light)' }}>
                      <td style={{ padding: '12px 8px' }}>{p.name}</td>
                      <td style={{ padding: '12px 8px' }}>{cat ? cat.name : 'Sin Cat.'}</td>
                      <td style={{ padding: '12px 8px', fontWeight: '600' }}>${p.price}</td>
                      <td style={{ padding: '12px 8px' }}>{p.active ? 'Activo' : 'Inactivo'}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <button onClick={() => handleProductDelete(p.id)} style={{ color: 'red', textDecoration: 'underline', fontSize: '13px' }}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Form to load tracking */}
          <div style={{
            backgroundColor: 'var(--white)',
            padding: '24px',
            borderRadius: 'var(--border-radius)',
            border: '1px solid var(--gray-light)',
            maxWidth: '500px'
          }}>
            <h2 style={{ fontSize: '18px', fontFamily: 'var(--serif)', marginBottom: '16px' }}>Cargar Tracking de Envío</h2>
            <form onSubmit={handleShippingSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ flex: '1 1 100%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600' }}>ID del Pedido *</label>
                <select value={shippingForm.orderId} onChange={e => setShippingForm({...shippingForm, orderId: e.target.value})} required style={{ padding: '8px', border: '1px solid var(--gray-light)', borderRadius: '4px' }}>
                  <option value="">Seleccionar pedido...</option>
                  {orders.filter(o => o.status === 'approved').map(o => (
                    <option key={o.id} value={o.id}>Orden {o.id.slice(-8).toUpperCase()} ({o.shipping_address?.name})</option>
                  ))}
                </select>
              </div>
              <div style={{ flex: '1 1 45%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600' }}>Transportista *</label>
                <input type="text" placeholder="Andreani / Correo Arg" value={shippingForm.carrier} onChange={e => setShippingForm({...shippingForm, carrier: e.target.value})} required style={{ padding: '8px', border: '1px solid var(--gray-light)', borderRadius: '4px' }} />
              </div>
              <div style={{ flex: '1 1 45%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600' }}>Nº de Tracking *</label>
                <input type="text" value={shippingForm.trackingNumber} onChange={e => setShippingForm({...shippingForm, trackingNumber: e.target.value})} required style={{ padding: '8px', border: '1px solid var(--gray-light)', borderRadius: '4px' }} />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                Despachar Orden
              </button>
            </form>
          </div>

          {/* Table */}
          <div style={{
            backgroundColor: 'var(--white)',
            padding: '24px',
            borderRadius: 'var(--border-radius)',
            border: '1px solid var(--gray-light)'
          }}>
            <h2 style={{ fontSize: '20px', fontFamily: 'var(--serif)', marginBottom: '16px' }}>Listado de Pedidos</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--gray-light)' }}>
                  <th style={{ padding: '12px 8px' }}>ID</th>
                  <th style={{ padding: '12px 8px' }}>Cliente</th>
                  <th style={{ padding: '12px 8px' }}>Estado</th>
                  <th style={{ padding: '12px 8px' }}>Total</th>
                  <th style={{ padding: '12px 8px' }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} style={{ borderBottom: '1px solid var(--gray-light)' }}>
                    <td style={{ padding: '12px 8px' }}>{o.id.slice(-8).toUpperCase()}</td>
                    <td style={{ padding: '12px 8px' }}>{o.shipping_address?.name || 'Invitado'}</td>
                    <td style={{ padding: '12px 8px' }}>
                      <span className={`badge badge-${o.status}`} style={{ fontSize: '10px' }}>{o.status}</span>
                    </td>
                    <td style={{ padding: '12px 8px', fontWeight: '600' }}>${parseFloat(o.total).toLocaleString('es-AR')}</td>
                    <td style={{ padding: '12px 8px' }}>
                      {o.status === 'approved' && (
                        <button onClick={() => updateOrderStatus(o.id, 'delivered')} style={{ color: 'green', textDecoration: 'underline', fontSize: '13px' }}>
                          Marcar Entregado
                        </button>
                      )}
                      {o.status === 'pending' && (
                        <button onClick={() => updateOrderStatus(o.id, 'cancelled')} style={{ color: 'red', textDecoration: 'underline', fontSize: '13px' }}>
                          Cancelar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: STOCK CONTROL */}
      {activeTab === 'stock' && (
        <div style={{
          backgroundColor: 'var(--white)',
          padding: '24px',
          borderRadius: 'var(--border-radius)',
          border: '1px solid var(--gray-light)'
        }}>
          <h2 style={{ fontSize: '20px', fontFamily: 'var(--serif)', marginBottom: '16px' }}>Control de Stock por Variante</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--gray-light)' }}>
                <th style={{ padding: '12px 8px' }}>Prenda</th>
                <th style={{ padding: '12px 8px' }}>Talle</th>
                <th style={{ padding: '12px 8px' }}>Color</th>
                <th style={{ padding: '12px 8px' }}>Stock Actual</th>
                <th style={{ padding: '12px 8px' }}>Modificar</th>
              </tr>
            </thead>
            <tbody>
              {allVariants.map(v => (
                <tr key={v.id} style={{ borderBottom: '1px solid var(--gray-light)' }}>
                  <td style={{ padding: '12px 8px' }}>{v.productName}</td>
                  <td style={{ padding: '12px 8px' }}>{v.size || '-'}</td>
                  <td style={{ padding: '12px 8px' }}>{v.color || '-'}</td>
                  <td style={{ padding: '12px 8px', color: v.stock < 5 ? 'red' : 'var(--dark-black)', fontWeight: v.stock < 5 ? '600' : '400' }}>
                    {v.stock}
                  </td>
                  <td style={{ padding: '12px 8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="number"
                      placeholder={v.stock}
                      onChange={e => setEditingStock({...editingStock, [v.id]: e.target.value})}
                      style={{ width: '60px', padding: '4px', border: '1px solid var(--gray-light)', borderRadius: '4px' }}
                    />
                    <button onClick={() => handleStockUpdate(v.id)} style={{ color: 'blue', textDecoration: 'underline', fontSize: '13px' }}>
                      Guardar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Admin;
