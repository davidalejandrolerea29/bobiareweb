import { apiFetch } from './apiClient';
import { AuthSession, Order, OrderItem, SelectedAttributeSnapshot, ShippingAddress } from '../types';

export interface AddCartItemPayload {
  product_id: number;
  delivery_time_id: number;
  piece_description?: string;
  selected_attributes?: SelectedAttributeSnapshot[];
  quantity?: number;
}

export interface CheckoutPayload {
  shipping_address: ShippingAddress;
  notes?: string;
  // Solo obligatorios si el checkout se hace sin sesión (crea la cuenta):
  name?: string;
  email?: string;
  password?: string;
}

export type CheckoutResponse = Order & Partial<AuthSession>;

export const cartApi = {
  get: () => apiFetch<Order>('/cart', { guestCart: true }),

  addItem: (payload: AddCartItemPayload) =>
    apiFetch<OrderItem>('/cart/items', { method: 'POST', body: payload, guestCart: true }),

  updateItem: (orderItemId: number, quantity: number) =>
    apiFetch<OrderItem>(`/cart/items/${orderItemId}`, {
      method: 'PUT',
      body: { quantity },
      guestCart: true,
    }),

  removeItem: (orderItemId: number) =>
    apiFetch<{ message: string }>(`/cart/items/${orderItemId}`, {
      method: 'DELETE',
      guestCart: true,
    }),

  checkout: (payload: CheckoutPayload) =>
    apiFetch<CheckoutResponse>('/cart/checkout', { method: 'POST', body: payload, guestCart: true }),
};
