'use client';

import React from 'react';
import { useCartStore } from '@/store/useCartStore';
import { EmptyCartView } from '@/components/cart/EmptyCartView';

export function CartSummary() {
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    getVendorGroups, 
    getSubtotal, 
    getTotalDeliveryFee, 
    getGrandTotal 
  } = useCartStore();

  const vendorGroups = getVendorGroups();

  if (items.length === 0) {
    return <EmptyCartView />;
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold">Your Order</h2>

      {/* Render Items Grouped by Vendor */}
      {vendorGroups.map((group) => (
        <div key={group.vendorId} className="border rounded-lg p-4 bg-white shadow-sm space-y-3">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-semibold text-gray-800">Store: {group.vendorName}</span>
            <span className="text-xs text-gray-500">
              Delivery: ₦{group.estimatedDeliveryFee?.toLocaleString()}
            </span>
          </div>

          {group.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-2 text-sm">
              <div>
                <p className="font-medium text-gray-900">{item.title}</p>
                {item.variantTitle && (
                  <p className="text-xs text-gray-500">{item.variantTitle}</p>
                )}
                <p className="text-gray-600">₦{item.unitPrice.toLocaleString()} each</p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="px-2 py-1 bg-gray-100 rounded"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="px-2 py-1 bg-gray-100 rounded"
                >
                  +
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 text-xs hover:underline ml-2"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="text-right text-xs text-gray-600 pt-1">
            Vendor Items Subtotal: <strong>₦{group.subtotal.toLocaleString()}</strong>
          </div>
        </div>
      ))}

      {/* Pricing Breakdown Summary */}
      <div className="border-t pt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span>₦{getSubtotal().toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Total Delivery (Across {vendorGroups.length} vendors)</span>
          <span>₦{getTotalDeliveryFee().toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-base font-bold border-t pt-2">
          <span>Total</span>
          <span>₦{getGrandTotal().toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
export default CartSummary;
