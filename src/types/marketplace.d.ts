/**
 * Type Definitions & Contracts for Gada Marketplace Web Storefront
 * Aligned with mobile app REST / GraphQL API schemas
 */

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  token?: string;
  walletBalance: number;
  addresses: Address[];
  createdAt?: string;
}

export interface Address {
  id: string;
  label: string; // 'Home' | 'Office' | 'Other'
  address: string;
  landmark?: string;
  deliveryNotes?: string;
  isDefault: boolean;
  lat?: number;
  lng?: number;
}

export interface Vendor {
  id: string;
  slug: string;
  name: string;
  category: string;
  rating: number;
  reviewsCount?: number;
  deliveryTime: string;
  deliveryFee: number;
  minimumOrder: number;
  address: string;
  locationName: string;
  distance?: number;
  banner: string;
  logo: string;
  bio?: string;
  operatingHours: string;
  isOpen: boolean;
  isVerified: boolean;
  lat: number;
  lng: number;
  tags?: string[];
  menu?: Product[];
}

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Regular", "Large", "Jumbo"
  priceDiff: number; // additional cost over base price
  inStock: boolean;
}

export interface ProductAddon {
  id?: string;
  name: string;
  price: number;
  maxQuantity?: number;
}

export interface Product {
  id: string;
  name: string;
  slug?: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  images?: string[];
  vendor: string;
  vendorId?: string;
  vendorSlug?: string;
  locationName: string;
  rating: number;
  reviewsCount?: number;
  deliveryTime: string;
  inStock: boolean;
  stockCount?: number;
  variants?: ProductVariant[];
  addons?: ProductAddon[];
  distance?: number;
  deliveryFee?: number;
  lat?: number;
  lng?: number;
  sku?: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariant?: ProductVariant;
  selectedAddons?: ProductAddon[];
  specialInstructions?: string;
  calculatedPrice: number;
}

export interface VendorCartGroup {
  vendorId: string;
  vendorName: string;
  vendorSlug?: string;
  items: CartItem[];
  subtotal: number;
  vendorDeliveryFee: number;
}

export type OrderStatus =
  | 'Order Placed'
  | 'Vendor Preparing'
  | 'Rider Assigned'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface AssignedRider {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  vehicleType: string;
  plateNumber: string;
  rating: number;
  currentLat?: number;
  currentLng?: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  vendorGroups?: VendorCartGroup[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  riderTip?: number;
  discountAmount?: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'wallet' | 'card_flutterwave' | 'flutterwave';
  paymentReference?: string;
  deliveryAddress: Address | string;
  deliveryNotes?: string;
  etaMinutes: number;
  createdAt: string;
  updatedAt?: string;
  assignedRider?: AssignedRider;
  vendorName: string;
  vendorLocation: string;
}

export interface SearchFilterParams {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  vendorSlug?: string;
  locationId?: string;
  inStockOnly?: boolean;
  sortBy?: 'closest' | 'rating' | 'price_asc' | 'price_desc' | 'fastest';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}
