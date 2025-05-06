import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleEmpresaClick = () => {
    window.location.href = 'https://bobiaresa.com.ar/';
  };

  const handleClienteClick = () => {
    navigate('/home');
  };

  return (
    <div className="relative h-screen w-screen flex items-center justify-center bg-gradient-to-r from-primary-600 to-primary-400">
      <img
        src="https://images.pexels.com/photos/2760243/pexels-photo-2760243.jpeg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      <div className="relative z-10 text-center px-6">
        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white font-bold mb-6 animate-fade-in">
          Bienvenido a Bobiare
        </h1>
        <p className="text-white/90 mb-8 text-lg animate-slide-up">
          Elige tu experiencia para continuar
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <button
            onClick={handleEmpresaClick}
            className="px-8 py-4 bg-primary-500 text-white font-medium rounded-md hover:bg-primary-700 transition"
          >
            Bobiare Empresarial
          </button>
          <button
            onClick={handleClienteClick}
            className="px-8 py-4 bg-white text-primary-600 font-medium rounded-md hover:bg-neutral-100 transition"
          >
            Bobiare Cliente
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
