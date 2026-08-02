import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CalendarDays,
  CircleDollarSign,
  Clock3,
  PackageCheck,
  PackagePlus,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import { ordersApi } from '../../services/ordersApi';
import { statsApi, RevenuePeriod, RevenueStats } from '../../services/statsApi';
import { Order } from '../../types';
import RevenueChart from '../../components/admin/RevenueChart';

const statusMeta: Record<string, { label: string; className: string }> = {
  pending_payment: { label: 'Pendiente de pago', className: 'bg-neutral-100 text-neutral-700' },
  paid: { label: 'Pagado', className: 'bg-amber-100 text-amber-800' },
  shipped_by_customer: { label: 'En camino', className: 'bg-blue-100 text-blue-800' },
  received: { label: 'Recibido', className: 'bg-emerald-100 text-emerald-800' },
  in_process: { label: 'En proceso', className: 'bg-purple-100 text-purple-800' },
  ready_to_return: { label: 'Listo para devolver', className: 'bg-teal-100 text-teal-800' },
  shipped_to_customer: { label: 'Despachado', className: 'bg-indigo-100 text-indigo-800' },
};

const PERIOD_OPTIONS: { value: RevenuePeriod; label: string }[] = [
  { value: 'day', label: 'Día' },
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mes' },
  { value: 'year', label: 'Año' },
];

