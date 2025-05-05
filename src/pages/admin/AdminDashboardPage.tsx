import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart, 
  ShoppingBag, 
  Calendar, 
  Package, 
  TrendingUp,
  AlertCircle,
  Users,
  DollarSign
} from 'lucide-react';

const AdminDashboardPage: React.FC = () => {
  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-neutral-800 mb-2">
            Panel de Administración
          </h1>
          <p className="text-neutral-600">
            Gestiona pedidos, inventario y seguimiento de servicios.
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Orders */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-neutral-600">Pedidos Totales</h3>
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <ShoppingBag size={20} className="text-primary-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-neutral-800 mb-2">28</p>
            <p className="text-sm text-success-500 flex items-center">
              <TrendingUp size={14} className="mr-1" /> 12% desde el mes pasado
            </p>
          </div>
          
          {/* Pending Orders */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-neutral-600">Pedidos Pendientes</h3>
              <div className="w-10 h-10 rounded-full bg-warning-100 flex items-center justify-center">
                <AlertCircle size={20} className="text-warning-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-neutral-800 mb-2">8</p>
            <p className="text-sm text-neutral-500">Necesitan atención</p>
          </div>
          
          {/* Revenue */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-neutral-600">Ingresos del Mes</h3>
              <div className="w-10 h-10 rounded-full bg-success-100 flex items-center justify-center">
                <DollarSign size={20} className="text-success-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-neutral-800 mb-2">$258,450</p>
            <p className="text-sm text-success-500 flex items-center">
              <TrendingUp size={14} className="mr-1" /> 18% desde el mes pasado
            </p>
          </div>
          
          {/* Total Customers */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-neutral-600">Clientes Totales</h3>
              <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center">
                <Users size={20} className="text-secondary-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-neutral-800 mb-2">194</p>
            <p className="text-sm text-success-500 flex items-center">
              <TrendingUp size={14} className="mr-1" /> 5% desde el mes pasado
            </p>
          </div>
        </div>
        
        {/* Main Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-semibold text-xl text-neutral-800">
                Pedidos Recientes
              </h2>
              <Link 
                to="/admin/pedidos"
                className="text-sm text-primary-500 hover:text-primary-600 transition-colors"
              >
                Ver todos
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500">ID</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500">Cliente</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500">Producto</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500">Estado</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Order 1 */}
                  <tr className="border-b border-neutral-200 hover:bg-neutral-50">
                    <td className="py-4 px-4 text-sm">#12345</td>
                    <td className="py-4 px-4 text-sm">Juan Pérez</td>
                    <td className="py-4 px-4 text-sm">Arenado de Cuadro</td>
                    <td className="py-4 px-4">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-warning-100 text-warning-700 rounded">
                        Procesando
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm font-medium">$25,000</td>
                  </tr>
                  
                  {/* Order 2 */}
                  <tr className="border-b border-neutral-200 hover:bg-neutral-50">
                    <td className="py-4 px-4 text-sm">#12344</td>
                    <td className="py-4 px-4 text-sm">María González</td>
                    <td className="py-4 px-4 text-sm">Pintura Industrial</td>
                    <td className="py-4 px-4">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-success-100 text-success-700 rounded">
                        Completado
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm font-medium">$35,000</td>
                  </tr>
                  
                  {/* Order 3 */}
                  <tr className="border-b border-neutral-200 hover:bg-neutral-50">
                    <td className="py-4 px-4 text-sm">#12343</td>
                    <td className="py-4 px-4 text-sm">Carlos Rodríguez</td>
                    <td className="py-4 px-4 text-sm">Restauración de Muebles</td>
                    <td className="py-4 px-4">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-neutral-100 text-neutral-700 rounded">
                        Pendiente
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm font-medium">$18,000</td>
                  </tr>
                  
                  {/* Order 4 */}
                  <tr className="hover:bg-neutral-50">
                    <td className="py-4 px-4 text-sm">#12342</td>
                    <td className="py-4 px-4 text-sm">Laura Fernández</td>
                    <td className="py-4 px-4 text-sm">Pulido de Acero</td>
                    <td className="py-4 px-4">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded">
                        Enviando
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm font-medium">$12,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Calendar Preview */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-semibold text-xl text-neutral-800">
                Próximas Entregas
              </h2>
              <Link 
                to="/admin/calendario"
                className="text-sm text-primary-500 hover:text-primary-600 transition-colors"
              >
                Ver calendario
              </Link>
            </div>
            
            <div className="space-y-4">
              {/* Delivery 1 */}
              <div className="flex items-start p-3 rounded-md hover:bg-neutral-50">
                <div className="w-10 h-10 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center mr-3 flex-shrink-0">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="font-medium text-neutral-800">Mañana, 10:00 AM</p>
                  <p className="text-sm text-neutral-600">Entrega #12345 - Juan Pérez</p>
                  <p className="text-xs text-neutral-500 mt-1">Arenado de Cuadro</p>
                </div>
              </div>
              
              {/* Delivery 2 */}
              <div className="flex items-start p-3 rounded-md hover:bg-neutral-50">
                <div className="w-10 h-10 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center mr-3 flex-shrink-0">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="font-medium text-neutral-800">Mañana, 3:00 PM</p>
                  <p className="text-sm text-neutral-600">Entrega #12340 - Roberto Silva</p>
                  <p className="text-xs text-neutral-500 mt-1">Powdercoating Bicicleta</p>
                </div>
              </div>
              
              {/* Delivery 3 */}
              <div className="flex items-start p-3 rounded-md hover:bg-neutral-50">
                <div className="w-10 h-10 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center mr-3 flex-shrink-0">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="font-medium text-neutral-800">23 Aug, 11:30 AM</p>
                  <p className="text-sm text-neutral-600">Entrega #12338 - Ana Martínez</p>
                  <p className="text-xs text-neutral-500 mt-1">Tratamiento Anticorrosivo</p>
                </div>
              </div>
              
              {/* Delivery 4 */}
              <div className="flex items-start p-3 rounded-md hover:bg-neutral-50">
                <div className="w-10 h-10 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center mr-3 flex-shrink-0">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="font-medium text-neutral-800">24 Aug, 2:00 PM</p>
                  <p className="text-sm text-neutral-600">Entrega #12332 - Pedro López</p>
                  <p className="text-xs text-neutral-500 mt-1">Arenado de Llantas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            to="/admin/pedidos"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow flex items-center"
          >
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mr-4">
              <ShoppingBag size={22} className="text-primary-600" />
            </div>
            <div>
              <h3 className="font-medium text-lg text-neutral-800">Gestionar Pedidos</h3>
              <p className="text-sm text-neutral-600">Ver y actualizar estado de pedidos</p>
            </div>
          </Link>
          
          <Link 
            to="/admin/calendario"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow flex items-center"
          >
            <div className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center mr-4">
              <Calendar size={22} className="text-secondary-600" />
            </div>
            <div>
              <h3 className="font-medium text-lg text-neutral-800">Calendario</h3>
              <p className="text-sm text-neutral-600">Ver programación de entregas</p>
            </div>
          </Link>
          
          <Link 
            to="/productos"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow flex items-center"
          >
            <div className="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center mr-4">
              <Package size={22} className="text-accent-600" />
            </div>
            <div>
              <h3 className="font-medium text-lg text-neutral-800">Ver Productos</h3>
              <p className="text-sm text-neutral-600">Gestionar servicios y precios</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;