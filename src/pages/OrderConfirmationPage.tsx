import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle,
  Package,
  Truck,
  ArrowRight,
  CreditCard,
  Loader2,
  ExternalLink,
  X,
} from 'lucide-react';
import { ordersApi } from '../services/ordersApi';
import { ApiError } from '../services/apiClient';
import { Order, Shipment } from '../types';
import SelectedAttributesSummary from '../components/products/SelectedAttributesSummary';

const statusLabels: Record<string, string> = {
  pending_payment: 'Esperando confirmación del pago',
  paid: 'Pago acreditado — falta cargar el envío',
  shipped_by_customer: 'Pieza en camino al taller',
  received: 'Pieza recibida en el taller',
};

const CORREO_ARGENTINO_TRACKING_URL = 'https://www.correoargentino.com.ar/seguimiento-de-envios';

const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [payingWithMp, setPayingWithMp] = useState(false);
  const [mpError, setMpError] = useState<string | null>(null);

  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingError, setTrackingError] = useState<string | null>(null);
  const [submittingTracking, setSubmittingTracking] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    Promise.all([ordersApi.show(Number(orderId)), ordersApi.shipments(Number(orderId))])
      .then(([orderData, shipments]) => {
        setOrder(orderData);
        const toWorkshop = shipments.find((s) => s.direction === 'to_workshop') ?? null;
        setShipment(toWorkshop);
        // No se abre solo: recién acaba de pagar, todavía no tiene el
        // número de seguimiento (falta que despache la pieza). La tarjeta
        // de abajo ("Falta cargar el envío") queda como recordatorio
        // permanente y no bloqueante — el modal se abre solo si lo pide.
      })
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [orderId]);

  const handlePayWithMercadoPago = async () => {
    if (!orderId) return;
    setMpError(null);
    setPayingWithMp(true);
    try {
      const { init_point: initPoint } = await ordersApi.checkoutMercadoPago(Number(orderId));
      window.location.href = initPoint;
    } catch (err) {
      setMpError(err instanceof ApiError ? err.message : 'No se pudo iniciar el pago. Probá de nuevo.');
      setPayingWithMp(false);
    }
  };

  const handleSubmitTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;
    if (!trackingNumber.trim()) {
      setTrackingError('Ingresá el número de seguimiento que te dio Correo Argentino.');
      return;
    }
    setTrackingError(null);
    setSubmittingTracking(true);
    try {
      const newShipment = await ordersApi.addShipment(Number(orderId), trackingNumber.trim());
      setShipment(newShipment);
      setOrder((prev) => (prev ? { ...prev, status: 'shipped_by_customer' } : prev));
      setTrackingModalOpen(false);
    } catch (err) {
      setTrackingError(err instanceof ApiError ? err.message : 'No se pudo guardar el seguimiento. Probá de nuevo.');
    } finally {
      setSubmittingTracking(false);
    }
  };

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-primary-500" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-neutral-800 mb-4">
              ¡Pedido Confirmado!
            </h1>
            <p className="text-neutral-600">
              Tu pedido #{orderId} fue registrado correctamente.
            </p>
          </div>

          {loading && (
            <div className="text-center text-neutral-500 py-6">Cargando detalle del pedido...</div>
          )}

          {!loading && order && (
            <>
              <div className="border-t border-b border-neutral-200 py-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-lg mb-3 flex items-center text-neutral-800">
                      <Package size={18} className="mr-2 text-primary-500" />
                      Estado actual
                    </h3>
                    <p className="text-neutral-600">
                      {statusLabels[order.status] ?? order.status}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-lg mb-3 flex items-center text-neutral-800">
                      <Truck size={18} className="mr-2 text-primary-500" />
                      Total del pedido
                    </h3>
                    <p className="text-neutral-600">${Number(order.total).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="border-b border-neutral-200 pb-6 mb-6">
                <h3 className="font-medium text-lg mb-3 text-neutral-800">Detalle del pedido</h3>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                      <div>
                        <p className="font-medium text-neutral-800">
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
                            <span className="font-medium">Entrega:</span>{' '}
                            {item.delivery_time_snapshot.description}
                          </p>
                        )}
                      </div>
                      <span className="font-medium text-primary-600 shrink-0">
                        ${Number(item.subtotal).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {order.status === 'pending_payment' && (
                <div className="mb-8 bg-primary-50 border border-primary-100 rounded-md p-6 text-center">
                  <h3 className="font-medium text-lg mb-2 text-neutral-800">Falta pagar el total</h3>
                  <p className="text-sm text-neutral-600 mb-4">
                    Te redirigimos a Mercado Pago para completar el pago de forma segura.
                  </p>
                  <button
                    type="button"
                    onClick={handlePayWithMercadoPago}
                    disabled={payingWithMp}
                    className="inline-flex items-center px-6 py-3 bg-primary-500 text-white font-medium rounded-md hover:bg-primary-600 transition-colors disabled:opacity-60"
                  >
                    {payingWithMp ? (
                      <Loader2 size={18} className="mr-2 animate-spin" />
                    ) : (
                      <CreditCard size={18} className="mr-2" />
                    )}
                    {payingWithMp ? 'Redirigiendo...' : 'Pagar con Mercado Pago'}
                  </button>
                  {mpError && <p className="text-sm text-error-500 mt-3">{mpError}</p>}
                </div>
              )}

              {order.status === 'paid' && !shipment && (
                <div className="mb-8 bg-amber-50 border border-amber-200 rounded-md p-6 text-center">
                  <h3 className="font-medium text-lg mb-2 text-neutral-800">Falta cargar el envío</h3>
                  <p className="text-sm text-neutral-600 mb-4">
                    Cuando despaches tu pieza por Correo Argentino, volvé a esta pantalla (o a "Mis
                    pedidos") y cargá acá el número de seguimiento. No hace falta que sea ahora.
                  </p>
                  <button
                    type="button"
                    onClick={() => setTrackingModalOpen(true)}
                    className="inline-flex items-center px-6 py-3 bg-amber-500 text-white font-medium rounded-md hover:bg-amber-600 transition-colors"
                  >
                    Ya la despaché, cargar seguimiento
                  </button>
                </div>
              )}

              {shipment && (
                <div className="mb-8 bg-neutral-50 border border-neutral-200 rounded-md p-6">
                  <h3 className="font-medium text-lg mb-2 text-neutral-800">Envío a taller</h3>
                  <p className="text-sm text-neutral-600 mb-1">
                    Número de seguimiento: <span className="font-mono font-medium">{shipment.tracking_number}</span>
                  </p>
                  <a
                    href={CORREO_ARGENTINO_TRACKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium mt-2"
                  >
                    Ver estado en Correo Argentino <ExternalLink size={14} className="ml-1" />
                  </a>
                  <p className="text-xs text-neutral-400 mt-2">
                    Te lleva a la página de Correo Argentino — pegá ahí tu número de seguimiento.
                  </p>
                </div>
              )}

              {(order.status === 'shipped_by_customer' || order.status === 'received') && (
                <div className="mb-8">
                  <h3 className="font-medium text-lg mb-4 text-neutral-800">Próximos pasos</h3>
                  <div className="space-y-3 text-sm text-neutral-600">
                    <p>Te avisamos por mail cuando la pieza llegue al taller y a medida que avance el trabajo.</p>
                  </div>
                </div>
              )}
            </>
          )}

          {!loading && !order && (
            <p className="text-center text-neutral-500 mb-8">
              No pudimos cargar el detalle del pedido, pero quedó registrado correctamente.
            </p>
          )}

          <div className="text-center">
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/"
                className="px-6 py-3 bg-primary-500 text-white font-medium rounded-md hover:bg-primary-600 transition-colors flex items-center justify-center"
              >
                Volver al Inicio
              </Link>

              <a
                href="mailto:info@bobiaresa.com.ar"
                className="px-6 py-3 bg-white text-primary-600 border border-primary-500 font-medium rounded-md hover:bg-primary-50 transition-colors flex items-center justify-center"
              >
                Contactar Servicio al Cliente
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto mt-8 text-center">
          <h3 className="font-heading font-semibold text-xl mb-4 text-neutral-800">
            ¿Qué te gustaría hacer ahora?
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/productos"
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col items-center"
            >
              <span className="font-medium text-lg text-neutral-800 mb-2">
                Explorar Más Servicios
              </span>
              <ArrowRight size={20} className="text-primary-500" />
            </Link>

            <Link
              to="/productos?category=Motos"
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col items-center"
            >
              <span className="font-medium text-lg text-neutral-800 mb-2">
                Ver Servicios para Motos
              </span>
              <ArrowRight size={20} className="text-primary-500" />
            </Link>
          </div>
        </div>
      </div>

      {trackingModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setTrackingModalOpen(false)}
        >
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setTrackingModalOpen(false)}
              aria-label="Cerrar"
              className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-600"
            >
              <X size={20} />
            </button>
            <h2 className="font-heading text-xl font-bold text-neutral-800 mb-2 pr-6">
              Cargá el seguimiento de tu envío
            </h2>
            <p className="text-sm text-neutral-600 mb-4">
              Despachá tu pieza por Correo Argentino y pegá acá el número de seguimiento que te
              dieron — lo necesitamos para saber que ya la enviaste. Si todavía no la despachaste,
              cerrá esto tranquilo y volvé cuando la tengas.
            </p>
            <form onSubmit={handleSubmitTracking}>
              <label htmlFor="tracking_number" className="block text-sm font-medium text-neutral-700 mb-1">
                Número de seguimiento *
              </label>
              <input
                id="tracking_number"
                type="text"
                required
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Ej: CA123456789AR"
                className="w-full p-3 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500 mb-2"
                autoFocus
              />
              {trackingError && <p className="text-sm text-error-500 mb-2">{trackingError}</p>}
              <button
                type="submit"
                disabled={submittingTracking}
                className="w-full inline-flex items-center justify-center px-6 py-3 bg-primary-500 text-white font-medium rounded-md hover:bg-primary-600 transition-colors disabled:opacity-60 mt-2"
              >
                {submittingTracking && <Loader2 size={18} className="mr-2 animate-spin" />}
                {submittingTracking ? 'Guardando...' : 'Confirmar envío'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmationPage;
