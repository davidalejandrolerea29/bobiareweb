import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Calendar, Truck, ArrowRight } from 'lucide-react';

const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  
  // Calculate estimated delivery date (10 business days from now)
  const getEstimatedDeliveryDate = () => {
    const date = new Date();
    const businessDays = 10;
    let daysAdded = 0;
    
    while (daysAdded < businessDays) {
      date.setDate(date.getDate() + 1);
      const day = date.getDay();
      if (day !== 0 && day !== 6) { // Skip weekends
        daysAdded++;
      }
    }
    
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-primary-500" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-neutral-800 mb-4">
              ¡Pedido Confirmado!
            </h1>
            <p className="text-neutral-600">
              Tu pedido #{orderId} ha sido recibido y está siendo procesado.
            </p>
          </div>
          
          <div className="border-t border-b border-neutral-200 py-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-lg mb-3 flex items-center text-neutral-800">
                  <Calendar size={18} className="mr-2 text-primary-500" />
                  Tiempo de Procesamiento
                </h3>
                <p className="text-neutral-600">
                  Estimamos que tu pedido estará listo para entregar el{' '}
                  <span className="font-medium">{getEstimatedDeliveryDate()}</span>.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-3 flex items-center text-neutral-800">
                  <Truck size={18} className="mr-2 text-primary-500" />
                  Logística de Envío
                </h3>
                <p className="text-neutral-600">
                  Te contactaremos para coordinar el retiro y entrega de tus artículos.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="font-medium text-lg mb-4 text-neutral-800">
              Próximos Pasos
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </div>
                <div className="ml-3">
                  <p className="font-medium text-neutral-800">Procesamiento del Pedido</p>
                  <p className="text-sm text-neutral-600">
                    Tu pedido está siendo revisado y preparado por nuestro equipo.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </div>
                <div className="ml-3">
                  <p className="font-medium text-neutral-800">Retiro del Producto</p>
                  <p className="text-sm text-neutral-600">
                    Nuestro servicio de transporte coordinará el retiro de tus artículos.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </div>
                <div className="ml-3">
                  <p className="font-medium text-neutral-800">Tratamiento de Superficie</p>
                  <p className="text-sm text-neutral-600">
                    Realizaremos el trabajo según tus especificaciones.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  4
                </div>
                <div className="ml-3">
                  <p className="font-medium text-neutral-800">Entrega del Producto Finalizado</p>
                  <p className="text-sm text-neutral-600">
                    Tu producto será entregado en la dirección especificada.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-neutral-600 mb-6">
              ¿Necesitas hacer un seguimiento de tu pedido o tienes preguntas? Contacta a nuestro servicio al cliente.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                to="/"
                className="px-6 py-3 bg-primary-500 text-white font-medium rounded-md hover:bg-primary-600 transition-colors flex items-center justify-center"
              >
                Volver al Inicio
              </Link>
              
              <a 
                href="mailto:info@bobiaresa.com.ar"
                className="px-6 py-3 bg-white text-primary-600 border border-primary-500 font-medium rounded-md hover:bg-primary-50 transition-colors flex items-center justify-center"
              >
                Contactar Servicio al Cliente
              </a>
            </div>
          </div>
        </div>
        
        <div className="max-w-2xl mx-auto mt-8 text-center">
          <h3 className="font-heading font-semibold text-xl mb-4 text-neutral-800">
            ¿Qué te gustaría hacer ahora?
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/productos"
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col items-center"
            >
              <span className="font-medium text-lg text-neutral-800 mb-2">
                Explorar Más Servicios
              </span>
              <span className="text-sm text-neutral-600 mb-4">
                Descubre nuestro catálogo completo de servicios
              </span>
              <ArrowRight size={20} className="text-primary-500" />
            </Link>
            
            <Link
              to="/productos?category=Motos"
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col items-center"
            >
              <span className="font-medium text-lg text-neutral-800 mb-2">
                Ver Servicios para Motos
              </span>
              <span className="text-sm text-neutral-600 mb-4">
                Tratamientos especializados para motocicletas
              </span>
              <ArrowRight size={20} className="text-primary-500" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;