import { API_BASE_URL, apiFetch, ApiError, tokenStorage } from './apiClient';
import { AfipInvoice, Order, Payment, Shipment } from '../types';

interface PaginatedOrders {
  data: Order[];
  current_page: number;
  last_page: number;
  total: number;
}

interface PaginatedAfipInvoices {
  data: AfipInvoice[];
  current_page: number;
  last_page: number;
  total: number;
}

export const ordersApi = {
  mine: () => apiFetch<Order[]>('/orders'),

  show: (id: number) => apiFetch<Order>(`/orders/${id}`),

  shipments: (id: number) => apiFetch<Shipment[]>(`/orders/${id}/shipments`),

  addShipment: (id: number, trackingNumber: string, carrier = 'correo_argentino') =>
    apiFetch<Shipment>(`/orders/${id}/shipments`, {
      method: 'POST',
      body: { tracking_number: trackingNumber, carrier },
    }),

  payments: (id: number) => apiFetch<Payment[]>(`/orders/${id}/payments`),

  // Mercado Pago (Checkout Pro): crea la preferencia y devuelve el link al
  // que hay que redirigir al cliente para que pague el total del pedido.
  checkoutMercadoPago: (id: number) =>
    apiFetch<{ init_point: string; preference_id: string }>(`/orders/${id}/checkout-mercadopago`, {
      method: 'POST',
    }),

  // PDF de la factura AFIP ya autorizada del pedido. apiFetch no sirve acá
  // porque siempre parsea la respuesta como JSON — se hace un fetch aparte
  // que devuelve el binario como Blob para descargarlo del lado del cliente.
  downloadInvoicePdf: async (id: number): Promise<Blob> => {
    const token = tokenStorage.get();
    const response = await fetch(`${API_BASE_URL}/orders/${id}/invoice-pdf`, {
      headers: {
        Accept: 'application/pdf',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      throw new ApiError(payload?.error ?? `Error ${response.status}`, response.status);
    }

    return response.blob();
  },

  // --- Staff (Administrador / Gerente General / Finanzas / Stock) ---

  adminAfipInvoices: (status?: string, page = 1) =>
    apiFetch<PaginatedAfipInvoices>(
      `/admin/afip-invoices?${new URLSearchParams({ ...(status ? { status } : {}), page: String(page) })}`
    ),

  retryAfipInvoice: (orderId: number) =>
    apiFetch<{ status: string }>(`/admin/afip-invoices/${orderId}/retry`, { method: 'POST' }),

  addPayment: (orderId: number, type: 'payment' | 'refund', amount: number, method?: string) =>
    apiFetch<Payment>(`/orders/${orderId}/payments`, {
      method: 'POST',
      body: { type, amount, method },
    }),

  adminList: (status?: string, page = 1) =>
    apiFetch<PaginatedOrders>(
      `/admin/orders?${new URLSearchParams({ ...(status ? { status } : {}), page: String(page) })}`
    ),

  adminShow: (id: number) => apiFetch<Order>(`/admin/orders/${id}`),

  // Avanza el pedido un paso (recibido -> procesando -> listo -> despachado).
  // tracking_number/carrier solo hacen falta para el paso a "shipped_to_customer".
  updateStatus: (
    id: number,
    status: 'received' | 'in_process' | 'ready_to_return' | 'shipped_to_customer',
    options?: { note?: string; trackingNumber?: string; carrier?: string }
  ) =>
    apiFetch<Order>(`/admin/orders/${id}/status`, {
      method: 'POST',
      body: {
        status,
        note: options?.note,
        tracking_number: options?.trackingNumber,
        carrier: options?.carrier,
      },
    }),
};
