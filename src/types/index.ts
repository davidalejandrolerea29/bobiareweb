// Tipos alineados 1:1 con las respuestas reales de la API de Laravel
// (ver /backend_bobiare/mds/*.md para el contrato completo de cada endpoint).

export interface Role {
  id: number;
  name: 'Administrador' | 'Gerente General' | 'Finanzas' | 'Stock' | 'Cliente';
}

export interface User {
  id: number;
  name: string;
  email: string;
  rol_id: number;
  role?: Role;
}

export interface Category {
  id: number;
  description: string;
  selected?: boolean; // presente solo en la respuesta de GET /products/product/{id}
}

export interface DeliveryTime {
  id: number;
  description: string;
  business_days: number | null;
  extra_cost: string | number;
  selected?: boolean;
}

export interface AttributeSub {
  id: number;
  description: string;
  value?: string | null;
}

export interface Attribute {
  id: number;
  description: string;
  selected?: boolean;
  subs?: AttributeSub[];
}

export interface AttributeType {
  id: number;
  description?: string;
  name?: string; // GET /product/{id} usa "name" en vez de "description" para esto
  key?: string;
  attributes: Attribute[];
}

export interface ProductImage {
  id: number;
  url: string;
}

// Forma que devuelve GET /products/all-products (listado liviano)
export interface ProductSummary {
  id: number;
  name: string;
  price: string;
  offer_price: string | null;
  categories: string[];
}

// Forma que devuelve GET /products/product/{id}
export interface ProductDetail {
  id: number;
  name: string;
  description: string | null;
  price: string;
  offer_price: string | null;
  images: ProductImage[];
  attributes: {
    attribute_type_id: number;
    attribute_id: number;
    description: string;
    value: string | null;
    subs: AttributeSub[];
  }[];
}

export interface ProductDetailResponse {
  product: ProductDetail;
  categories: Category[];
  delivery_times: DeliveryTime[];
  attribute_types: AttributeType[];
}

export interface CatalogData {
  categories: Category[];
  delivery_times: DeliveryTime[];
  attribute_types: AttributeType[];
}

export interface ShippingAddress {
  recipient_name: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postal_code: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name_snapshot: string;
  unit_price_snapshot: string;
  piece_description: string | null;
  delivery_time_id: number;
  delivery_time_snapshot: {
    description: string;
    business_days: number | null;
    extra_cost: string | number;
  } | null;
  selected_attributes: unknown[];
  quantity: number;
  subtotal: string;
}

export type OrderStatus =
  | 'cart'
  | 'pending_payment'
  | 'deposit_paid'
  | 'shipped_by_customer'
  | 'received';

export interface Shipment {
  id: number;
  order_id: number;
  direction: 'to_workshop' | 'to_customer';
  carrier: string;
  tracking_number: string | null;
  status: string;
  shipped_at: string | null;
  delivered_at: string | null;
  cost: string | null;
}

export interface Payment {
  id: number;
  order_id: number;
  type: 'deposit' | 'balance' | 'refund';
  provider: string;
  status: string;
  amount: string;
  method: string | null;
  paid_at: string | null;
}

export interface OrderStatusHistoryEntry {
  id: number;
  order_id: number;
  status: OrderStatus;
  note: string | null;
  changed_by_user_id: number | null;
  created_at: string;
}

export interface Order {
  id: number;
  user_id: number | null;
  guest_token: string | null;
  status: OrderStatus;
  currency: string;
  items_subtotal: string;
  return_shipping_cost: string | null;
  total: string;
  shipping_address: ShippingAddress | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  shipments?: Shipment[];
  payments?: Payment[];
  status_histories?: OrderStatusHistoryEntry[];
  user?: { id: number; name: string; email: string };
}

export interface AuthSession {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface PieceAnalysis {
  piece_name: string;
  confidence: number; // 0-1
  description: string;
  detected_damage: string[];
  suggested_service: string;
  suggested_product_id: number | null;
  disclaimer: string;
}

export interface PieceAnalysisResponse {
  analysis: PieceAnalysis;
}
