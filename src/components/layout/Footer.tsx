import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="font-heading font-bold text-xl mb-4">BOBIARESA</h3>
            <p className="text-neutral-300 mb-4">
              Especialistas en tratamiento de superficies para la industria y particulares desde 1985.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-primary-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-primary-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-primary-400 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-neutral-300 hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/productos" className="text-neutral-300 hover:text-white transition-colors">
                  Servicios
                </Link>
              </li>
              <li>
                <Link to="/productos?category=Motos" className="text-neutral-300 hover:text-white transition-colors">
                  Motos
                </Link>
              </li>
              <li>
                <Link to="/productos?category=Industrial" className="text-neutral-300 hover:text-white transition-colors">
                  Industrial
                </Link>
              </li>
              <li>
                <Link to="/nosotros" className="text-neutral-300 hover:text-white transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Servicios</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/productos?service=arenado" className="text-neutral-300 hover:text-white transition-colors">
                  Arenado
                </Link>
              </li>
              <li>
                <Link to="/productos?service=pintura" className="text-neutral-300 hover:text-white transition-colors">
                  Pintura
                </Link>
              </li>
              <li>
                <Link to="/productos?service=anticorrosivo" className="text-neutral-300 hover:text-white transition-colors">
                  Tratamiento Anticorrosivo
                </Link>
              </li>
              <li>
                <Link to="/productos?service=pulido" className="text-neutral-300 hover:text-white transition-colors">
                  Pulido
                </Link>
              </li>
              <li>
                <Link to="/productos?service=powder" className="text-neutral-300 hover:text-white transition-colors">
                  Powdercoating
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 text-primary-400" />
                <span className="text-neutral-300">
                  Av. Industrial 1234, Buenos Aires, Argentina
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-primary-400" />
                <span className="text-neutral-300">
                  +54 11 4567-8900
                </span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-primary-400" />
                <span className="text-neutral-300">
                  info@bobiaresa.com.ar
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-700 mt-8 pt-8 text-center text-neutral-400">
          <p>© {new Date().getFullYear()} BOBIARESA. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;