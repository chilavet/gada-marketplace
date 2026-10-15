/**
 * Centralized Storefront API Services
 * Provides typed methods for Auth, Catalog, Vendor Storefront, Multi-Vendor Cart,
 * Checkout & Payment Gateways, and Live Order Tracking.
 * Features realistic Mock Adapters when backend is running locally.
 */

import { apiClient } from './client';
import { POPULAR_ITEMS, VENDORS, CATEGORIES } from '../data/marketplaceData';
import { locationService } from '../services/locationService';
import { authService } from '../services/authService';

const IS_MOCK_MODE = !import.meta.env.VITE_API_URL;

// In-memory / localStorage orders store
const ORDERS_STORAGE_KEY = 'gada_storefront_orders';

const getStoredOrders = () => {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

const saveStoredOrders = (orders) => {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save orders:', e);
  }
};

// -------------------------------------------------------------
// 1. AUTHENTICATION API
// -------------------------------------------------------------
export const authApi = {
  async login({ email, phone, password }) {
    if (!IS_MOCK_MODE) {
      const res = await apiClient.post('/auth/login', { email, phone, password });
      if (res.token) apiClient.setToken(res.token);
      return res;
    }

    // Mock adapter
    await new Promise(r => setTimeout(r, 400));
    const users = authService.getAllUsers();
    const identifier = (email || phone || '').trim().toLowerCase();
    
    let user = users.find(u =>
      (u.email.toLowerCase() === identifier || u.phone.includes(identifier)) &&
      (!password || u.password === password)
    );

    if (!user && identifier) {
      // Auto-create or login demo user if not found for quick testing
      user = users[0];
    }

    if (!user) {
      throw new Error('Invalid credentials. Please check your email/phone and password.');
    }

    const mockToken = `mock-jwt-token-${user.id}-${Date.now()}`;
    apiClient.setToken(mockToken);
    authService.saveCurrentUser(user);

    return {
      success: true,
      user,
      token: mockToken
    };
  },

  async requestOtp({ phone, email }) {
    if (!IS_MOCK_MODE) {
      return apiClient.post('/auth/otp/send', { phone, email });
    }

    await new Promise(r => setTimeout(r, 350));
    const demoOtp = '123456';
    return {
      success: true,
      message: `OTP sent successfully to ${phone || email}! (For testing, enter: ${demoOtp})`,
      demoOtp
    };
  },

  async verifyOtp({ phone, email, otp }) {
    if (!IS_MOCK_MODE) {
      const res = await apiClient.post('/auth/otp/verify', { phone, email, otp });
      if (res.token) apiClient.setToken(res.token);
      return res;
    }

    await new Promise(r => setTimeout(r, 400));
    if (otp !== '123456' && otp !== '000000') {
      throw new Error('Invalid OTP code. Please enter the 6-digit code (use 123456 for testing).');
    }

    const users = authService.getAllUsers();
    let user = users.find(u => (email && u.email === email) || (phone && u.phone === phone)) || users[0];

    const mockToken = `mock-jwt-otp-${user.id}-${Date.now()}`;
    apiClient.setToken(mockToken);
    authService.saveCurrentUser(user);

    return {
      success: true,
      user,
      token: mockToken
    };
  },

  async register(payload) {
    if (!IS_MOCK_MODE) {
      const res = await apiClient.post('/auth/register', payload);
      if (res.token) apiClient.setToken(res.token);
      return res;
    }

    await new Promise(r => setTimeout(r, 450));
    const user = authService.register(payload);
    const mockToken = `mock-jwt-reg-${user.id}-${Date.now()}`;
    apiClient.setToken(mockToken);

    return {
      success: true,
      user,
      token: mockToken
    };
  },

  async getMe() {
    if (!IS_MOCK_MODE) {
      return apiClient.get('/auth/me');
    }
    return authService.getCurrentUser();
  },

  async updateProfile(updates) {
    if (!IS_MOCK_MODE) {
      return apiClient.put('/auth/profile', updates);
    }
    return authService.updateProfile(updates);
  },

  async logout() {
    apiClient.setToken(null);
    authService.logout();
    return { success: true };
  }
};