const formatMoney = (value: string | number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(Number(value));

const AdminDashboardPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalOrders, setTotalOrders] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const [revenuePeriod, setRevenuePeriod] = useState<RevenuePeriod>('month');
  const [revenueStats, setRevenueStats] = useState<RevenueStats | null>(null);
  const [revenueLoading, setRevenueLoading] = useState(true);

  useEffect(() => {
    ordersApi
      .adminList()
      .then((response) => {
        setOrders(response.data);
        setTotalOrders(response.total);
      })
      .catch(() => {
        setOrders([]);
        setTotalOrders(null);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- refetch al cambiar el período, sin loop
    setRevenueLoading(true);
    statsApi
      .revenue(revenuePeriod)
      .then(setRevenueStats)
      .catch(() => setRevenueStats(null))
      .finally(() => setRevenueLoading(false));
  }, [revenuePeriod]);

  const pending = orders.filter((order) => order.status === 'pending_payment').length;
  const inTransit = orders.filter((order) => order.status === 'shipped_by_customer').length;
  const received = orders.filter((order) => order.status === 'received').length;
  const recentOrders = orders.slice(0, 5);

  const stats = [
    {
      label: 'Pedidos totales',
      value: totalOrders ?? '—',
      note: 'Registrados en el sistema',
      icon: ShoppingBag,
      iconClass: 'bg-blue-50 text-blue-700',
    },
    {
      label: 'Pagos pendientes',
      value: loading ? '—' : pending,
      note: 'Requieren seguimiento',
      icon: Clock3,
      iconClass: 'bg-amber-50 text-amber-700',
    },
    {
      label: 'En camino',
      value: loading ? '—' : inTransit,
      note: 'Hacia el taller',
      icon: Truck,
      iconClass: 'bg-cyan-50 text-cyan-700',
    },
    {
      label: 'Recibidos',
      value: loading ? '—' : received,
      note: 'Listos para procesar',
      icon: PackageCheck,
      iconClass: 'bg-emerald-50 text-emerald-700',
    },
  ];

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Estado del negocio</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Seguimiento rápido de la operación y los últimos pedidos.
          </p>
        </div>
        <Link
          to="/admin/addproduct"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-primary-700"
        >
          <PackagePlus size={18} />
          Nuevo servicio
        </Link>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Indicadores">
        {stats.map(({ label, value, note, icon: Icon, iconClass }) => (
          <article key={label} className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-neutral-500">{label}</p>
                <p className="mt-2 text-3xl font-bold text-neutral-900">{value}</p>
              </div>
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-md ${iconClass}`}>
                <Icon size={20} />
              </span>
            </div>
            <p className="mt-3 text-xs text-neutral-500">{note}</p>
          </article>
        ))}
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-semibold text-neutral-900">Ingresos</h3>
            <p className="mt-0.5 text-xs text-neutral-500">Acreditado vs. pendiente, por período.</p>
          </div>
          <div className="inline-flex rounded-md border border-neutral-200 p-1">
            {PERIOD_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setRevenuePeriod(option.value)}
                className={`rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
                  revenuePeriod === option.value
                    ? 'bg-primary-600 text-white'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {revenueStats && (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-xs text-neutral-500">Acreditado</p>
              <p className="mt-1 text-xl font-bold text-neutral-900">{formatMoney(revenueStats.totals.accredited)}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">No acreditado</p>
              <p className="mt-1 text-xl font-bold text-neutral-900">{formatMoney(revenueStats.totals.pending)}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Total</p>
              <p className="mt-1 text-xl font-bold text-neutral-900">
                {formatMoney(revenueStats.totals.accredited + revenueStats.totals.pending)}
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Pedidos</p>
              <p className="mt-1 text-xl font-bold text-neutral-900">{revenueStats.totals.order_count}</p>
            </div>
          </div>
        )}

        <div className="mt-5">
          {revenueLoading && !revenueStats && (
            <div className="flex h-60 items-center justify-center text-sm text-neutral-500">Cargando...</div>
          )}
          {revenueStats && (
            <div style={{ opacity: revenueLoading ? 0.6 : 1 }} className="transition-opacity">
              <RevenueChart buckets={revenueStats.buckets} />
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
            <div>
              <h3 className="font-semibold text-neutral-900">Pedidos recientes</h3>
              <p className="mt-0.5 text-xs text-neutral-500">Actividad más reciente</p>
            </div>
            <Link
              to="/admin/pedidos"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700"
            >
              Ver todos <ArrowRight size={16} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="bg-neutral-50 text-left text-xs font-semibold uppercase text-neutral-500">
                  <th className="px-5 py-3">Pedido</th>
                  <th className="px-5 py-3">Cliente</th>
                  <th className="px-5 py-3">Estado</th>
                  <th className="px-5 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {recentOrders.map((order) => {
                  const status = statusMeta[order.status] ?? {
                    label: order.status,
                    className: 'bg-neutral-100 text-neutral-700',
                  };
                  return (
                    <tr key={order.id} className="hover:bg-neutral-50">
                      <td className="px-5 py-4 text-sm font-semibold text-neutral-900">#{order.id}</td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-neutral-800">{order.user?.name ?? 'Sin nombre'}</p>
                        <p className="text-xs text-neutral-500">{order.user?.email ?? 'Cliente invitado'}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded px-2 py-1 text-xs font-semibold ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right text-sm font-semibold text-neutral-900">
                        {formatMoney(order.total)}
                      </td>
                    </tr>
                  );
                })}
                {!loading && recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center text-sm text-neutral-500">
                      Todavía no hay pedidos registrados.
                    </td>
                  </tr>
                )}
                {loading && (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center text-sm text-neutral-500">
                      Cargando actividad...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-neutral-900">Accesos rápidos</h3>
          <div className="mt-4 divide-y divide-neutral-100">
            <Link to="/admin/pedidos" className="group flex items-center gap-3 py-4 first:pt-0">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-blue-50 text-blue-700">
                <ShoppingBag size={19} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-neutral-800">Gestionar pedidos</span>
                <span className="block text-xs text-neutral-500">Buscar y actualizar estados</span>
              </span>
              <ArrowRight size={17} className="text-neutral-300 group-hover:text-primary-600" />
            </Link>
            <Link to="/admin/calendario" className="group flex items-center gap-3 py-4">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-emerald-50 text-emerald-700">
                <CalendarDays size={19} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-neutral-800">Abrir calendario</span>
                <span className="block text-xs text-neutral-500">Revisar la planificación</span>
              </span>
              <ArrowRight size={17} className="text-neutral-300 group-hover:text-primary-600" />
            </Link>
            <Link to="/admin/addproduct" className="group flex items-center gap-3 py-4">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-orange-50 text-orange-700">
                <CircleDollarSign size={19} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-neutral-800">Agregar servicio</span>
                <span className="block text-xs text-neutral-500">Publicar un nuevo servicio</span>
              </span>
              <ArrowRight size={17} className="text-neutral-300 group-hover:text-primary-600" />
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default AdminDashboardPage;
