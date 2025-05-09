import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout: React.FC = () => {
  const location = useLocation();

  // Detecta si es ruta admin
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Solo muestra Header si no es admin */}
      {!isAdminRoute && <Header />}

      <main className="flex-grow pt-16">
        <Outlet />
      </main>

      {/* Solo muestra Footer si no es admin */}
      {!isAdminRoute && <Footer />}
    </div>
  );
};

export default Layout;
