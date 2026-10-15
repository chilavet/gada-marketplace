import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { cartApi } from '../api';

const CartContext = createContext(null);
const CART_STORAGE_KEY = 'gada_cart_items';
const PROMO_STORAGE_KEY = 'gada_cart_promo';

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedPromo, setAppliedPromo] = useState(() => {
    try {
      const saved = localStorage.getItem(PROMO_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to sync cart to storage:', e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      if (appliedPromo) {
        localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(appliedPromo));
      } else {
        localStorage.removeItem(PROMO_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to sync promo to storage:', e);
    }
  }, [appliedPromo]);

  const addToCart = (item) => {
    const qtyToAdd = item.quantity || 1;
    setCartItems(prev => {
      // Find matching item by ID AND variant if any
      const existingIdx = prev.findIndex(
        i => i.id === item.id && (i.selectedVariant?.id || 'base') === (item.selectedVariant?.id || 'base')
      );

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: next[existingIdx].quantity + qtyToAdd,
          calculatedPrice: item.calculatedPrice || next[existingIdx].calculatedPrice
        };
        return next;
      }

      return [...prev, { ...item, quantity: qtyToAdd }];
    });
  };

  const updateQuantity = (itemId, newQuantity, variantId = null) => {
    if (newQuantity <= 0) {
      removeItem(itemId, variantId);
      return;
    }

    setCartItems(prev =>
      prev.map(item => {
        const matchesVariant = variantId ? item.selectedVariant?.id === variantId : true;
        if (item.id === itemId && matchesVariant) {
          const unitPrice = item.calculatedPrice
            ? item.calculatedPrice / item.quantity
            : item.price;
          return {
            ...item,
            quantity: newQuantity,
            calculatedPrice: unitPrice * newQuantity
          };
        }
        return item;
      })
    );
  };

  const removeItem = (itemId, variantId = null) => {
    setCartItems(prev =>
      prev.filter(item => {
        if (item.id !== itemId) return true;
        if (variantId && item.selectedVariant?.id !== variantId) return true;
        return false;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedPromo(null);
  };

  const applyPromo = (code) => {
    const normalized = (code || '').trim().toUpperCase();
    if (normalized === 'GADA20') {
      const promo = { code: 'GADA20', discountPercent: 20, description: '20% Off Storewide' };
      setAppliedPromo(promo);
      return { success: true, message: '20% Gada Discount Applied! 🎉', promo };
    }
    if (normalized === 'FREEDEL') {
      const promo = { code: 'FREEDEL', freeDelivery: true, description: 'Free Delivery on Orders' };
      setAppliedPromo(promo);
      return { success: true, message: 'Free Dispatch Delivery Applied! 🛵', promo };
    }
    return { success: false, message: 'Invalid promo code. Try GADA20 or FREEDEL' };
  };

  const removePromo = () => {
    setAppliedPromo(null);
  };

  // Multi-vendor groups & financial summary calculations
  const vendorGroups = useMemo(() => {
    return cartApi.calculateMultiVendorGroups(cartItems);
  }, [cartItems]);

  const summary = useMemo(() => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + (item.calculatedPrice || item.price * item.quantity),
      0
    );

    // Multi-vendor delivery fee: ₦600 base + ₦350 for each additional vendor hub
    let deliveryFee = cartItems.length > 0 ? (600 + Math.max(0, vendorGroups.length - 1) * 350) : 0;
    const serviceFee = cartItems.length > 0 ? 200 : 0;

    let discountAmount = 0;
    if (appliedPromo) {
      if (appliedPromo.discountPercent) {
        discountAmount = Math.round((subtotal * appliedPromo.discountPercent) / 100);
      } else if (appliedPromo.freeDelivery) {
        discountAmount = deliveryFee;
        deliveryFee = 0;
      }
    }

    const total = Math.max(0, subtotal + deliveryFee + serviceFee - discountAmount);

    return {
      subtotal,
      deliveryFee,
      serviceFee,
      discountAmount,
      total,
      vendorCount: vendorGroups.length
    };
  }, [cartItems, vendorGroups, appliedPromo]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        vendorGroups,
        summary,
        appliedPromo,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        applyPromo,
        removePromo
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
