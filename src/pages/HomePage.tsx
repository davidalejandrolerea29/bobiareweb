import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Shield, Clock, Truck, PenTool as Tool } from 'lucide-react';
import ProductGrid from '../components/products/ProductGrid';
import { products } from '../data/products';

const HomePage: React.FC = () => {
  // Featured products - show first 4 products
  const featuredProducts = products.slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10"></div>
        <img 
          src="https://images.pexels.com/photos/2760243/pexels-photo-2760243.jpeg" 
          alt="Industrial surface treatment" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-lg">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fade-in">
              Expertos en Tratamiento de Superficies
            </h1>
            <p className="text-lg text-white/90 mb-8 animate-slide-up">
              Servicio profesional para industrias y particulares con más de 30 años de experiencia. Calidad garantizada.
            </p>
            <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link 
                to="/login" 
                className="px-6 py-3 bg-primary-500 text-white font-medium rounded-md hover:bg-primary-600 transition-colors"
              >
                Ver Servicios
              </Link>
              <Link 
                to="/nosotros" 
                className="px-6 py-3 bg-white text-primary-600 font-medium rounded-md hover:bg-neutral-100 transition-colors"
              >
                Conocer más
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-neutral-800 mb-4">
              Nuestros Servicios
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Ofrecemos una amplia gama de tratamientos de superficie para todo tipo de materiales y necesidades.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:-translate-y-1 hover:shadow-lg">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Tool size={24} className="text-primary-600" />
              </div>
              <h3 className="font-heading font-semibold text-xl mb-3">Arenado Profesional</h3>
              <p className="text-neutral-600 mb-4">
                Eliminamos óxido, pintura vieja y contaminantes de cualquier superficie metálica. Ideal para preparación antes de pintura.
              </p>
              <Link 
                to="/productos?service=arenado" 
                className="inline-flex items-center text-primary-500 font-medium hover:text-primary-600 transition-colors"
              >
                Ver más <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>

            {/* Service 2 */}
            <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:-translate-y-1 hover:shadow-lg">
              <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-secondary-600 font-bold text-lg">P</span>
              </div>
              <h3 className="font-heading font-semibold text-xl mb-3">Pintura Industrial</h3>
              <p className="text-neutral-600 mb-4">
                Aplicamos pinturas de alta calidad con técnicas industriales para asegurar un acabado duradero y resistente.
              </p>
              <Link 
                to="/productos?service=pintura" 
                className="inline-flex items-center text-primary-500 font-medium hover:text-primary-600 transition-colors"
              >
                Ver más <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>

            {/* Service 3 */}
            <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:-translate-y-1 hover:shadow-lg">
              <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mb-4">
                <Shield size={24} className="text-accent-600" />
              </div>
              <h3 className="font-heading font-semibold text-xl mb-3">Tratamiento Anticorrosivo</h3>
              <p className="text-neutral-600 mb-4">
                Protección especializada contra la corrosión para entornos agresivos, marítimos e industriales.
              </p>
              <Link 
                to="/productos?service=anticorrosivo" 
                className="inline-flex items-center text-primary-500 font-medium hover:text-primary-600 transition-colors"
              >
                Ver más <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-3xl font-bold text-neutral-800">
              Servicios Destacados
            </h2>
            <Link 
              to="/login"
              className="text-primary-500 font-medium hover:text-primary-600 transition-colors"
            >
              Ver todos
            </Link>
          </div>

          <ProductGrid products={featuredProducts} />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-neutral-800 mb-4">
              Por Qué Elegirnos
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Nos distinguimos por brindar un servicio de máxima calidad y satisfacción para nuestros clientes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center mx-auto mb-4">
                <Shield size={32} className="text-primary-500" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">Calidad Garantizada</h3>
              <p className="text-neutral-600">
                Todos nuestros trabajos cuentan con garantía y utilizamos productos de primera calidad.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center mx-auto mb-4">
                <Clock size={32} className="text-primary-500" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">Tiempos Flexibles</h3>
              <p className="text-neutral-600">
                Adaptamos nuestros plazos de entrega según tus necesidades con opciones para todos.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center mx-auto mb-4">
                <Truck size={32} className="text-primary-500" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">Logística Integral</h3>
              <p className="text-neutral-600">
                Nos encargamos del retiro y entrega de tus piezas para tu comodidad.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-500 font-bold text-xl">24/7</span>
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">Servicio 24/7</h3>
              <p className="text-neutral-600">
                Realiza tus pedidos en cualquier momento a través de nuestra plataforma online.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
            ¿Listo para transformar tus superficies?
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8 text-lg">
            Ya sea para un proyecto industrial o un artículo personal, tenemos la solución perfecta para ti.
          </p>
          <Link 
            to="/productos"
            className="inline-block px-8 py-4 bg-white text-primary-600 font-medium rounded-md hover:bg-neutral-100 transition-colors text-lg"
          >
            Explorar Servicios
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;