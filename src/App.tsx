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
import AddProductScreen from './pages/admin/AddProductScreen'; // Nueva importación
import NotFoundPage from './pages/NotFoundPage';
import PromoPopup from './components/marketing/PromoPopup';
import Login from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import RegisterScreen from './pages/RegisterScreen';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

function App() {
  const [showPromo, setShowPromo] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    const adminPaths = ['/admin', '/admin/pedidos', '/admin/calendario'];
    if (
      location.pathname !== '/' &&
      location.pathname !== '/login' &&
      !adminPaths.some((path) => location.pathname.startsWith(path))
    ) {
      const timer = setTimeout(() => {
        setShowPromo(true);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setShowPromo(false);
    }
  }, [location.pathname]);

  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
        
          <Route path="/" element={<Layout />}>
            <Route path="home" element={<HomePage />} />
            <Route path="productos" element={<ProductListPage />} />
            <Route path="productos/:productId" element={<ProductDetailPage />} />
            <Route path="carrito" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="register" element={<RegisterScreen />} />
            <Route path="confirmacion/:orderId" element={<OrderConfirmationPage />} />
            <Route path="admin" element={<AdminDashboardPage />} />
            <Route path="admin/pedidos" element={<AdminOrdersPage />} />
            <Route path="admin/calendario" element={<AdminCalendarPage />} />
            <Route path="admin/addproduct" element={<AddProductScreen />} /> {/* Nueva ruta */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>

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
