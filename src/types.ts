export interface Product {
  productId: string;
  name: string;
  category: string;
  section: 'best-seller' | 'new-arrival' | 'carousel' | 'deal' | 'accessory';
  price: number; // in KES (Kenyan Shillings) or equivalent
  description: string;
  specifications: string; // "Bulb Type: HB3 | Power: 40W | Lumens: 8000LM | ..."
  imageUrl: string;
  images: string[];
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  county: string;
  postalCode: string;
}

export interface Order {
  orderId: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'mpesa' | 'card' | 'cod';
  deliveryMethod: 'standard' | 'express' | 'pickup';
  shippingInfo: ShippingInfo;
  orderNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleBulbData {
  vehicleKey: string; // "Make#Model"
  make: string;
  model: string;
  headlightLow: string;
  headlightHigh: string;
  fogLight: string;
  turnSignalFront: string;
  turnSignalRear: string;
  parkingLight: string;
  tailLight: string;
  brakeLight: string;
  reverseLight: string;
  licensePlate: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  addedAt: string;
}

export interface Address {
  userId: string;
  addressId: string;
  fullName: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  county: string;
  postalCode: string;
  isDefault: boolean;
  createdAt: string;
}

export interface User {
  email: string;
  name: string;
  phone?: string;
  role: 'user' | 'admin';
  verified: boolean;
}