// -------------------------------------------------------------
// 2. CATALOG & SEARCH API
// -------------------------------------------------------------
export const catalogApi = {
  async getCategories() {
    if (!IS_MOCK_MODE) {
      return apiClient.get('/catalog/categories');
    }
    return CATEGORIES;
  },

  async getProducts(params = {}) {
    if (!IS_MOCK_MODE) {
      return apiClient.get('/catalog/products', params);
    }

    await new Promise(r => setTimeout(r, 250)); // simulate network latency
    const {
      query = '',
      category = 'all',
      minPrice = 0,
      maxPrice = 100000,
      minRating = 0,
      vendorSlug = '',
      inStockOnly = false,
      sortBy = 'closest',
      currentLocation = null,
      page = 1,
      limit = 12
    } = params;

    let items = locationService.enrichItemsWithLocation(POPULAR_ITEMS, currentLocation);

    // Filter by query (search keyword)
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      items = items.filter(it =>
        it.name.toLowerCase().includes(q) ||
        it.description.toLowerCase().includes(q) ||
        it.vendor.toLowerCase().includes(q) ||
        it.category.toLowerCase().includes(q)
      );
    }

    // Filter by Category
    if (category && category !== 'all') {
      items = items.filter(it => it.category === category);
    }

    // Filter by Price
    items = items.filter(it => it.price >= minPrice && it.price <= maxPrice);

    // Filter by Rating
    if (minRating > 0) {
      items = items.filter(it => (it.rating || 0) >= minRating);
    }

    // Filter by Vendor
    if (vendorSlug) {
      items = items.filter(it => it.vendorId === vendorSlug || it.vendorSlug === vendorSlug);
    }

    // Filter by Stock
    if (inStockOnly) {
      items = items.filter(it => it.inStock !== false);
    }

    // Sorting
    items.sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'fastest') {
        const timeA = parseInt(a.deliveryTime) || 30;
        const timeB = parseInt(b.deliveryTime) || 30;
        return timeA - timeB;
      }
      return (a.distance || 0) - (b.distance || 0);
    });

    const total = items.length;
    const startIndex = (page - 1) * limit;
    const paginatedItems = items.slice(startIndex, startIndex + limit);

    return {
      data: paginatedItems,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: startIndex + limit < total
    };
  },

  async getProductById(id, currentLocation = null) {
    if (!IS_MOCK_MODE) {
      return apiClient.get(`/catalog/products/${id}`);
    }

    await new Promise(r => setTimeout(r, 200));
    let item = POPULAR_ITEMS.find(it => it.id === id);
    if (!item) {
      // Look inside vendor menus
      for (const v of VENDORS) {
        const found = v.menu?.find(m => m.id === id);
        if (found) {
          item = { ...found, vendor: v.name, vendorId: v.id, locationName: v.locationName, lat: v.lat, lng: v.lng };
          break;
        }
      }
    }

    if (!item) {
      throw new Error(`Product with ID "${id}" was not found.`);
    }

    // Enrich with gallery images, variants and stock info
    const enriched = {
      ...item,
      inStock: item.inStock !== false,
      stockCount: item.stockCount || 24,
      sku: item.sku || `GADA-SKU-${item.id.toUpperCase()}`,
      images: item.images || [
        item.image,
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80'
      ],
      variants: item.variants || [
        { id: 'var-reg', name: 'Regular Portion', priceDiff: 0, inStock: true },
        { id: 'var-lrg', name: 'Large Portion (+30% Extra)', priceDiff: 800, inStock: true },
        { id: 'var-jmb', name: 'Jumbo Feast Pack', priceDiff: 1800, inStock: true }
      ],
      vendorDetails: VENDORS.find(v => v.name === item.vendor || v.id === item.vendorId) || null
    };

    if (currentLocation) {
      const distance = locationService.getDistanceKm(currentLocation.lat, currentLocation.lng, enriched.lat || 7.3872, enriched.lng || 3.8824);
      enriched.distance = distance;
      enriched.deliveryTime = locationService.estimateDeliveryTime(distance);
      enriched.deliveryFee = locationService.calculateDeliveryFee(distance);
    }

    return enriched;
  },

  async getRelatedProducts(productId, category) {
    if (!IS_MOCK_MODE) {
      return apiClient.get(`/catalog/products/${productId}/related`);
    }

    await new Promise(r => setTimeout(r, 150));
    return POPULAR_ITEMS
      .filter(it => it.id !== productId && (!category || it.category === category))
      .slice(0, 4);
  }
};

