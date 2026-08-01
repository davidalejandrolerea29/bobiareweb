import { apiFetch } from './apiClient';
import { Order, Payment, Shipment } from '../types';

interface PaginatedOrders {
  data: Order[];
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

  // --- Staff (Administrador / Gerente General / Finanzas / Stock) ---

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

  receive: (id: number, note?: string) =>
    apiFetch<Order>(`/admin/orders/${id}/receive`, { method: 'POST', body: { note } }),
};
