import { apiFetch } from './apiClient';
import { CatalogData, ProductDetailResponse, ProductSummary } from '../types';

// Un atributo a asociar a un producto al crear/editar. Si attribute_id está
// presente, el backend reutiliza ese atributo existente (ej. un color ya
// cargado en la paleta); si no, lo crea nuevo con description/hex_value.
export interface ProductAttributePayload {
  attribute_type_id: number;
  attribute_id?: number;
  description: string;
  value?: string | null;
  hex_value?: string | null;
}

export interface ProductPayload {
  name: string;
  description?: string;
  price: number;
  offer_price?: number | null;
  category_ids: number[];
  delivery_time_ids: number[];
  images: string[]; // data:image/...;base64,....
  attributes?: ProductAttributePayload[];
}

export interface ProductUpdatePayload {
  product: {
    id: number;
    name: string;
    description?: string | null;
    price: number;
    offer_price?: number | null;
    images?: { file: string }[];
    attributes?: ProductAttributePayload[];
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