// -------------------------------------------------------------
// 3. VENDOR STOREFRONT API
// -------------------------------------------------------------
export const vendorApi = {
  async getVendors(params = {}) {
    if (!IS_MOCK_MODE) {
      return apiClient.get('/vendors', params);
    }

    const { category = 'All', currentLocation = null } = params;
    let list = locationService.enrichVendorsWithLocation(VENDORS, currentLocation);

    if (category && category !== 'All') {
      list = list.filter(v => v.category === category);
    }

    return list.sort((a, b) => (a.distance || 0) - (b.distance || 0));
  },

  async getVendorBySlug(slugOrId, currentLocation = null) {
    if (!IS_MOCK_MODE) {
      return apiClient.get(`/vendors/${slugOrId}`);
    }

    await new Promise(r => setTimeout(r, 200));
    const vendor = VENDORS.find(v => v.id === slugOrId || v.slug === slugOrId || v.name.toLowerCase().replace(/\s+/g, '-') === slugOrId.toLowerCase());

    if (!vendor) {
      throw new Error(`Vendor "${slugOrId}" not found.`);
    }

    const enriched = {
      ...vendor,
      slug: vendor.slug || vendor.id,
      bio: vendor.bio || `Specialist food and grocery merchant operating from ${vendor.locationName}. Offering hygienic packaging and swift dispatch with Gada logistics.`,
      operatingHours: vendor.operatingHours || '8:00 AM - 10:00 PM (Mon - Sun)',
      minimumOrder: vendor.minimumOrder || 1500,
      isOpen: true,
      isVerified: true
    };

    if (currentLocation) {
      const dist = locationService.getDistanceKm(currentLocation.lat, currentLocation.lng, vendor.lat, vendor.lng);
      enriched.distance = dist;
      enriched.deliveryFee = locationService.calculateDeliveryFee(dist);
      enriched.deliveryTime = locationService.estimateDeliveryTime(dist);
    }

    return enriched;
  }
};

// -------------------------------------------------------------
// 4. MULTI-VENDOR CART & CHECKOUT RATES API
// -------------------------------------------------------------
export const cartApi = {
  calculateMultiVendorGroups(cartItems) {
    const groupsMap = {};

    cartItems.forEach(item => {
      const vendorKey = item.vendor || 'Gada Central Store';
      if (!groupsMap[vendorKey]) {
        groupsMap[vendorKey] = {
          vendorName: vendorKey,
          vendorId: item.vendorId || 'v-default',
          locationName: item.locationName || 'Bodija Central Hub',
          items: [],
          subtotal: 0,
          vendorDeliveryFee: 600
        };
      }
      const itemPrice = item.calculatedPrice || item.price * item.quantity;
      groupsMap[vendorKey].items.push(item);
      groupsMap[vendorKey].subtotal += itemPrice;
    });

    return Object.values(groupsMap);
  },

  calculateCheckoutFees(cartItems, currentLocation) {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.calculatedPrice || item.price * item.quantity), 0);
    const vendorGroups = this.calculateMultiVendorGroups(cartItems);

    // Multi-vendor dispatch rate logic:
    // Base fee ₦600 for first vendor, +₦300 for each additional merchant hub
    const vendorCount = Math.max(1, vendorGroups.length);
    const multiVendorFee = 600 + (vendorCount - 1) * 350;

    const serviceFee = cartItems.length > 0 ? 200 : 0;
    const taxes = Math.round(subtotal * 0.015); // 1.5% marketplace processing

    return {
      subtotal,
      vendorGroups,
      vendorCount,
      deliveryFee: multiVendorFee,
      serviceFee,
      taxes,
      totalBeforeDiscount: subtotal + multiVendorFee + serviceFee + taxes
    };
  }
};

// -------------------------------------------------------------
// 5. CHECKOUT & PAYMENT GATEWAY INTEGRATION
// -------------------------------------------------------------
export const checkoutApi = {
  async initializePayment({ orderPayload, paymentMethod }) {
    if (!IS_MOCK_MODE) {
      return apiClient.post('/payments/initialize', { orderPayload, paymentMethod });
    }

    await new Promise(r => setTimeout(r, 600));

    const reference = `GADA-PAY-${Date.now()}-${Math.floor(Math.random() * 9000)}`;

    if (paymentMethod === 'card_flutterwave' || paymentMethod === 'flutterwave') {
      return {
        success: true,
        gateway: 'Flutterwave',
        reference,
        checkoutUrl: `https://checkout.flutterwave.com/v3/hosted/pay/${reference}`,
        message: 'Flutterwave payment gateway initialized.'
      };
    }

    return {
      success: true,
      gateway: paymentMethod,
      reference,
      message: 'Direct transaction processed.'
    };
  },

  async verifyPayment(reference) {
    if (!IS_MOCK_MODE) {
      return apiClient.get(`/payments/verify/${reference}`);
    }

    await new Promise(r => setTimeout(r, 500));
    return {
      success: true,
      status: 'success',
      reference,
      verifiedAt: new Date().toISOString(),
      message: 'Transaction successfully verified and authorized.'
    };
  }
};

