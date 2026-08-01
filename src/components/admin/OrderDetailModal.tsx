import React, { useEffect, useState } from 'react';
import { AlertCircle, LoaderCircle, X } from 'lucide-react';
import { ordersApi } from '../../services/ordersApi';
import { ApiError } from '../../services/apiClient';
import { Order } from '../../types';
import SelectedAttributesSummary from '../products/SelectedAttributesSummary';

interface OrderDetailModalProps {
  orderId: number;
  onClose: () => void;
}

const formatMoney = (value: string | number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(Number(value));

const formatDateTime = (value: string) => new Date(value).toLocaleString('es-AR');

// Todo lo que el cliente eligió al armar el pedido — items (con color y
// demás atributos), dirección, pagos y envíos — en un solo lugar para que
// el admin no tenga que adivinar nada al preparar el trabajo.
const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ orderId, onClose }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch al cambiar de pedido, sin loop
    setLoading(true);
    setError(null);
    ordersApi
      .adminShow(orderId)
      .then(setOrder)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'No se pudo cargar el pedido.'))
      .finally(() => setLoading(false));
  }, [orderId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <h2 className="font-heading text-lg font-bold text-neutral-900">Pedido #{orderId}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="grid h-8 w-8 place-items-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          {loading && (
            <div className="flex items-center justify-center gap-2 py-14 text-neutral-500">
              <LoaderCircle size={20} className="animate-spin" /> Cargando pedido...
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={18} className="shrink-0" />
              {error}
            </div>
          )}

          {!loading && order && (
            <div className="space-y-6">
              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="text-xs font-semibold uppercase text-neutral-500">Cliente</h3>
                  <p className="mt-1 text-sm font-medium text-neutral-800">
                    {order.user?.name ?? 'Cliente invitado'}
                  </p>
                  <p className="text-sm text-neutral-500">{order.user?.email ?? 'Sin email'}</p>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase text-neutral-500">Fecha</h3>
                  <p className="mt-1 text-sm text-neutral-800">{formatDateTime(order.created_at)}</p>
                </div>
              </section>

              {order.shipping_address && (
                <section>
                  <h3 className="text-xs font-semibold uppercase text-neutral-500">Dirección de envío</h3>
                  <p className="mt-1 text-sm text-neutral-800">
                    {order.shipping_address.recipient_name} — {order.shipping_address.phone}
                  </p>
                  <p className="text-sm text-neutral-600">
                    {order.shipping_address.street}, {order.shipping_address.city},{' '}
                    {order.shipping_address.province} (CP {order.shipping_address.postal_code})
                  </p>
                </section>
              )}

              {order.notes && (
                <section>
                  <h3 className="text-xs font-semibold uppercase text-neutral-500">Notas del cliente</h3>
                  <p className="mt-1 text-sm text-neutral-600">{order.notes}</p>
                </section>
              )}

              <section>
                <h3 className="text-xs font-semibold uppercase text-neutral-500">Items del pedido</h3>
                <div className="mt-2 divide-y divide-neutral-100 rounded-md border border-neutral-200">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex flex-col gap-1 p-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-medium text-neutral-800">
                          {item.quantity}x {item.product_name_snapshot}
                        </p>
                        <SelectedAttributesSummary attributes={item.selected_attributes} />
                        {item.piece_description && (
                          <p className="text-sm text-neutral-600">
                            <span className="font-medium">Pieza:</span> {item.piece_description}
                          </p>
                        )}
                        {item.delivery_time_snapshot && (
                          <p className="text-sm text-neutral-600">
                            <span className="font-medium">Entrega:</span> {item.delivery_time_snapshot.description}
                          </p>
                        )}
                      </div>
                      <span className="shrink-0 text-sm font-semibold text-primary-600">
                        {formatMoney(item.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex justify-end text-sm font-bold text-neutral-900">
                  Total: {formatMoney(order.total)}
                </div>
              </section>

              {order.shipments && order.shipments.length > 0 && (
                <section>
                  <h3 className="text-xs font-semibold uppercase text-neutral-500">Envíos</h3>
                  <div className="mt-2 space-y-2">
                    {order.shipments.map((shipment) => (
                      <div key={shipment.id} className="rounded-md border border-neutral-200 p-3 text-sm">
                        <p className="font-medium text-neutral-800">
                          {shipment.direction === 'to_workshop' ? 'Cliente → Taller' : 'Taller → Cliente'}
                        </p>
                        <p className="text-neutral-600">
                          {shipment.carrier} — {shipment.tracking_number ?? 'Sin número de seguimiento'} —{' '}
                          {shipment.status}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {order.payments && order.payments.length > 0 && (
                <section>
                  <h3 className="text-xs font-semibold uppercase text-neutral-500">Pagos</h3>
                  <div className="mt-2 space-y-2">
                    {order.payments.map((payment) => (
                      <div key={payment.id} className="rounded-md border border-neutral-200 p-3 text-sm">
                        <p className="font-medium text-neutral-800">
                          {formatMoney(payment.amount)} — {payment.status}
                        </p>
                        <p className="text-neutral-600">
                          {payment.provider} {payment.method ? `— ${payment.method}` : ''}
                          {payment.paid_at ? ` — ${formatDateTime(payment.paid_at)}` : ''}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
