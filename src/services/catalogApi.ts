import { apiFetch } from './apiClient';
import { CatalogData, ProductDetailResponse, ProductSummary } from '../types';

export interface ProductPayload {
  name: string;
  description?: string;
  price: number;
  offer_price?: number | null;
  category_ids: number[];
  delivery_time_ids: number[];
  images: string[]; // data:image/...;base64,....
  attributes?: unknown[];
}

export interface ProductUpdatePayload {
  product: {
    id: number;
    name: string;
    description?: string | null;
    price: number;
    offer_price?: number | null;
    images?: { file: string }[];
  };
  categories: { id: number; selected: boolean }[];
  delivery_times: { id: number; selected: boolean }[];
}

export const catalogApi = {
  allProducts: () => apiFetch<ProductSummary[]>('/products/all-products', { auth: false }),

  catalogData: () => apiFetch<CatalogData>('/products/get-data-products', { auth: false }),

  product: (id: number | string) =>
    apiFetch<ProductDetailResponse>(`/products/product/${id}`, { auth: false }),

  create: (payload: ProductPayload) =>
    apiFetch<{ message: string; product: { id: number } }>('/products/post-products', {
      method: 'POST',
      body: payload,
    }),

  update: (id: number, payload: ProductUpdatePayload) =>
    apiFetch<{ message: string }>(`/products/product/${id}`, {
      method: 'POST',
      body: payload,
    }),

  remove: (id: number) =>
    apiFetch<{ message: string }>(`/products/product/${id}`, { method: 'DELETE' }),
};
