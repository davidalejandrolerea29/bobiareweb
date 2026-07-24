import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Calendar,
  Package,
  LogOut,
  Plus,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ordersApi } from '../../services/ordersApi';
import { Order } from '../../types';

const statusLabels: Record<string, string> = {
  pending_payment: 'Pendiente de pago',
  deposit_paid: 'Seña pagada',
  shipped_by_customer: 'En camino al taller',
  received: 'Recibido',
};

const AdminDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [totalOrders, setTotalOrders] = useState<number | null>(null);

  useEffect(() => {
    ordersApi
      .adminList()
      .then((response) => {
        setRecentOrders(response.data.slice(0, 5));
        setTotalOrders(response.total);
      })
      .catch(() => {
        setRecentOrders([]);
        setTotalOrders(null);
      });
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User size={32} className="text-neutral-800" />
              <div>
                <span className="font-medium block">{user?.name}</span>
                <span className="text-xs text-neutral-500">{user?.role?.name}</span>
              </div>
            </div>
            <button onClick={handleLogout} className="text-neutral-800 hover:text-red-500" title="Cerrar sesión">
              <LogOut size={20} />
            </button>
          </div>

          <Link
            to="/admin/addproduct"
            className="bg-primary-600 text-white p-3 rounded-md flex items-center hover:bg-primary-700 transition-all"
          >
            <Plus size={18} className="mr-2" />
            Agregar Producto
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-neutral-600">Pedidos Totales</h3>
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <ShoppingBag size={20} className="text-primary-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-neutral-800">
              {totalOrders ?? '—'}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-neutral-600">Ingresos del mes</h3>
              <div className="w-10 h-10 rounded-full bg-success-100 flex items-center justify-center">
                <ShoppingBag size={20} className="text-success-500" />
              </div>
            </div>
            <p className="text-neutral-400 text-sm">Próximamente (falta reporte en el backend)</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-neutral-600">Clientes Totales</h3>
              <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center">
                <User size={20} className="text-secondary-600" />
              </div>
            </div>
            <p className="text-neutral-400 text-sm">Próximamente (falta reporte en el backend)</p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading font-semibold text-xl text-neutral-800">
              Pedidos Recientes
            </h2>
            <Link to="/admin/pedidos" className="text-sm text-primary-500 hover:text-primary-600 transition-colors">
              Ver todos
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500">ID</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500">Cliente</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500">Estado</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-neutral-200 hover:bg-neutral-50">
                    <td className="py-4 px-4 text-sm">#{order.id}</td>
                    <td className="py-4 px-4 text-sm">{order.user?.name ?? '—'}</td>
                    <td className="py-4 px-4">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded">
                        {statusLabels[order.status] ?? order.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm font-medium">${Number(order.total).toLocaleString()}</td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-sm text-neutral-500">
                      Todavía no hay pedidos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
              <p className="text-sm text-neutral-600">Programación de entregas (próximamente)</p>
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
