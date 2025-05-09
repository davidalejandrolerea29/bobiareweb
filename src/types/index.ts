export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  colorId: string;
  timeEstimate: string;
  price: number;
  imageFile?: File | null;
}


export interface ColorOption {
  id: string;
  name: string;
  colorCode: string;
  price: number;
}

export interface DeliveryOption {
  id:number;
  days: number;
  price: number;
  description: string;
}


export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  model?: string;
  color?: ColorOption;
  deliveryOption: DeliveryOption;
  pickupLocation: string;
  notes?: string;
  totalPrice: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  status: 'pending' | 'processing' | 'shipping' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  deliveryDate: string;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  shippingAddress: Address;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}