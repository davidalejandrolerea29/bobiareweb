import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import {
  Menu,
  X,
  Home,
  Users,
  Settings,
  LogOut,
  ShoppingBag,
  Calendar,
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => setIsOpen(!isOpen);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:inset-0 transition-transform duration-300 ease-in-out bg-white w-64 shadow-lg z-50`}>
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <h2 className="text-xl font-bold text-primary-600">Admin Panel</h2>
          <button className="md:hidden" onClick={toggleDrawer}>
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          <Link to="/admin" className="flex items-center p-2 rounded hover:bg-gray-200">
            <Home className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          <Link to="/admin/pedidos" className="flex items-center p-2 rounded hover:bg-gray-200">
            <ShoppingBag className="w-5 h-5 mr-3" />
            Pedidos
          </Link>
          <Link to="/admin/calendario" className="flex items-center p-2 rounded hover:bg-gray-200">
            <Calendar className="w-5 h-5 mr-3" />
            Calendario
          </Link>
          <Link to="/admin/clientes" className="flex items-center p-2 rounded hover:bg-gray-200">
            <Users className="w-5 h-5 mr-3" />
            Clientes
          </Link>
          <Link to="/admin/configuracion" className="flex items-center p-2 rounded hover:bg-gray-200">
            <Settings className="w-5 h-5 mr-3" />
            Configuración
          </Link>
          <button
            className="flex items-center p-2 rounded hover:bg-gray-200 w-full text-left"
            onClick={() => alert('Cerrar sesión')}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Cerrar sesión
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="flex items-center justify-between bg-white shadow px-4 py-3">
          <button className="md:hidden" onClick={toggleDrawer}>
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-neutral-800">Panel de Administración</h1>
          <div className="flex items-center space-x-4">
            {/* Aquí puedes agregar avatar, nombre, etc */}
            <span className="text-sm font-medium text-neutral-700">Admin</span>
          </div>
        </header>

        {/* Page content (will inject pages like AdminDashboardPage here) */}
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
