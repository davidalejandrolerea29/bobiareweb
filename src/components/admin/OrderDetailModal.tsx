import React, { useEffect, useState } from 'react';
import { AlertCircle, LoaderCircle, X } from 'lucide-react';
import { ordersApi } from '../../services/ordersApi';
import { ApiError } from '../../services/apiClient';
import { Order, OrderStatus } from '../../types';
import SelectedAttributesSummary from '../products/SelectedAttributesSummary';

interface OrderDetailModalProps {
  orderId: number;
  onClose: () => void;
  onStatusChanged?: () => void;
}

type AdvanceStatus = 'received' | 'in_process' | 'ready_to_return' | 'shipped_to_customer';

// Qué botón mostrar según el estado actual — mismo orden que
// OrderController::NEXT_STATUS en el backend (avanza un paso a la vez).
const NEXT_ACTION: Partial<Record<OrderStatus, { target: AdvanceStatus; label: string }>> = {
  paid: { target: 'received', label: 'Marcar como recibido' },
  shipped_by_customer: { target: 'received', label: 'Marcar como recibido' },
  received: { target: 'in_process', label: 'Marcar en proceso' },
  in_process: { target: 'ready_to_return', label: 'Marcar listo para devolver' },
  ready_to_return: { target: 'shipped_to_customer', label: 'Despachar de vuelta' },
};

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
const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ orderId, onClose, onStatusChanged }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [advancing, setAdvancing] = useState(false);
  const [advanceError, setAdvanceError] = useState<string | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');

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

  const handleAdvance = async (target: AdvanceStatus) => {
    if (target === 'shipped_to_customer' && !trackingNumber.trim()) {
      setAdvanceError('Ingresá el número de seguimiento de vuelta.');
      return;
    }

    setAdvanceError(null);
    setAdvancing(true);
    try {
      const updated = await ordersApi.updateStatus(orderId, target, {
        trackingNumber: target === 'shipped_to_customer' ? trackingNumber.trim() : undefined,
      });
      setOrder(updated);
      onStatusChanged?.();
    } catch (err) {
      setAdvanceError(err instanceof ApiError ? err.message : 'No se pudo actualizar el estado.');
    } finally {
      setAdvancing(false);
    }
  };

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

              {NEXT_ACTION[order.status] && (
                <section className="rounded-md border border-primary-100 bg-primary-50 p-4">
                  <h3 className="text-xs font-semibold uppercase text-neutral-500 mb-2">Estado</h3>
                  {NEXT_ACTION[order.status]?.target === 'shipped_to_customer' ? (
                    <div className="space-y-2">
                      <label htmlFor="return_tracking" className="block text-sm text-neutral-700">
                        Número de seguimiento de vuelta
                      </label>
                      <input
                        id="return_tracking"
                        type="text"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="Ej: CA123456789AR"
                        className="w-full rounded-md border border-neutral-300 p-2 text-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                      <button
                        type="button"
                        disabled={advancing}
                        onClick={() => handleAdvance('shipped_to_customer')}
                        className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:cursor-wait disabled:opacity-60"
                      >
                        {advancing && <LoaderCircle size={16} className="animate-spin" />}
                        Despachar de vuelta
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={advancing}
                      onClick={() => handleAdvance(NEXT_ACTION[order.status]!.target)}
                      className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:cursor-wait disabled:opacity-60"
                    >
                      {advancing && <LoaderCircle size={16} className="animate-spin" />}
                      {NEXT_ACTION[order.status]?.label}
                    </button>
                  )}
                  {advanceError && <p className="mt-2 text-sm text-red-600">{advanceError}</p>}
                </section>
              )}

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
