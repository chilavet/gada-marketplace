// types/marketplace.ts

/* ==========================================================================
   Common & Generic Types
   ========================================================================== */

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode?: string;
  country: string;
  latitude?: number;
  longitude?: number;
  landmark?: string;
  isDefault?: boolean;
}

/* ==========================================================================
   User & Authentication
   ========================================================================== */

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  savedAddresses: Address[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

/* ==========================================================================
   Vendor / Merchant
   ========================================================================== */

export interface VendorOperatingHours {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  openTime: string;  // e.g., "08:00"
  closeTime: string; // e.g., "21:00"
  isOpen: boolean;
}

export interface Vendor {
  id: string;
  slug: string;
  name: string;
  description?: string;
  logoUrl: string;
  bannerUrl?: string;
  rating: number;
  ratingCount: number;
  phone?: string;
  email?: string;
  address: Address;
  operatingHours?: VendorOperatingHours[];
  isVerified: boolean;
  isActive: boolean;
}

/* ==========================================================================
   Product & Inventory
   ========================================================================== */

export interface ProductVariant {
  id: string;
  sku: string;
  title: string;          // e.g., "Large / Red"
  price: number;
  compareAtPrice?: number;
  inventoryQuantity: number;
  options: Record<string, string>; // e.g., { size: 'L', color: 'Red' }
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  parentId?: string | null;
}

export interface Product {
  id: string;
  slug: string;
  vendorId: string;
  vendor?: Pick<Vendor, 'id' | 'name' | 'slug' | 'logoUrl' | 'rating'>;
  title: string;
  description: string;
  categories: ProductCategory[];
  images: string[];
  basePrice: number;
  compareAtPrice?: number;
  currency: string;
  inStock: boolean;
  inventoryCount: number;
  hasVariants: boolean;
  variants?: ProductVariant[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

/* ==========================================================================
   Cart & Line Items
   ========================================================================== */

export interface CartItem {
  id: string;                 // unique cart line ID
  productId: string;
  variantId?: string;
  vendorId: string;
  title: string;
  variantTitle?: string;
  unitPrice: number;
  quantity: number;
  image: string;
  subtotal: number;
}

export interface VendorCartGroup {
  vendorId: string;
  vendorName: string;
  items: CartItem[];
  subtotal: number;
  estimatedDeliveryFee?: number;
}

export interface Cart {
  items: CartItem[];
  vendorGroups: VendorCartGroup[];
  totalItemCount: number;
  subtotal: number;
  estimatedTotalDeliveryFee: number;
  grandTotal: number;
}

/* ==========================================================================
   Checkout & Orders
   ========================================================================== */

export type OrderStatus =
  | 'pending_payment'
  | 'order_placed'
  | 'vendor_accepted'
  | 'preparing'
  | 'ready_for_pickup'
  | 'rider_assigned'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'flutterwave' | 'card' | 'bank_transfer' | 'wallet';

export interface FlutterwaveSubaccount {
  id: string;
  transaction_charge_type?: 'flat_subaccount' | 'percentage_subaccount' | string;
  transaction_charge?: number;
  transaction_percentage?: number;
}

export interface DeliveryZone {
  id: string;
  name: string;
  city: 'Lagos' | 'Abuja';
  baseFee: number; // in NGN
  estimatedMinutes: string;
}

export interface VendorZoneCoverage {
  vendorId: string;
  city: 'Lagos' | 'Abuja';
  supportedZoneIds: string[]; // List of zone IDs the merchant's riders service
}

export interface DeliveryDetails {
  shippingAddress: Address;
  recipientName: string;
  recipientPhone: string;
  deliveryInstructions?: string;
  deliveryFee: number;
  estimatedTime?: string;
}

export interface AssignedRider {
  id: string;
  name: string;
  phone: string;
  photoUrl?: string;
  vehiclePlateNumber?: string;
  vehicleType?: 'motorcycle' | 'bicycle' | 'van';
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
}

export interface SubOrder {
  id: string;
  vendorId: string;
  vendorName: string;
  status: OrderStatus;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  subOrders: SubOrder[];
  delivery: DeliveryDetails;
  rider?: AssignedRider;
  pricing: {
    subtotal: number;
    totalDeliveryFee: number;
    serviceFee: number;
    discount: number;
    grandTotal: number;
    currency: string;
  };
  payment: {
    transactionRef: string;
    method: PaymentMethod;
    status: 'pending' | 'success' | 'failed';
    paidAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

/* ==========================================================================
   API Request Payloads
   ========================================================================== */

export interface CreateOrderPayload {
  vendorId?: string; // Exactly 1 vendor for single-store delivery
  shippingAddressId: string;
  recipientName: string;
  recipientPhone: string;
  deliveryNotes?: string;
  deliveryZoneFee?: number; // Gadaride zone rate
  paymentMethod: PaymentMethod;
  items: {
    productId: string;
    variantId?: string;
    quantity: number;
  }[];
}

export interface InitializePaymentResponse {
  authorizationUrl: string;
  accessCode?: string;
  reference: string;
}

export interface ProductFilterParams {
  category?: string;
  vendorId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price_asc' | 'price_desc' | 'latest' | 'rating';
  page?: number;
  limit?: number;
}
