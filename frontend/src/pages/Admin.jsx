import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProducts } from '../hooks/useProducts';
import { useOrders } from '../hooks/useOrders';

const Admin = () => {
  const navigate = useNavigate();
  const { user, users, loadingUsers, fetchUsers } = useAuth();
  const { 
    products, categories, fetchProducts, fetchCategories, 
    createProduct, deleteProduct, uploadImage, updateVariant
  } = useProducts();
  const { 
    orders, fetchOrders, updateOrderStatus, addShippingInfo,
    generateCorreoArgentinoLabel, dispatchWithUberDirect 
  } = useOrders();

  // Tab: 'dashboard' | 'products' | 'orders' | 'stock' | 'users'
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
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

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
      try {
        await fetchUsers();
      } catch (err) {
        console.error("Error cargando usuarios en el admin:", err);
      }
      setLoadingData(false);
    };

    loadAll();
  }, [user]);

  if (!user || user.role !== 'admin') return null;

  if (loadingData) {
    return <div style={{ textAlign: 'center', padding: '120px 0', color: 'var(--gray-text)' }}>Cargando panel de control...</div>;
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

  const handleProductDelete = (id) => {
    setConfirmDeleteId(id);
  };

  // ACTUALIZAR STOCK DE VARIANTE
  const handleStockUpdate = async (variantId) => {
    const stockVal = editingStock[variantId];
    if (stockVal === undefined) return;
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await updateVariant(variantId, { stock: parseInt(stockVal) });
      setSuccessMsg('Stock actualizado con éxito.');
      fetchProducts({ active: null });
    } catch (err) {
      setErrorMsg(err.message || 'Error al actualizar stock.');
    }
  };

  // REGISTRAR ENVÍO / CARGAR TRACKING
  const handleShippingSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await addShippingInfo(shippingForm.orderId, {
        carrier: shippingForm.carrier,
        tracking_number: shippingForm.trackingNumber
      });
      setSuccessMsg('Tracking cargado y orden despachada.');
      setShippingForm({ orderId: '', carrier: '', trackingNumber: '' });
      fetchOrders();
    } catch (err) {
      setErrorMsg(err.message || 'Error al cargar tracking.');
    }
  };

  return (
    <div className="container" style={{ padding: '60px 24px 100px 24px', backgroundColor: 'var(--base-dark)', color: 'var(--white)' }}>
      <h1 style={{ fontFamily: 'var(--display)', fontSize: '52px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '40px', color: 'var(--white)' }}>Panel Admin</h1>

      {/* Notification banner for other tabs */}
      {errorMsg && activeTab !== 'products' && (
        <div style={{ color: 'var(--accent-red)', border: 'var(--border-red)', backgroundColor: 'rgba(255,45,45,0.05)', padding: '12px 16px', fontSize: '13px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '24px' }}>
          {errorMsg}
        </div>
      )}
      {successMsg && activeTab !== 'products' && (
        <div style={{ color: 'var(--accent-lima)', border: 'var(--border-lime)', backgroundColor: 'rgba(200,255,0,0.05)', padding: '12px 16px', fontSize: '13px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '24px' }}>
          {successMsg}
        </div>
      )}

      {/* Tabs */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        borderBottom: 'var(--border-brutal)',
        paddingBottom: '0px',
        marginBottom: '40px',
        gap: '8px'
      }}>
        {['dashboard', 'products', 'orders', 'stock', 'users'].map(tab => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 24px',
                fontWeight: '900',
                fontFamily: 'var(--display)',
                fontSize: '13px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                border: '1px solid var(--white)',
                borderBottom: 'none',
                backgroundColor: isActive ? 'var(--accent-lima)' : '#111',
                color: isActive ? 'var(--black)' : 'var(--white)',
                boxShadow: isActive ? '2px -2px 0px var(--accent-lima)' : 'none',
                transform: isActive ? 'translateY(3px)' : 'none',
                zIndex: isActive ? 2 : 1,
                transition: 'var(--transition)'
              }}
            >
              {tab === 'dashboard' && 'Resumen'}
              {tab === 'products' && 'Productos'}
              {tab === 'orders' && 'Pedidos'}
              {tab === 'stock' && 'Control de Stock'}
              {tab === 'users' && 'Clientes'}
            </button>
          );
        })}
      </div>

      {/* TAB 1: SUMMARY / DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {/* KPI Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '32px'
          }}>
            <div style={{ backgroundColor: '#111', padding: '32px 24px', borderRadius: '0px', border: 'var(--border-brutal)', boxShadow: 'var(--shadow-brutal)', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', fontFamily: 'var(--display)', fontWeight: '900', color: 'var(--gray-text)', textTransform: 'uppercase', letterSpacing: '0.18em' }}>Ventas Acumuladas</span>
              <h3 style={{ fontSize: '32px', fontFamily: 'var(--display)', fontWeight: '900', marginTop: '12px', color: '#FFFFFF' }}>${totalSales.toLocaleString('es-AR')}</h3>
            </div>
            <div style={{ backgroundColor: '#111', padding: '32px 24px', borderRadius: '0px', border: pendingOrdersCount > 0 ? 'var(--border-red)' : 'var(--border-brutal)', boxShadow: 'var(--shadow-brutal)', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', fontFamily: 'var(--display)', fontWeight: '900', color: 'var(--gray-text)', textTransform: 'uppercase', letterSpacing: '0.18em' }}>Pedidos Pendientes</span>
              <h3 style={{ fontSize: '32px', fontFamily: 'var(--display)', fontWeight: '900', marginTop: '12px', color: pendingOrdersCount > 0 ? 'var(--accent-red)' : '#FFFFFF' }}>{pendingOrdersCount}</h3>
            </div>
            <div style={{ backgroundColor: '#111', padding: '32px 24px', borderRadius: '0px', border: lowStockCount > 0 ? 'var(--border-red)' : 'var(--border-brutal)', boxShadow: 'var(--shadow-brutal)', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', fontFamily: 'var(--display)', fontWeight: '900', color: 'var(--gray-text)', textTransform: 'uppercase', letterSpacing: '0.18em' }}>Alertas de Stock Bajo</span>
              <h3 style={{ fontSize: '32px', fontFamily: 'var(--display)', fontWeight: '900', marginTop: '12px', color: lowStockCount > 0 ? 'var(--accent-red)' : '#FFFFFF' }}>{lowStockCount}</h3>
            </div>
          </div>

          {/* List of pending orders */}
          <div style={{
            backgroundColor: '#111',
            padding: '32px',
            borderRadius: '0px',
            border: 'var(--border-brutal)',
            boxShadow: 'var(--shadow-brutal-lg)',
            color: '#FFFFFF'
          }}>
            <h2 style={{ fontSize: '24px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', marginBottom: '24px', borderBottom: '1px solid #333', paddingBottom: '12px', color: '#FFFFFF' }}>Pedidos Pendientes</h2>
            {orders.filter(o => o.status === 'pending').length === 0 ? (
              <p style={{ color: 'var(--gray-text)', fontWeight: '700', textTransform: 'uppercase', fontFamily: 'var(--display)' }}>No hay pedidos pendientes de pago.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px', border: '1px solid #333' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#1A1A1A', borderBottom: '1px solid #333' }}>
                      <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: '#FFFFFF' }}>ID de Pedido</th>
                      <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: '#FFFFFF' }}>Cliente</th>
                      <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: '#FFFFFF' }}>Fecha</th>
                      <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: '#FFFFFF' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.filter(o => o.status === 'pending').map(order => (
                      <tr key={order.id} style={{ borderBottom: '1px solid #222', fontWeight: '700', color: '#FFFFFF' }}>
                        <td style={{ padding: '14px 16px' }}>{order.id.slice(-8).toUpperCase()}</td>
                        <td style={{ padding: '14px 16px' }}>{order.shipping_address?.name || 'Cliente'}</td>
                        <td style={{ padding: '14px 16px' }}>{new Date(order.created_at).toLocaleDateString('es-AR')}</td>
                        <td style={{ padding: '14px 16px', fontWeight: '900', fontFamily: 'var(--display)' }}>${parseFloat(order.total).toLocaleString('es-AR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
            backgroundColor: '#111',
            padding: '32px',
            borderRadius: '0px',
            border: 'var(--border-brutal)',
            boxShadow: 'var(--shadow-brutal-lg)',
            color: '#FFFFFF'
          }}>
            <h2 style={{ fontSize: '24px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', marginBottom: '24px', borderBottom: '1px solid #333', paddingBottom: '12px', color: '#FFFFFF' }}>Nuevo Producto</h2>
            {errorMsg && <div style={{ color: 'var(--accent-red)', fontSize: '13px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '12px' }}>{errorMsg}</div>}
            {successMsg && <div style={{ color: 'var(--accent-lima)', fontSize: '13px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '12px' }}>{successMsg}</div>}
            
            <form onSubmit={handleProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: 'var(--gray-text)', letterSpacing: '0.18em' }}>Nombre *</label>
                <input type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required className="brutal-input" style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF', border: '1px solid #333' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: 'var(--gray-text)', letterSpacing: '0.18em' }}>Precio *</label>
                <input type="number" step="0.01" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required className="brutal-input" style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF', border: '1px solid #333' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: 'var(--gray-text)', letterSpacing: '0.18em' }}>Categoría *</label>
                <select value={newProduct.category_id} onChange={e => setNewProduct({...newProduct, category_id: e.target.value})} required style={{ padding: '12px', border: '1px solid #333', borderRadius: '0px', outline: 'none', backgroundColor: '#1A1A1A', color: '#FFFFFF', fontWeight: '700' }}>
                  <option value="" style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}>Seleccionar...</option>
                  {categories.map(c => <option key={c.id} value={c.id} style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}>{c.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: 'var(--gray-text)', letterSpacing: '0.18em' }}>Descripción</label>
                <textarea value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="brutal-input" style={{ height: '80px', backgroundColor: '#1A1A1A', color: '#FFFFFF', border: '1px solid #333' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: 'var(--gray-text)', letterSpacing: '0.18em' }}>Imagen Principal</label>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ fontSize: '13px', border: '1px solid #333', padding: '10px', fontWeight: '700', backgroundColor: '#1A1A1A', color: '#FFFFFF' }} />
              </div>
              
              <button type="submit" className="brutal-btn brutal-btn-lime" style={{ marginTop: '12px' }}>
                Crear Producto
              </button>
            </form>
          </div>

          {/* List/Table */}
          <div style={{
            flex: '3 1 500px',
            backgroundColor: '#111',
            padding: '32px',
            borderRadius: '0px',
            border: 'var(--border-brutal)',
            boxShadow: 'var(--shadow-brutal-lg)',
            color: '#FFFFFF'
          }}>
            <h2 style={{ fontSize: '24px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', marginBottom: '24px', borderBottom: '1px solid #333', paddingBottom: '12px', color: '#FFFFFF' }}>Listado de Productos</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px', border: '1px solid #333' }}>
                <thead>
                  <tr style={{ backgroundColor: '#1A1A1A', borderBottom: '1px solid #333' }}>
                    <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: '#FFFFFF' }}>Nombre</th>
                    <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: '#FFFFFF' }}>Categoría</th>
                    <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: '#FFFFFF' }}>Precio</th>
                    <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: '#FFFFFF' }}>Estado</th>
                    <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: '#FFFFFF' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => {
                    const cat = categories.find(c => c.id === p.category_id);
                    return (
                      <tr key={p.id} style={{ borderBottom: '1px solid #222', fontWeight: '700', color: '#FFFFFF' }}>
                        <td style={{ padding: '14px 16px' }}>{p.name}</td>
                        <td style={{ padding: '14px 16px' }}>{cat ? cat.name : 'Sin Cat.'}</td>
                        <td style={{ padding: '14px 16px', fontWeight: '900', fontFamily: 'var(--display)' }}>${p.price}</td>
                        <td style={{ padding: '14px 16px' }}>{p.active ? 'Activo' : 'Inactivo'}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <button onClick={() => handleProductDelete(p.id)} style={{ color: 'var(--accent-red)', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', textDecoration: 'underline', fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer' }}>
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
        </div>
      )}

      {/* TAB 3: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {/* Form to load tracking */}
          <div style={{
            backgroundColor: '#111',
            padding: '32px',
            borderRadius: '0px',
            border: 'var(--border-brutal)',
            boxShadow: 'var(--shadow-brutal-lg)',
            maxWidth: '500px',
            color: '#FFFFFF'
          }}>
            <h2 style={{ fontSize: '24px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', marginBottom: '24px', borderBottom: '1px solid #333', paddingBottom: '12px', color: '#FFFFFF' }}>Cargar Tracking de Envío</h2>
            <form onSubmit={handleShippingSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ flex: '1 1 100%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: 'var(--gray-text)', letterSpacing: '0.18em' }}>ID del Pedido *</label>
                <select value={shippingForm.orderId} onChange={e => setShippingForm({...shippingForm, orderId: e.target.value})} required style={{ padding: '12px', border: '1px solid #333', borderRadius: '0px', outline: 'none', backgroundColor: '#1A1A1A', color: '#FFFFFF', fontWeight: '700' }}>
                  <option value="" style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}>Seleccionar pedido...</option>
                  {orders.filter(o => o.status === 'approved').map(o => (
                    <option key={o.id} value={o.id} style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}>Orden {o.id.slice(-8).toUpperCase()} ({o.shipping_address?.name})</option>
                  ))}
                </select>
              </div>
              <div style={{ flex: '1 1 45%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: 'var(--gray-text)', letterSpacing: '0.18em' }}>Transportista *</label>
                <input type="text" placeholder="Andreani / Correo Arg" value={shippingForm.carrier} onChange={e => setShippingForm({...shippingForm, carrier: e.target.value})} required className="brutal-input" style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF', border: '1px solid #333' }} />
              </div>
              <div style={{ flex: '1 1 45%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: 'var(--gray-text)', letterSpacing: '0.18em' }}>Nº de Tracking *</label>
                <input type="text" value={shippingForm.trackingNumber} onChange={e => setShippingForm({...shippingForm, trackingNumber: e.target.value})} required className="brutal-input" style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF', border: '1px solid #333' }} />
              </div>
              <button type="submit" className="brutal-btn brutal-btn-lime" style={{ width: '100%', marginTop: '12px' }}>
                Despachar Orden
              </button>
            </form>
          </div>

          {/* Table */}
          <div style={{
            backgroundColor: '#111',
            padding: '32px',
            borderRadius: '0px',
            border: 'var(--border-brutal)',
            boxShadow: 'var(--shadow-brutal-lg)',
            color: '#FFFFFF'
          }}>
            <h2 style={{ fontSize: '24px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', marginBottom: '24px', borderBottom: '1px solid #333', paddingBottom: '12px', color: '#FFFFFF' }}>Listado de Pedidos</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px', border: '1px solid #333' }}>
                <thead>
                  <tr style={{ backgroundColor: '#1A1A1A', borderBottom: '1px solid #333' }}>
                    <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: '#FFFFFF' }}>ID</th>
                    <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: '#FFFFFF' }}>Cliente</th>
                    <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: '#FFFFFF' }}>Estado</th>
                    <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: '#FFFFFF' }}>Total</th>
                    <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: '#FFFFFF' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id} style={{ borderBottom: '1px solid #222', fontWeight: '700', color: '#FFFFFF' }}>
                      <td style={{ padding: '14px 16px' }}>{o.id.slice(-8).toUpperCase()}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <div>{o.shipping_address?.name || 'Invitado'}</div>
                        <div style={{ fontSize: '11px', color: 'var(--gray-text-light)', marginTop: '4px', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.05em' }}>
                          {o.shipping_address?.shipping_method || 'Envío Clásico'}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className={`badge badge-${o.status}`} style={{ fontSize: '10px' }}>{o.status}</span>
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: '900', fontFamily: 'var(--display)' }}>${parseFloat(o.total).toLocaleString('es-AR')}</td>
                      <td style={{ padding: '14px 16px' }}>
                        {o.status === 'approved' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {o.shipping_address?.shipping_method?.toLowerCase().includes('uber') || o.shipping_address?.shipping_method?.toLowerCase().includes('express') ? (
                              <button 
                                onClick={async () => {
                                  setErrorMsg('');
                                  setSuccessMsg('');
                                  try {
                                    await dispatchWithUberDirect(o.id);
                                    setSuccessMsg(`Pedido ${o.id.slice(-8).toUpperCase()} despachado con Uber Direct.`);
                                    fetchOrders();
                                  } catch (err) {
                                    setErrorMsg(err.message || 'Error al despachar con Uber.');
                                  }
                                }} 
                                style={{ color: 'var(--accent-lima)', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', textDecoration: 'underline', fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                              >
                                Despachar Uber
                              </button>
                            ) : (
                              <button 
                                onClick={async () => {
                                  setErrorMsg('');
                                  setSuccessMsg('');
                                  try {
                                    const label = await generateCorreoArgentinoLabel(o.id);
                                    setSuccessMsg(`Etiqueta CA generada: ${label.tracking_number}`);
                                    fetchOrders();
                                  } catch (err) {
                                    setErrorMsg(err.message || 'Error al generar etiqueta CA.');
                                  }
                                }} 
                                style={{ color: 'var(--accent-lima)', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', textDecoration: 'underline', fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                              >
                                Generar Etiqueta CA
                              </button>
                            )}
                            <button 
                              onClick={() => updateOrderStatus(o.id, 'delivered')} 
                              style={{ color: 'var(--white)', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', textDecoration: 'underline', fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                            >
                              Marcar Entregado
                            </button>
                          </div>
                        )}
                        {o.status === 'pending' && (
                          <button onClick={() => updateOrderStatus(o.id, 'cancelled')} style={{ color: 'var(--accent-red)', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', textDecoration: 'underline', fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer' }}>
                            Cancelar
                          </button>
                        )}
                        {o.status === 'shipped' && (
                          <button 
                            onClick={() => updateOrderStatus(o.id, 'delivered')} 
                            style={{ color: 'var(--accent-lima)', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', textDecoration: 'underline', fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer' }}
                          >
                            Entregado
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: STOCK CONTROL */}
      {activeTab === 'stock' && (
        <div style={{
          backgroundColor: '#111',
          padding: '32px',
          borderRadius: '0px',
          border: 'var(--border-brutal)',
          boxShadow: 'var(--shadow-brutal-lg)',
          color: '#FFFFFF'
        }}>
          <h2 style={{ fontSize: '24px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', marginBottom: '24px', borderBottom: '1px solid #333', paddingBottom: '12px', color: '#FFFFFF' }}>Control de Stock por Variante</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px', border: '1px solid #333' }}>
              <thead>
                <tr style={{ backgroundColor: '#1A1A1A', borderBottom: '1px solid #333' }}>
                  <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: '#FFFFFF' }}>Prenda</th>
                  <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: '#FFFFFF' }}>Talle</th>
                  <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: '#FFFFFF' }}>Color</th>
                  <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: '#FFFFFF' }}>Stock Actual</th>
                  <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: '#FFFFFF' }}>Modificar</th>
                </tr>
              </thead>
              <tbody>
                {allVariants.map(v => (
                  <tr key={v.id} style={{ borderBottom: '1px solid #222', fontWeight: '700', color: '#FFFFFF' }}>
                    <td style={{ padding: '14px 16px' }}>{v.productName}</td>
                    <td style={{ padding: '14px 16px' }}>{v.size || '-'}</td>
                    <td style={{ padding: '14px 16px' }}>{v.color || '-'}</td>
                    <td style={{ padding: '14px 16px', color: v.stock < 5 ? 'var(--accent-red)' : '#FFFFFF', fontWeight: '900' }}>
                      {v.stock}
                    </td>
                    <td style={{ padding: '14px 16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="number"
                        placeholder={v.stock}
                        onChange={e => setEditingStock({...editingStock, [v.id]: e.target.value})}
                        style={{ width: '60px', padding: '6px', border: '1px solid #333', backgroundColor: '#1A1A1A', color: '#FFFFFF', borderRadius: '0px', fontWeight: '900', outline: 'none' }}
                      />
                      <button onClick={() => handleStockUpdate(v.id)} style={{ color: 'var(--accent-lima)', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', textDecoration: 'underline', fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer' }}>
                        Guardar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: USERS LIST */}
      {activeTab === 'users' && (
        <div style={{
          backgroundColor: '#111',
          padding: '32px',
          borderRadius: '0px',
          border: 'var(--border-brutal)',
          boxShadow: 'var(--shadow-brutal-lg)',
          color: '#FFFFFF'
        }}>
          <h2 style={{ fontSize: '24px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', marginBottom: '24px', borderBottom: '1px solid #333', paddingBottom: '12px', color: '#FFFFFF' }}>Clientes Registrados</h2>
          {loadingUsers ? (
            <p style={{ color: 'var(--gray-text)', fontWeight: '800', fontFamily: 'var(--display)', textTransform: 'uppercase' }}>Cargando clientes...</p>
          ) : users.length === 0 ? (
            <p style={{ color: 'var(--gray-text)', fontWeight: '800', fontFamily: 'var(--display)', textTransform: 'uppercase' }}>No hay clientes registrados aún.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px', border: '1px solid #333' }}>
                <thead>
                  <tr style={{ backgroundColor: '#1A1A1A', borderBottom: '1px solid #333' }}>
                    <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: '#FFFFFF' }}>Nombre</th>
                    <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: '#FFFFFF' }}>Email</th>
                    <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: '#FFFFFF' }}>Teléfono</th>
                    <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: '#FFFFFF' }}>Dirección</th>
                    <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: '#FFFFFF' }}>Rol</th>
                    <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', color: '#FFFFFF' }}>Fecha Registro</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #222', fontWeight: '700', color: '#FFFFFF' }}>
                      <td style={{ padding: '14px 16px', fontWeight: '900' }}>{u.name || '-'}</td>
                      <td style={{ padding: '14px 16px' }}>{u.email}</td>
                      <td style={{ padding: '14px 16px' }}>{u.phone || '-'}</td>
                      <td style={{ padding: '14px 16px' }}>{u.address || '-'}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className={`badge badge-${u.role}`} style={{ fontSize: '10px' }}>{u.role}</span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        {u.created_at ? new Date(u.created_at).toLocaleDateString('es-AR') : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Confirm Delete Custom Modal */}
      {confirmDeleteId && (
        <div style={{
          position: 'fixed',
          top: 0, right: 0, bottom: 0, left: 0,
          backgroundColor: 'rgba(10, 10, 10, 0.85)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: 'var(--border-brutal)',
            boxShadow: 'var(--shadow-brutal-lg)',
            padding: '32px',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            <h3 style={{
              fontFamily: 'var(--display)',
              fontSize: '18px',
              fontWeight: 900,
              textTransform: 'uppercase',
              color: 'var(--white)',
              letterSpacing: '0.05em'
            }}>
              ¿Seguro que deseas eliminar este producto?
            </h3>
            <p style={{
              fontFamily: 'var(--sans)',
              fontSize: '13px',
              color: 'var(--gray-text-light)',
              lineHeight: 1.5
            }}>
              Esta acción no se puede deshacer y borrará el producto de la base de datos.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={() => setConfirmDeleteId(null)}
                className="brutal-btn"
                style={{ flex: 1, backgroundColor: 'transparent', color: 'var(--white)', border: '1px solid var(--gray-mid)' }}
              >
                CANCELAR
              </button>
              <button 
                onClick={async () => {
                  const idToDelete = confirmDeleteId;
                  setConfirmDeleteId(null);
                  try {
                    await deleteProduct(idToDelete);
                    setSuccessMsg('Producto eliminado correctamente.');
                    await fetchProducts({ active: null });
                  } catch (err) {
                    setErrorMsg(err.message || 'Error al eliminar el producto.');
                  }
                }}
                className="brutal-btn"
                style={{ flex: 1, backgroundColor: 'var(--accent-red)', color: 'var(--white)', borderColor: 'var(--accent-red)' }}
              >
                ELIMINAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
