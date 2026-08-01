import React, { useEffect, useState } from 'react';
import { AlertCircle, PackageCheck, Search, SlidersHorizontal } from 'lucide-react';
import { ordersApi } from '../../services/ordersApi';
import { ApiError } from '../../services/apiClient';
import { Order, OrderStatus } from '../../types';

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: 'pending_payment', label: 'Pendiente de pago' },
  { value: 'paid', label: 'Pagado' },
  { value: 'shipped_by_customer', label: 'En camino al taller' },
  { value: 'received', label: 'Recibido' },
];

const statusClasses: Record<string, string> = {
  pending_payment: 'bg-neutral-100 text-neutral-700',
  paid: 'bg-amber-100 text-amber-800',
  shipped_by_customer: 'bg-blue-100 text-blue-800',
  received: 'bg-emerald-100 text-emerald-800',
};

const formatMoney = (value: string | number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(Number(value));

const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [receivingId, setReceivingId] = useState<number | null>(null);

  const loadOrders = () => {
    setLoading(true);
    setActionError(null);
    ordersApi
      .adminList(statusFilter || undefined)
      .then((response) => setOrders(response.data))
      .catch((err) => setActionError(err instanceof ApiError ? err.message : 'No se pudieron cargar los pedidos'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- recarga al cambiar el filtro del servidor
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
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      String(order.id).includes(query) ||
      order.user?.name.toLowerCase().includes(query) ||
      order.user?.email.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Todos los pedidos</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Consultá el estado de cada trabajo y registrá su recepción.
          </p>
        </div>
        <p className="text-sm font-medium text-neutral-500">
          {loading ? 'Cargando...' : `${filteredOrders.length} resultados`}
        </p>
      </div>

      <section className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm lg:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Buscar pedidos</span>
          <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            className="h-11 w-full rounded-md border border-neutral-300 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            placeholder="Buscar por número, cliente o email"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </label>
        <label className="relative min-w-60">
          <span className="sr-only">Filtrar por estado</span>
          <SlidersHorizontal size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <select
            className="h-11 w-full appearance-none rounded-md border border-neutral-300 bg-white pl-10 pr-8 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="">Todos los estados</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
      </section>

      {actionError && (
        <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={18} />
          {actionError}
        </div>
      )}

      <section className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-left text-xs font-semibold uppercase text-neutral-500">
                <th className="px-5 py-3">Pedido</th>
                <th className="px-5 py-3">Cliente</th>
                <th className="px-5 py-3">Fecha</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3 text-right">Total</th>
                <th className="px-5 py-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {!loading && filteredOrders.map((order) => {
                const label = statusOptions.find((status) => status.value === order.status)?.label ?? order.status;
                const canReceive = order.status === 'paid' || order.status === 'shipped_by_customer';
                return (
                  <tr key={order.id} className="hover:bg-neutral-50">
                    <td className="px-5 py-4 text-sm font-bold text-neutral-900">#{order.id}</td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-neutral-800">{order.user?.name ?? 'Cliente invitado'}</p>
                      <p className="text-xs text-neutral-500">{order.user?.email ?? 'Sin email'}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-neutral-600">
                      {new Date(order.created_at).toLocaleDateString('es-AR')}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded px-2 py-1 text-xs font-semibold ${statusClasses[order.status] ?? 'bg-neutral-100 text-neutral-700'}`}>
                        {label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right text-sm font-bold text-neutral-900">{formatMoney(order.total)}</td>
                    <td className="px-5 py-4 text-right">
                      {canReceive ? (
                        <button
                          type="button"
                          onClick={() => handleReceive(order.id)}
                          disabled={receivingId === order.id}
                          className="inline-flex h-9 items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 text-xs font-semibold text-neutral-700 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 disabled:cursor-wait disabled:opacity-60"
                        >
                          <PackageCheck size={16} />
                          {receivingId === order.id ? 'Procesando' : 'Recibir'}
                        </button>
                      ) : (
                        <span className="text-xs text-neutral-400">Sin acciones</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {loading && (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center text-sm text-neutral-500">Cargando pedidos...</td>
                </tr>
              )}
              {!loading && filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center">
                    <ShoppingBagEmpty />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

const ShoppingBagEmpty = () => (
  <div>
    <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-neutral-100 text-neutral-400">
      <Search size={20} />
    </div>
    <p className="mt-3 text-sm font-semibold text-neutral-700">No encontramos pedidos</p>
    <p className="mt-1 text-xs text-neutral-500">Probá con otros términos o filtros.</p>
  </div>
);

export default AdminOrdersPage;
