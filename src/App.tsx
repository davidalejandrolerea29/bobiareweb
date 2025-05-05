import React from 'react';
import { Routes, Route } from 'react-router-dom';
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

function App() {
  const [showPromo, setShowPromo] = React.useState(false);

  React.useEffect(() => {
    // Show promo popup after 5 seconds
    const timer = setTimeout(() => {
      setShowPromo(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
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
      </Routes>
      
      {showPromo && (
        <PromoPopup 
          title="¡Oferta Especial!" 
          message="20% de descuento en todos los servicios de arenado este mes."
          onClose={() => setShowPromo(false)}
        />
      )}
    </>
  );
}

export default App;