// -------------------------------------------------------------
// 6. ORDER CREATION & LIVE DISPATCH TRACKING
// -------------------------------------------------------------
export const orderApi = {
  async createOrder(orderPayload) {
    if (!IS_MOCK_MODE) {
      return apiClient.post('/orders', orderPayload);
    }

    await new Promise(r => setTimeout(r, 500));

    const orderId = `GADA-${Math.floor(1000 + Math.random() * 9000)}`;
    const items = orderPayload.items || [];
    const vendorGroups = orderPayload.vendorGroups || [];
    const totalAmount = orderPayload.total || 0;
    const deliveryFee = orderPayload.deliveryFee || 600;

    // SubOrders for each vendor
    const subOrders = vendorGroups.map((g, idx) => ({
      id: `sub-${orderId}-${idx + 1}`,
      vendorId: g.vendorId || `v-${idx + 1}`,
      vendorName: g.vendorName,
      status: 'order_placed',
      items: g.items || [],
      subtotal: g.subtotal || 0,
      deliveryFee: g.vendorDeliveryFee || 600
    }));

    const assignedRider = {
      id: 'rider-01',
      name: 'Babatunde Ogunlesi',
      phone: '+234 812 893 4921',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      vehiclePlateNumber: 'IBD-492-OYO',
      vehicleType: 'motorcycle',
      rating: 4.9,
      currentLocation: {
        latitude: 7.3912,
        longitude: 3.8864
      }
    };

    const shippingAddress = typeof orderPayload.address === 'object' ? orderPayload.address : {
      id: `addr-${Date.now()}`,
      street: orderPayload.address || '14 Ring Road',
      city: 'Ibadan',
      state: 'Oyo State',
      country: 'Nigeria',
      landmark: orderPayload.deliveryNotes || '',
      isDefault: true
    };

    const newOrder = {
      id: orderId,
      orderNumber: orderId,
      userId: orderPayload.userId || 'user-demo-1',
      status: 'order_placed',
      subOrders,
      delivery: {
        shippingAddress,
        recipientName: orderPayload.customerName || 'Customer',
        recipientPhone: orderPayload.customerPhone || '+234 800 000 0000',
        deliveryInstructions: orderPayload.deliveryNotes || '',
        deliveryFee,
        estimatedTime: '20-25 mins'
      },
      rider: assignedRider,
      assignedRider,
      pricing: {
        subtotal: Math.max(0, totalAmount - deliveryFee - 200),
        totalDeliveryFee: deliveryFee,
        serviceFee: 200,
        discount: 0,
        grandTotal: totalAmount,
        currency: 'NGN'
      },
      payment: {
        transactionRef: orderPayload.paymentReference || `TXN-${orderId}`,
        method: orderPayload.paymentMethod || 'flutterwave',
        status: 'success',
        paidAt: new Date().toISOString()
      },
      items,
      vendorGroups,
      total: totalAmount,
      address: typeof orderPayload.address === 'string' ? orderPayload.address : (orderPayload.address?.street || 'Ibadan'),
      deliveryNotes: orderPayload.deliveryNotes || '',
      customerName: orderPayload.customerName || 'Customer',
      customerPhone: orderPayload.customerPhone || '+234 800 000 0000',
      storeName: orderPayload.storeName || vendorGroups[0]?.vendorName || 'Bodija Market Hub',
      storeLocation: orderPayload.storeLocation || 'Bodija Central Hub',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      etaMinutes: 22
    };

    const stored = getStoredOrders();
    saveStoredOrders([newOrder, ...stored]);

    // Also link to currentUser in authService
    authService.addOrder(newOrder);

    return newOrder;
  },

  async getOrderById(orderId) {
    if (!IS_MOCK_MODE) {
      return apiClient.get(`/orders/${orderId}`);
    }

    const stored = getStoredOrders();
    const found = stored.find(o => o.id === orderId);
    if (found) return found;

    // Check user profile orders
    const user = authService.getCurrentUser();
    const userOrder = user?.orders?.find(o => o.id === orderId);
    if (userOrder) return userOrder;

    return null;
  },

  async trackOrder(orderId) {
    if (!IS_MOCK_MODE) {
      return apiClient.get(`/orders/${orderId}/track`);
    }

    const order = await this.getOrderById(orderId);
    return order || {
      id: orderId,
      status: 'Order Placed',
      etaMinutes: 20
    };
  }
};

export { orderService } from '@/services/orderService';
export { vendorService } from '@/services/vendorService';

