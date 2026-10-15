'use client';

import React from 'react';
import { useCartStore } from '@/store/useCartStore';

export function VendorConflictModal() {
  const { conflictModal, confirmReplaceCart, closeConflictModal } = useCartStore();

  if (!conflictModal.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
        <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-xl font-bold mb-4">
          !
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Start a new order?
        </h3>

        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          Your basket already contains items from{' '}
          <strong className="text-gray-900">
            {conflictModal.currentVendor?.vendorName}
          </strong>
          . You can only order from one vendor at a time so your Gadaride rider delivers directly without delays.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={closeConflictModal}
            className="flex-1 py-2.5 px-4 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition"
          >
            Keep Current Basket
          </button>
          <button
            type="button"
            onClick={confirmReplaceCart}
            className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold shadow transition"
          >
            Start New Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default VendorConflictModal;
