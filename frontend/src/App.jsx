import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';


// Pages
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Product from './pages/Product';
import Checkout from './pages/Checkout';
import Account from './pages/Account';
import Orders from './pages/Orders';
import Admin from './pages/Admin';

import './App.css';

function App() {
  const { checkUser } = useAuth();

  useEffect(() => {
    // Verificar si hay una sesión activa de forma automática al montar el sitio
    checkUser();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Barra de Navegación */}
      <Navbar />

      {/* Contenido Principal */}
      <main style={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Catalog />} />
          <Route path="/productos/:id" element={<Product />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/mi-cuenta" element={<Account />} />
          <Route path="/mi-cuenta/pedidos" element={<Orders />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>


      {/* Pie de Página */}
      <Footer />
    </div>
  );
}

export default App;
