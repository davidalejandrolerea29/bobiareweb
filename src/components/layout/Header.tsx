import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import logo from 'src/assets/logo1.png';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/home" className="flex items-center">
            <span className="font-heading font-bold text-2xl text-primary-600">
            <img src="/logo2.png" alt="Bobiare Logo" className="h-10 w-auto" />
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/home" 
              className="font-medium text-neutral-800 hover:text-primary-500 transition-colors"
            >
              Inicio
            </Link>
            <Link 
              to="/productos" 
              className="font-medium text-neutral-800 hover:text-primary-500 transition-colors"
            >
              Servicios
            </Link>
            <Link 
              to="/productos?category=Motos" 
              className="font-medium text-neutral-800 hover:text-primary-500 transition-colors"
            >
              Motos
            </Link>
            <Link 
              to="/productos?category=Industrial" 
              className="font-medium text-neutral-800 hover:text-primary-500 transition-colors"
            >
              Industrial
            </Link>
            <Link 
              to="/productos?category=Hogar" 
              className="font-medium text-neutral-800 hover:text-primary-500 transition-colors"
            >
              Hogar
            </Link>
          </nav>

          {/* Search and Cart */}
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-neutral-100 transition-colors">
              <Search size={20} className="text-neutral-700" />
            </button>
            <Link to="/carrito" className="p-2 rounded-full hover:bg-neutral-100 transition-colors relative">
              <ShoppingCart size={20} className="text-neutral-700" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link to="/login" className="p-2 rounded-full hover:bg-neutral-100 transition-colors">
              <User size={20} className="text-neutral-700" />
            </Link>
            <button 
              className="md:hidden p-2 rounded-full hover:bg-neutral-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg mt-2 animate-slide-down">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="py-2 font-medium text-neutral-800 hover:text-primary-500 transition-colors"
              >
                Inicio
              </Link>
              <Link 
                to="/productos" 
                className="py-2 font-medium text-neutral-800 hover:text-primary-500 transition-colors"
              >
                Servicios
              </Link>
              <Link 
                to="/productos?category=Motos" 
                className="py-2 font-medium text-neutral-800 hover:text-primary-500 transition-colors"
              >
                Motos
              </Link>
              <Link 
                to="/productos?category=Industrial" 
                className="py-2 font-medium text-neutral-800 hover:text-primary-500 transition-colors"
              >
                Industrial
              </Link>
              <Link 
                to="/productos?category=Hogar" 
                className="py-2 font-medium text-neutral-800 hover:text-primary-500 transition-colors"
              >
                Hogar
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;