import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Edit, 
  Trash2, 
  Eye,
  ArrowLeft,
  DownloadCloud
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock orders data - in a real app, this would come from an API
const mockOrders = [
  {
    id: '#12345',
    customer: 'Juan Pérez',
    email: 'juan.perez@example.com',
    product: 'Arenado de Cuadro de Moto',
    date: '2023-08-20',
    status: 'processing',
    total: 25000,
  },
  {
    id: '#12344',
    customer: 'María González',
    email: 'maria.gonzalez@example.com',
    product: 'Pintura Industrial',
    date: '2023-08-19',
    status: 'completed',
    total: 35000,
  },
  {
    id: '#12343',
    customer: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@example.com',
    product: 'Restauración de Muebles',
    date: '2023-08-18',
    status: 'pending',
    total: 18000,
  },
  {
    id: '#12342',
    customer: 'Laura Fernández',
    email: 'laura.fernandez@example.com',
    product: 'Pulido de Acero',
    date: '2023-08-18',
    status: 'shipping',
    total: 12000,
  },
  {
    id: '#12341',
    customer: 'Roberto Silva',
    email: 'roberto.silva@example.com',
    product: 'Powdercoating Bicicleta',
    date: '2023-08-17',
    status: 'completed',
    total: 22000,
  },
  {
    id: '#12340',
    customer: 'Ana Martínez',
    email: 'ana.martinez@example.com',
    product: 'Tratamiento Anticorrosivo',
    date: '2023-08-16',
    status: 'cancelled',
    total: 35000,
  },
  {
    id: '#12339',
    customer: 'Pedro López',
    email: 'pedro.lopez@example.com',
    product: 'Arenado de Llantas',
    date: '2023-08-15',
    status: 'completed',
    total: 15000,
  },
];

const AdminOrdersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Handle sort toggle
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Filter and sort orders
  const filteredOrders = mockOrders.filter(order => {
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        order.product.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      return order.status === statusFilter;
    }
    
    return true;
  }).sort((a, b) => {
    if (!sortField) return 0;
    
    // Handle different field types
    if (sortField === 'total') {
      return sortDirection === 'asc' 
        ? a.total - b.total 
        : b.total - a.total;
    }
    
    if (sortField === 'date') {
      return sortDirection === 'asc'
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    
    // Default string comparison
    const aValue = (a as any)[sortField];
    const bValue = (b as any)[sortField];
    
    if (sortDirection === 'asc') {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });
  
  // Status badge style based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-block px-2 py-1 text-xs font-medium bg-neutral-100 text-neutral-700 rounded">Pendiente</span>;
      case 'processing':
        return <span className="inline-block px-2 py-1 text-xs font-medium bg-warning-100 text-warning-700 rounded">Procesando</span>;
      case 'shipping':
        return <span className="inline-block px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded">Enviando</span>;
      case 'completed':
        return <span className="inline-block px-2 py-1 text-xs font-medium bg-success-100 text-success-700 rounded">Completado</span>;
      case 'cancelled':
        return <span className="inline-block px-2 py-1 text-xs font-medium bg-error-100 text-error-700 rounded">Cancelado</span>;
      default:
        return <span className="inline-block px-2 py-1 text-xs font-medium bg-neutral-100 text-neutral-700 rounded">{status}</span>;
    }
  };
  
  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/admin"
            className="inline-flex items-center text-sm text-neutral-600 hover:text-primary-500 transition-colors mb-4"
          >
            <ArrowLeft size={16} className="mr-1" /> Volver al Dashboard
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="font-heading text-3xl font-bold text-neutral-800 mb-4 md:mb-0">
              Gestión de Pedidos
            </h1>
            
            <button
              className="inline-flex items-center px-4 py-2 bg-primary-500 text-white font-medium rounded-md hover:bg-primary-600 transition-colors"
            >
              <DownloadCloud size={18} className="mr-2" />
              Exportar Pedidos
            </button>
          </div>
        </div>
        
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-neutral-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="Buscar por ID, cliente o producto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Filter Toggle - Mobile */}
            <div className="lg:hidden">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-between p-2 border border-neutral-300 rounded-md"
              >
                <div className="flex items-center">
                  <Filter size={18} className="mr-2 text-neutral-500" />
                  <span>Filtros</span>
                </div>
                <ChevronDown size={18} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
            
            {/* Filters - Desktop */}
            <div className={`lg:flex items-center gap-4 ${showFilters ? 'block' : 'hidden lg:flex'}`}>
              <div>
                <label htmlFor="status-filter" className="block text-sm font-medium text-neutral-700 mb-1">
                  Estado
                </label>
                <select
                  id="status-filter"
                  className="w-full p-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  value={statusFilter || ''}
                  onChange={(e) => setStatusFilter(e.target.value || null)}
                >
                  <option value="">Todos</option>
                  <option value="pending">Pendiente</option>
                  <option value="processing">Procesando</option>
                  <option value="shipping">Enviando</option>
                  <option value="completed">Completado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="date-filter" className="block text-sm font-medium text-neutral-700 mb-1">
                  Fecha
                </label>
                <select
                  id="date-filter"
                  className="w-full p-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option>Todos</option>
                  <option>Última semana</option>
                  <option>Último mes</option>
                  <option>Último trimestre</option>
                </select>
              </div>
              
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter(null);
                }}
                className="text-primary-500 hover:text-primary-600 text-sm font-medium mt-6"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>
        
        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th 
                    className="py-3 px-4 text-left text-sm font-medium text-neutral-500"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center cursor-pointer">
                      ID de Pedido
                      {sortField === 'id' && (
                        sortDirection === 'asc' ? 
                          <ChevronUp size={16} className="ml-1" /> : 
                          <ChevronDown size={16} className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 text-left text-sm font-medium text-neutral-500"
                    onClick={() => handleSort('customer')}
                  >
                    <div className="flex items-center cursor-pointer">
                      Cliente
                      {sortField === 'customer' && (
                        sortDirection === 'asc' ? 
                          <ChevronUp size={16} className="ml-1" /> : 
                          <ChevronDown size={16} className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 text-left text-sm font-medium text-neutral-500"
                    onClick={() => handleSort('product')}
                  >
                    <div className="flex items-center cursor-pointer">
                      Producto
                      {sortField === 'product' && (
                        sortDirection === 'asc' ? 
                          <ChevronUp size={16} className="ml-1" /> : 
                          <ChevronDown size={16} className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 text-left text-sm font-medium text-neutral-500"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center cursor-pointer">
                      Fecha
                      {sortField === 'date' && (
                        sortDirection === 'asc' ? 
                          <ChevronUp size={16} className="ml-1" /> : 
                          <ChevronDown size={16} className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 text-left text-sm font-medium text-neutral-500"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center cursor-pointer">
                      Estado
                      {sortField === 'status' && (
                        sortDirection === 'asc' ? 
                          <ChevronUp size={16} className="ml-1" /> : 
                          <ChevronDown size={16} className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 text-left text-sm font-medium text-neutral-500"
                    onClick={() => handleSort('total')}
                  >
                    <div className="flex items-center cursor-pointer">
                      Total
                      {sortField === 'total' && (
                        sortDirection === 'asc' ? 
                          <ChevronUp size={16} className="ml-1" /> : 
                          <ChevronDown size={16} className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-neutral-200 hover:bg-neutral-50">
                    <td className="py-4 px-4">{order.id}</td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-neutral-800">{order.customer}</p>
                        <p className="text-sm text-neutral-500">{order.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">{order.product}</td>
                    <td className="py-4 px-4">{new Date(order.date).toLocaleDateString('es-AR')}</td>
                    <td className="py-4 px-4">{getStatusBadge(order.status)}</td>
                    <td className="py-4 px-4 font-medium">${order.total.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <button className="p-1 text-neutral-500 hover:text-primary-500 transition-colors" title="Ver detalles">
                          <Eye size={18} />
                        </button>
                        <button className="p-1 text-neutral-500 hover:text-primary-500 transition-colors" title="Editar">
                          <Edit size={18} />
                        </button>
                        <button className="p-1 text-neutral-500 hover:text-error-500 transition-colors" title="Eliminar">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-neutral-500">
                      No se encontraron pedidos que coincidan con los filtros seleccionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-4 py-3 flex items-center justify-between border-t border-neutral-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="px-4 py-2 border border-neutral-300 text-sm font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50">
                Anterior
              </button>
              <button className="ml-3 px-4 py-2 border border-neutral-300 text-sm font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50">
                Siguiente
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-neutral-700">
                  Mostrando <span className="font-medium">1</span> a <span className="font-medium">{filteredOrders.length}</span> de <span className="font-medium">{mockOrders.length}</span> resultados
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50">
                    <span className="sr-only">Anterior</span>
                    <ChevronLeft size={18} />
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-neutral-300 bg-primary-50 text-sm font-medium text-primary-600">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50">
                    2
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50">
                    3
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50">
                    <span className="sr-only">Siguiente</span>
                    <ChevronRight size={18} />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;