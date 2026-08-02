import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowRight, LoaderCircle, PackageSearch } from 'lucide-react';
import { ordersApi } from '../services/ordersApi';
import { ApiError } from '../services/apiClient';
import { Order } from '../types';

const statusLabels: Record<string, string> = {
  cart: 'Carrito',
  pending_payment: 'Esperando pago',
  paid: 'Pago acreditado — falta cargar el envío',
  shipped_by_customer: 'Pieza en camino al taller',
  received: 'Pieza recibida en el taller',
};

const formatMoney = (value: string | number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(Number(value));

// A dónde vuelve el cliente para seguir un pedido en curso (ej. cargar el
// número de seguimiento cuando lo tenga) — antes no había forma de volver
// salvo guardar el link de /confirmacion/{id} a mano.
const MyOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ordersApi
      .mine()
      .then(setOrders)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'No pudimos cargar tus pedidos.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="font-heading text-3xl font-bold text-neutral-800 mb-8">Mis pedidos</h1>

        {loading && (
          <div className="flex items-center justify-center gap-2 py-16 text-neutral-500">
            <LoaderCircle size={20} className="animate-spin" /> Cargando tus pedidos...
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={18} className="shrink-0" />
            {error}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-16">
            <PackageSearch size={40} className="mx-auto text-neutral-300 mb-3" />
            <p className="text-neutral-600">Todavía no hiciste ningún pedido.</p>
            <Link to="/productos" className="mt-4 inline-block text-primary-600 font-medium hover:text-primary-700">
              Ver servicios
            </Link>
          </div>
        )}

        <div className="space-y-3">
          {orders
            .filter((order) => order.status !== 'cart')
            .map((order) => (
              <Link
                key={order.id}
                to={`/confirmacion/${order.id}`}
                className="flex items-center justify-between bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow"
              >
                <div>
                  <p className="font-medium text-neutral-800">
                    Pedido #{order.id} — {new Date(order.created_at).toLocaleDateString('es-AR')}
                  </p>
                  <p className="text-sm text-neutral-600 mt-1">{statusLabels[order.status] ?? order.status}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-medium text-primary-600">{formatMoney(order.total)}</span>
                  <ArrowRight size={18} className="text-neutral-400" />
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrdersPage;
