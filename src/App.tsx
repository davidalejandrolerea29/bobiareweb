import React from 'react';
import { Routes, Route } from 'react-router-dom';  // No es necesario el import de Router
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

// IMPORTA TUS PROVIDERS
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

function App() {
  const [showPromo, setShowPromo] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowPromo(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
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

          {showPromo && (
            <PromoPopup
              title="¡Oferta Especial!"
              message="20% de descuento en todos los servicios de arenado este mes."
              onClose={() => setShowPromo(false)}
            />
          )}
        </CartProvider>
      </AuthProvider>
    </>
  );
}

export default App;
