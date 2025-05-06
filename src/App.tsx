import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminCalendarPage from './pages/admin/AdminCalendarPage';
import NotFoundPage from './pages/NotFoundPage';
import PromoPopup from './components/marketing/PromoPopup';
import Login from './pages/LoginPage';
import LandingPage from './pages/LandingPage';


import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

function App() {
  const [showPromo, setShowPromo] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    // Solo activa el promo en rutas distintas de '/' y '/login'
    if (location.pathname !== '/' && location.pathname !== '/login') {
      const timer = setTimeout(() => {
        setShowPromo(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* LandingPage SIN Layout */}
          <Route path="/" element={<LandingPage />} />

          {/* Todas las demás rutas CON Layout */}
          <Route path="/" element={<Layout />}>
            <Route path="home" element={<HomePage />} />
            <Route path="productos" element={<ProductListPage />} />
            <Route path="productos/:productId" element={<ProductDetailPage />} />
            <Route path="carrito" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="confirmacion/:orderId" element={<OrderConfirmationPage />} />
            <Route path="admin" element={<AdminDashboardPage />} />
            <Route path="admin/pedidos" element={<AdminOrdersPage />} />
            <Route path="admin/calendario" element={<AdminCalendarPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          <Route path="/login" element={<Login />} />
        </Routes>

        {/* Solo muestra PromoPopup en páginas que no sean '/' ni '/login' */}
        {showPromo && (
          <PromoPopup
            title="¡Oferta Especial!"
            message="20% de descuento en todos los servicios de arenado este mes."
            onClose={() => setShowPromo(false)}
          />
        )}
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

