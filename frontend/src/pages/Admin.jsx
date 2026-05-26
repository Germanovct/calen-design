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
  const { orders, fetchOrders, updateOrderStatus, addShippingInfo } = useOrders();

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
    <div className="container" style={{ padding: '60px 24px 100px 24px', backgroundColor: '#FFFFFF' }}>
      <h1 style={{ fontFamily: 'var(--display)', fontSize: '52px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '40px' }}>Panel Admin</h1>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        borderBottom: 'var(--border-brutal)',
        paddingBottom: '0px',
        marginBottom: '40px',
        gap: '8px'
      }}>
        {['dashboard', 'products', 'orders', 'stock', 'users'].map(tab => (
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
              border: '3px solid #000000',
              borderBottom: 'none',
              backgroundColor: activeTab === tab ? 'var(--primary-yellow)' : 'var(--white)',
              color: 'var(--black)',
              boxShadow: activeTab === tab ? '3px -3px 0px #000000' : 'none',
              transform: activeTab === tab ? 'translateY(3px)' : 'none',
              zIndex: activeTab === tab ? 2 : 1,
              transition: 'var(--transition)'
            }}
          >
            {tab === 'dashboard' && 'Resumen'}
            {tab === 'products' && 'Productos'}
            {tab === 'orders' && 'Pedidos'}
            {tab === 'stock' && 'Control de Stock'}
            {tab === 'users' && 'Clientes'}
          </button>
        ))}
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
            <div style={{ backgroundColor: 'var(--primary-pink)', padding: '32px 24px', borderRadius: '0px', border: 'var(--border-brutal)', boxShadow: 'var(--shadow-brutal)', textAlign: 'center' }}>
              <span style={{ fontSize: '12px', fontFamily: 'var(--display)', fontWeight: '900', color: 'var(--black)', textTransform: 'uppercase' }}>Ventas Acumuladas</span>
              <h3 style={{ fontSize: '32px', fontFamily: 'var(--display)', fontWeight: '900', marginTop: '12px' }}>${totalSales.toLocaleString('es-AR')}</h3>
            </div>
            <div style={{ backgroundColor: 'var(--primary-yellow)', padding: '32px 24px', borderRadius: '0px', border: 'var(--border-brutal)', boxShadow: 'var(--shadow-brutal)', textAlign: 'center' }}>
              <span style={{ fontSize: '12px', fontFamily: 'var(--display)', fontWeight: '900', color: 'var(--black)', textTransform: 'uppercase' }}>Pedidos Pendientes</span>
              <h3 style={{ fontSize: '32px', fontFamily: 'var(--display)', fontWeight: '900', marginTop: '12px', color: pendingOrdersCount > 0 ? '#FF0000' : 'var(--black)' }}>{pendingOrdersCount}</h3>
            </div>
            <div style={{ backgroundColor: 'var(--white)', padding: '32px 24px', borderRadius: '0px', border: 'var(--border-brutal)', boxShadow: 'var(--shadow-brutal)', textAlign: 'center' }}>
              <span style={{ fontSize: '12px', fontFamily: 'var(--display)', fontWeight: '900', color: 'var(--black)', textTransform: 'uppercase' }}>Alertas de Stock Bajo</span>
              <h3 style={{ fontSize: '32px', fontFamily: 'var(--display)', fontWeight: '900', marginTop: '12px', color: lowStockCount > 0 ? '#FF0000' : 'var(--black)' }}>{lowStockCount}</h3>
            </div>
          </div>

          {/* List of pending orders */}
          <div style={{
            backgroundColor: 'var(--white)',
            padding: '32px',
            borderRadius: '0px',
            border: 'var(--border-brutal)',
            boxShadow: 'var(--shadow-brutal-lg)'
          }}>
            <h2 style={{ fontSize: '24px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', marginBottom: '24px', borderBottom: '3px solid #000000', paddingBottom: '12px' }}>Pedidos Pendientes</h2>
            {orders.filter(o => o.status === 'pending').length === 0 ? (
              <p style={{ color: 'var(--black)', fontWeight: '700', textTransform: 'uppercase', fontFamily: 'var(--display)' }}>No hay pedidos pendientes de pago.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px', border: '3px solid #000000' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--primary-yellow)', borderBottom: '3px solid #000000' }}>
                      <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>ID de Pedido</th>
                      <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>Cliente</th>
                      <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>Fecha</th>
                      <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.filter(o => o.status === 'pending').map(order => (
                      <tr key={order.id} style={{ borderBottom: '2px solid #000000', fontWeight: '700' }}>
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
            backgroundColor: 'var(--white)',
            padding: '32px',
            borderRadius: '0px',
            border: 'var(--border-brutal)',
            boxShadow: 'var(--shadow-brutal-lg)'
          }}>
            <h2 style={{ fontSize: '24px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', marginBottom: '24px', borderBottom: '3px solid #000000', paddingBottom: '12px' }}>Nuevo Producto</h2>
            {errorMsg && <div style={{ color: 'red', fontSize: '13px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '12px' }}>{errorMsg}</div>}
            {successMsg && <div style={{ color: 'green', fontSize: '13px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '12px' }}>{successMsg}</div>}
            
            <form onSubmit={handleProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>Nombre *</label>
                <input type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required className="brutal-input" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>Precio *</label>
                <input type="number" step="0.01" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required className="brutal-input" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>Categoría *</label>
                <select value={newProduct.category_id} onChange={e => setNewProduct({...newProduct, category_id: e.target.value})} required style={{ padding: '12px', border: 'var(--border-brutal)', borderRadius: '0px', outline: 'none', backgroundColor: '#FFFFFF', fontWeight: '700' }}>
                  <option value="">Seleccionar...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>Descripción</label>
                <textarea value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="brutal-input" style={{ height: '80px' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>Imagen Principal</label>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ fontSize: '13px', border: 'var(--border-brutal)', padding: '10px', fontWeight: '700' }} />
              </div>
              
              <button type="submit" className="brutal-btn brutal-btn-pink" style={{ marginTop: '12px' }}>
                Crear Producto
              </button>
            </form>
          </div>

          {/* List/Table */}
          <div style={{
            flex: '3 1 500px',
            backgroundColor: 'var(--white)',
            padding: '32px',
            borderRadius: '0px',
            border: 'var(--border-brutal)',
            boxShadow: 'var(--shadow-brutal-lg)'
          }}>
            <h2 style={{ fontSize: '24px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', marginBottom: '24px', borderBottom: '3px solid #000000', paddingBottom: '12px' }}>Listado de Productos</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px', border: '3px solid #000000' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--primary-yellow)', borderBottom: '3px solid #000000' }}>
                    <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>Nombre</th>
                    <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>Categoría</th>
                    <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>Precio</th>
                    <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>Estado</th>
                    <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => {
                    const cat = categories.find(c => c.id === p.category_id);
                    return (
                      <tr key={p.id} style={{ borderBottom: '2px solid #000000', fontWeight: '700' }}>
                        <td style={{ padding: '14px 16px' }}>{p.name}</td>
                        <td style={{ padding: '14px 16px' }}>{cat ? cat.name : 'Sin Cat.'}</td>
                        <td style={{ padding: '14px 16px', fontWeight: '900', fontFamily: 'var(--display)' }}>${p.price}</td>
                        <td style={{ padding: '14px 16px' }}>{p.active ? 'Activo' : 'Inactivo'}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <button onClick={() => handleProductDelete(p.id)} style={{ color: 'red', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', textDecoration: 'underline', fontSize: '13px' }}>
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
            backgroundColor: 'var(--white)',
            padding: '32px',
            borderRadius: '0px',
            border: 'var(--border-brutal)',
            boxShadow: 'var(--shadow-brutal-lg)',
            maxWidth: '500px'
          }}>
            <h2 style={{ fontSize: '24px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', marginBottom: '24px', borderBottom: '3px solid #000000', paddingBottom: '12px' }}>Cargar Tracking de Envío</h2>
            <form onSubmit={handleShippingSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ flex: '1 1 100%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>ID del Pedido *</label>
                <select value={shippingForm.orderId} onChange={e => setShippingForm({...shippingForm, orderId: e.target.value})} required style={{ padding: '12px', border: 'var(--border-brutal)', borderRadius: '0px', outline: 'none', backgroundColor: '#FFFFFF', fontWeight: '700' }}>
                  <option value="">Seleccionar pedido...</option>
                  {orders.filter(o => o.status === 'approved').map(o => (
                    <option key={o.id} value={o.id}>Orden {o.id.slice(-8).toUpperCase()} ({o.shipping_address?.name})</option>
                  ))}
                </select>
              </div>
              <div style={{ flex: '1 1 45%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>Transportista *</label>
                <input type="text" placeholder="Andreani / Correo Arg" value={shippingForm.carrier} onChange={e => setShippingForm({...shippingForm, carrier: e.target.value})} required className="brutal-input" />
              </div>
              <div style={{ flex: '1 1 45%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>Nº de Tracking *</label>
                <input type="text" value={shippingForm.trackingNumber} onChange={e => setShippingForm({...shippingForm, trackingNumber: e.target.value})} required className="brutal-input" />
              </div>
              <button type="submit" className="brutal-btn brutal-btn-black" style={{ width: '100%', marginTop: '12px' }}>
                Despachar Orden
              </button>
            </form>
          </div>

          {/* Table */}
          <div style={{
            backgroundColor: 'var(--white)',
            padding: '32px',
            borderRadius: '0px',
            border: 'var(--border-brutal)',
            boxShadow: 'var(--shadow-brutal-lg)'
          }}>
            <h2 style={{ fontSize: '24px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', marginBottom: '24px', borderBottom: '3px solid #000000', paddingBottom: '12px' }}>Listado de Pedidos</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px', border: '3px solid #000000' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--primary-yellow)', borderBottom: '3px solid #000000' }}>
                    <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>ID</th>
                    <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>Cliente</th>
                    <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>Estado</th>
                    <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>Total</th>
                    <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id} style={{ borderBottom: '2px solid #000000', fontWeight: '700' }}>
                      <td style={{ padding: '14px 16px' }}>{o.id.slice(-8).toUpperCase()}</td>
                      <td style={{ padding: '14px 16px' }}>{o.shipping_address?.name || 'Invitado'}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className={`badge badge-${o.status}`} style={{ fontSize: '10px' }}>{o.status}</span>
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: '900', fontFamily: 'var(--display)' }}>${parseFloat(o.total).toLocaleString('es-AR')}</td>
                      <td style={{ padding: '14px 16px' }}>
                        {o.status === 'approved' && (
                          <button onClick={() => updateOrderStatus(o.id, 'delivered')} style={{ color: 'green', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', textDecoration: 'underline', fontSize: '13px' }}>
                            Marcar Entregado
                          </button>
                        )}
                        {o.status === 'pending' && (
                          <button onClick={() => updateOrderStatus(o.id, 'cancelled')} style={{ color: 'red', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', textDecoration: 'underline', fontSize: '13px' }}>
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
        </div>
      )}

      {/* TAB 4: STOCK CONTROL */}
      {activeTab === 'stock' && (
        <div style={{
          backgroundColor: 'var(--white)',
          padding: '32px',
          borderRadius: '0px',
          border: 'var(--border-brutal)',
          boxShadow: 'var(--shadow-brutal-lg)'
        }}>
          <h2 style={{ fontSize: '24px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', marginBottom: '24px', borderBottom: '3px solid #000000', paddingBottom: '12px' }}>Control de Stock por Variante</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px', border: '3px solid #000000' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--primary-yellow)', borderBottom: '3px solid #000000' }}>
                  <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>Prenda</th>
                  <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>Talle</th>
                  <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>Color</th>
                  <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>Stock Actual</th>
                  <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>Modificar</th>
                </tr>
              </thead>
              <tbody>
                {allVariants.map(v => (
                  <tr key={v.id} style={{ borderBottom: '2px solid #000000', fontWeight: '700' }}>
                    <td style={{ padding: '14px 16px' }}>{v.productName}</td>
                    <td style={{ padding: '14px 16px' }}>{v.size || '-'}</td>
                    <td style={{ padding: '14px 16px' }}>{v.color || '-'}</td>
                    <td style={{ padding: '14px 16px', color: v.stock < 5 ? 'red' : 'var(--black)', fontWeight: '900' }}>
                      {v.stock}
                    </td>
                    <td style={{ padding: '14px 16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="number"
                        placeholder={v.stock}
                        onChange={e => setEditingStock({...editingStock, [v.id]: e.target.value})}
                        style={{ width: '60px', padding: '6px', border: '2px solid #000000', borderRadius: '0px', fontWeight: '900', outline: 'none' }}
                      />
                      <button onClick={() => handleStockUpdate(v.id)} style={{ color: 'blue', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', textDecoration: 'underline', fontSize: '13px' }}>
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
          backgroundColor: 'var(--white)',
          padding: '32px',
          borderRadius: '0px',
          border: 'var(--border-brutal)',
          boxShadow: 'var(--shadow-brutal-lg)'
        }}>
          <h2 style={{ fontSize: '24px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase', marginBottom: '24px', borderBottom: '3px solid #000000', paddingBottom: '12px' }}>Clientes Registrados</h2>
          {loadingUsers ? (
            <p style={{ color: 'var(--black)', fontWeight: '800', fontFamily: 'var(--display)', textTransform: 'uppercase' }}>Cargando clientes...</p>
          ) : users.length === 0 ? (
            <p style={{ color: 'var(--black)', fontWeight: '800', fontFamily: 'var(--display)', textTransform: 'uppercase' }}>No hay clientes registrados aún.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px', border: '3px solid #000000' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--primary-yellow)', borderBottom: '3px solid #000000' }}>
                    <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>Nombre</th>
                    <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>Email</th>
                    <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>Teléfono</th>
                    <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>Dirección</th>
                    <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>Rol</th>
                    <th style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: '900', textTransform: 'uppercase' }}>Fecha Registro</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{ borderBottom: '2px solid #000000', fontWeight: '700' }}>
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
    </div>
  );
};

export default Admin;
