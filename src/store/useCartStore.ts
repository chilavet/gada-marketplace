import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, VendorCartGroup, VendorOperatingHours } from '@/types/marketplace';

export interface VendorInfo {
  vendorId: string;
  vendorName: string;
  vendorSlug?: string;
  city?: 'Lagos' | 'Abuja';
  operatingHours?: VendorOperatingHours[];
  supportedZoneIds?: string[];
}

export interface CartConflict {
  isOpen: boolean;
  currentVendor: VendorInfo | null;
  incomingVendor: VendorInfo | null;
  pendingItem: Omit<CartItem, 'id' | 'subtotal'> | null;
}

export interface SingleVendorCartState {
  items: CartItem[];
  activeVendor: VendorInfo | null;
  deliveryZoneFee: number; // Set based on GadaTech zoning logic
  conflictModal: CartConflict;

  // Computed Getters
  getItemCount: () => number;
  getSubtotal: () => number;
  getTotalDeliveryFee: () => number;
  getGrandTotal: () => number;
  getVendorGroups: () => VendorCartGroup[];

  // Actions
  addItem: (
    item: Omit<CartItem, 'id' | 'subtotal'>,
    vendor?: VendorInfo
  ) => { conflict: boolean };
  confirmReplaceCart: () => void;
  closeConflictModal: () => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  setDeliveryZoneFee: (fee: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<SingleVendorCartState>()(
  persist(
    (set, get) => ({
      items: [],
      activeVendor: null,
      deliveryZoneFee: 1500, // Default zoning rate
      conflictModal: {
        isOpen: false,
        currentVendor: null,
        incomingVendor: null,
        pendingItem: null,
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.subtotal, 0);
      },

      getTotalDeliveryFee: () => {
        return get().items.length > 0 ? get().deliveryZoneFee : 0;
      },

      getGrandTotal: () => {
        return get().getSubtotal() + (get().items.length > 0 ? get().deliveryZoneFee : 0);
      },

      getVendorGroups: () => {
        const { items, activeVendor, deliveryZoneFee } = get();
        if (items.length === 0 || !activeVendor) return [];
        return [
          {
            vendorId: activeVendor.vendorId,
            vendorName: activeVendor.vendorName,
            items,
            subtotal: get().getSubtotal(),
            estimatedDeliveryFee: deliveryZoneFee,
          },
        ];
      },

      // Add item with single-vendor interceptor
      addItem: (newItem, vendorArg) => {
        const { activeVendor, items } = get();

        const vendor: VendorInfo = vendorArg || {
          vendorId: newItem.vendorId,
          vendorName: newItem.title.includes(' - ')
            ? newItem.title.split(' - ')[0]
            : 'Vendor Store',
        };

        // 1. Conflict Check: Existing items belong to a different vendor
        if (activeVendor && items.length > 0 && activeVendor.vendorId !== vendor.vendorId) {
          set({
            conflictModal: {
              isOpen: true,
              currentVendor: activeVendor,
              incomingVendor: vendor,
              pendingItem: newItem,
            },
          });
          return { conflict: true };
        }

        // 2. Normal Add / Update within the same vendor
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) =>
              i.productId === newItem.productId &&
              i.variantId === newItem.variantId
          );

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            const currentItem = updatedItems[existingIndex];
            const updatedQty = currentItem.quantity + newItem.quantity;

            updatedItems[existingIndex] = {
              ...currentItem,
              quantity: updatedQty,
              subtotal: updatedQty * currentItem.unitPrice,
            };

            return { items: updatedItems, activeVendor: vendor };
          }

          const uniqueId = `${newItem.productId}_${newItem.variantId || 'base'}_${Date.now()}`;
          const lineItem: CartItem = {
            ...newItem,
            id: uniqueId,
            subtotal: newItem.unitPrice * newItem.quantity,
          };

          return {
            items: [...state.items, lineItem],
            activeVendor: vendor,
          };
        });

        return { conflict: false };
      },

      // User confirmed they want to clear old vendor items and start fresh
      confirmReplaceCart: () => {
        const { conflictModal } = get();
        const { incomingVendor, pendingItem } = conflictModal;

        if (incomingVendor && pendingItem) {
          const uniqueId = `${pendingItem.productId}_${pendingItem.variantId || 'base'}_${Date.now()}`;
          const lineItem: CartItem = {
            ...pendingItem,
            id: uniqueId,
            subtotal: pendingItem.unitPrice * pendingItem.quantity,
          };

          set({
            items: [lineItem],
            activeVendor: incomingVendor,
            conflictModal: {
              isOpen: false,
              currentVendor: null,
              incomingVendor: null,
              pendingItem: null,
            },
          });
        }
      },

      closeConflictModal: () => {
        set({
          conflictModal: {
            isOpen: false,
            currentVendor: null,
            incomingVendor: null,
            pendingItem: null,
          },
        });
      },

      removeItem: (itemId: string) => {
        set((state) => {
          const updated = state.items.filter((item) => item.id !== itemId);
          return {
            items: updated,
            activeVendor: updated.length === 0 ? null : state.activeVendor,
          };
        });
      },

      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  quantity,
                  subtotal: quantity * item.unitPrice,
                }
              : item
          ),
        }));
      },

      setDeliveryZoneFee: (fee: number) => set({ deliveryZoneFee: fee }),

      clearCart: () => set({ items: [], activeVendor: null }),
    }),
    {
      name: 'gadatech_single_vendor_cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        activeVendor: state.activeVendor,
        deliveryZoneFee: state.deliveryZoneFee,
      }),
    }
  )
);

export default useCartStore;
