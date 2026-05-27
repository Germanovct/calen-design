import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Layout Components
import BenefitsBar from './components/BenefitsBar';
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
import Archive from './pages/Archive';
import FAQ from './pages/FAQ';
import ShippingPolicy from './pages/ShippingPolicy';
import Returns from './pages/Returns';
import Remorse from './pages/Remorse';

import './App.css';

function App() {
  const { checkUser } = useAuth();

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Barra de beneficios — sticky top:0, z:100 */}
      <BenefitsBar />

      {/* Navbar — sticky debajo de la barra */}
      <Navbar />

      {/* Contenido Principal */}
      <main style={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/"                          element={<Home />} />
          <Route path="/productos"                 element={<Catalog />} />
          <Route path="/productos/:id"             element={<Product />} />
          <Route path="/checkout"                  element={<Checkout />} />
          <Route path="/mi-cuenta"                 element={<Account />} />
          <Route path="/mi-cuenta/pedidos"         element={<Orders />} />
          <Route path="/admin"                     element={<Admin />} />
          <Route path="/archivo"                   element={<Archive />} />
          <Route path="/preguntas-frecuentes"      element={<FAQ />} />
          <Route path="/politicas-de-envio"        element={<ShippingPolicy />} />
          <Route path="/cambios-y-devoluciones"    element={<Returns />} />
          <Route path="/boton-de-arrepentimiento"  element={<Remorse />} />
        </Routes>
      </main>

      {/* Pie de Página */}
      <Footer />
    </div>
  );
}

export default App;
