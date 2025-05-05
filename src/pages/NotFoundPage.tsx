import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-heading text-6xl font-bold text-primary-500 mb-4">404</h1>
        <h2 className="font-heading text-2xl font-bold text-neutral-800 mb-6">
          Página no encontrada
        </h2>
        <p className="text-neutral-600 max-w-md mx-auto mb-8">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <Link 
          to="/"
          className="inline-flex items-center px-6 py-3 bg-primary-500 text-white font-medium rounded-md hover:bg-primary-600 transition-colors"
        >
          <Home size={18} className="mr-2" />
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;