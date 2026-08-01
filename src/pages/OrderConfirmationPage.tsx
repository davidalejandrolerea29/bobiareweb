import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, ArrowRight, CreditCard, Loader2 } from 'lucide-react';
import { ordersApi } from '../services/ordersApi';
import { ApiError } from '../services/apiClient';
import { Order } from '../types';

const statusLabels: Record<string, string> = {
  pending_payment: 'Esperando confirmación del pago',
  paid: 'Pago acreditado — podés despachar la pieza',
  shipped_by_customer: 'Pieza en camino al taller',
  received: 'Pieza recibida en el taller',
};

const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [payingWithMp, setPayingWithMp] = useState(false);
  const [mpError, setMpError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;
    ordersApi
      .show(Number(orderId))
      .then(setOrder)
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

              {order.status === 'pending_payment' ? (
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
              ) : (
                <div className="mb-8">
                  <h3 className="font-medium text-lg mb-4 text-neutral-800">Próximos pasos</h3>
                  <div className="space-y-3 text-sm text-neutral-600">
                    <p>1. Con el pago acreditado, ya podés cargar el tracking de tu envío por Correo Argentino desde tu cuenta.</p>
                    <p>2. Te avisamos cuando la pieza llegue al taller y a medida que avance el trabajo.</p>
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
    </div>
  );
};

export default OrderConfirmationPage;
