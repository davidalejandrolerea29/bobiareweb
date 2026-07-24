import React, { useEffect, useState } from 'react';
import { Search, ArrowLeft, PackageCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ordersApi } from '../../services/ordersApi';
import { ApiError } from '../../services/apiClient';
import { Order, OrderStatus } from '../../types';

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: 'pending_payment', label: 'Pendiente de pago' },
  { value: 'deposit_paid', label: 'Seña pagada' },
  { value: 'shipped_by_customer', label: 'En camino al taller' },
  { value: 'received', label: 'Recibido' },
];

const getStatusBadge = (status: string) => {
  const map: Record<string, string> = {
    pending_payment: 'bg-neutral-100 text-neutral-700',
    deposit_paid: 'bg-warning-100 text-warning-700',
    shipped_by_customer: 'bg-primary-100 text-primary-700',
    received: 'bg-success-100 text-success-700',
  };
  const label = statusOptions.find((s) => s.value === status)?.label ?? status;
  return (
    <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${map[status] ?? 'bg-neutral-100 text-neutral-700'}`}>
      {label}
    </span>
  );
};

const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [receivingId, setReceivingId] = useState<number | null>(null);

  const loadOrders = () => {
    setLoading(true);
    ordersApi
      .adminList(statusFilter || undefined)
      .then((response) => setOrders(response.data))
      .catch((err) => setActionError(err instanceof ApiError ? err.message : 'No se pudieron cargar los pedidos'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch al cambiar el filtro, sin loop
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleReceive = async (orderId: number) => {
    setActionError(null);
    setReceivingId(orderId);
    try {
      await ordersApi.receive(orderId);
      loadOrders();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : 'No se pudo marcar como recibido');
    } finally {
      setReceivingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      String(order.id).includes(query) ||
      order.user?.name.toLowerCase().includes(query) ||
      order.user?.email.toLowerCase().includes(query)
    );
  });

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link
            to="/admin"
            className="inline-flex items-center text-sm text-neutral-600 hover:text-primary-500 transition-colors mb-4"
          >
            <ArrowLeft size={16} className="mr-1" /> Volver al Dashboard
          </Link>

          <h1 className="font-heading text-3xl font-bold text-neutral-800">
            Gestión de Pedidos
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-neutral-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Buscar por ID, cliente o email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="p-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Todos los estados</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {actionError && <p className="text-sm text-error-500 mb-4">{actionError}</p>}

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500">Pedido</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500">Cliente</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500">Fecha</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500">Estado</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500">Total</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-neutral-500">Cargando pedidos...</td>
                  </tr>
                )}

                {!loading && filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-neutral-200 hover:bg-neutral-50">
                    <td className="py-4 px-4">#{order.id}</td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-neutral-800">{order.user?.name ?? '—'}</p>
                        <p className="text-sm text-neutral-500">{order.user?.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">{new Date(order.created_at).toLocaleDateString('es-AR')}</td>
                    <td className="py-4 px-4">{getStatusBadge(order.status)}</td>
                    <td className="py-4 px-4 font-medium">${Number(order.total).toLocaleString()}</td>
                    <td className="py-4 px-4">
                      {(order.status === 'deposit_paid' || order.status === 'shipped_by_customer') && (
                        <button
                          onClick={() => handleReceive(order.id)}
                          disabled={receivingId === order.id}
                          className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 transition-colors disabled:opacity-60"
                          title="Marcar como recibido en el taller"
                        >
                          <PackageCheck size={16} className="mr-1" />
                          {receivingId === order.id ? 'Marcando...' : 'Recibir'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

                {!loading && filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-neutral-500">
                      No se encontraron pedidos que coincidan con los filtros seleccionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
