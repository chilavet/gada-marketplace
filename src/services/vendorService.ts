import { apiClient } from '@/lib/apiClient';
import { withMockFallback } from '@/lib/mockAdapter';
import { Vendor, Product, ApiResponse } from '@/types/marketplace';

const mockVendor: Vendor = {
  id: 'vend_01',
  slug: 'tastia-restaurant-wuse',
  name: 'Tastia Restaurant & Bakery',
  description: 'Authentic African & continental dishes, freshly baked pastries, and chilled drinks prepared on demand.',
  logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200',
  bannerUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200',
  rating: 4.8,
  ratingCount: 142,
  phone: '08023456789',
  email: 'orders@tastia.example.com',
  isVerified: true,
  isActive: true,
  address: {
    id: 'addr_vend_1',
    street: 'Plot 1204 Ahmadu Bello Way, Wuse II',
    city: 'Abuja',
    state: 'FCT',
    country: 'Nigeria',
  },
  operatingHours: [
    { day: 'monday', openTime: '08:00', closeTime: '22:00', isOpen: true },
    { day: 'tuesday', openTime: '08:00', closeTime: '22:00', isOpen: true },
    { day: 'wednesday', openTime: '08:00', closeTime: '22:00', isOpen: true },
    { day: 'thursday', openTime: '08:00', closeTime: '22:00', isOpen: true },
    { day: 'friday', openTime: '08:00', closeTime: '23:00', isOpen: true },
    { day: 'saturday', openTime: '08:00', closeTime: '23:00', isOpen: true },
    { day: 'sunday', openTime: '09:00', closeTime: '22:00', isOpen: true },
  ],
};

const mockVendorProducts: Product[] = [
  {
    id: 'prod_201',
    slug: 'special-jollof-rice-chicken',
    vendorId: 'vend_01',
    title: 'Smoky Party Jollof Rice & Crispy Chicken',
    description: 'Slow-cooked wood-fired party jollof served with fried plantain, coleslaw, and quarter roasted chicken.',
    categories: [{ id: 'cat_rice', name: 'Rice Dishes', slug: 'rice-dishes' }],
    images: ['https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600'],
    basePrice: 5500,
    currency: 'NGN',
    inStock: true,
    inventoryCount: 50,
    hasVariants: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_202',
    slug: 'grilled-croaker-fish',
    vendorId: 'vend_01',
    title: 'Spiced Grilled Croaker Fish',
    description: 'Whole grilled croaker fish garnished with spicy bell pepper sauce and roasted potatoes.',
    categories: [{ id: 'cat_grill', name: 'Grills & Barbecue', slug: 'grills' }],
    images: ['https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600'],
    basePrice: 9500,
    currency: 'NGN',
    inStock: true,
    inventoryCount: 20,
    hasVariants: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_203',
    slug: 'fresh-fruit-parfait',
    vendorId: 'vend_01',
    title: 'Layers Greek Yogurt Parfait',
    description: 'Greek yogurt layered with crunchy granola, fresh strawberries, and pure honey.',
    categories: [{ id: 'cat_dessert', name: 'Desserts & Drinks', slug: 'desserts' }],
    images: ['https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600'],
    basePrice: 3800,
    currency: 'NGN',
    inStock: true,
    inventoryCount: 30,
    hasVariants: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const vendorService = {
  async getVendorBySlug(slug: string): Promise<ApiResponse<Vendor>> {
    return withMockFallback(async () => {
      const res = await apiClient.get<ApiResponse<Vendor>>(`/vendors/${slug}`);
      return res.data;
    }, { success: true, data: { ...mockVendor, slug } });
  },

  async getVendorProducts(vendorId: string): Promise<ApiResponse<Product[]>> {
    return withMockFallback(async () => {
      const res = await apiClient.get<ApiResponse<Product[]>>(`/vendors/${vendorId}/products`);
      return res.data;
    }, { success: true, data: mockVendorProducts });
  },
};
export default vendorService;
