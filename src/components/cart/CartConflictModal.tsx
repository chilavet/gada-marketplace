'use client';

import React from 'react';
import { useCartStore } from '@/store/useCartStore';
import { AlertTriangle, RefreshCw, X } from 'lucide-react';

export function CartConflictModal() {
  const { conflictModal, confirmReplaceCart, closeConflictModal } = useCartStore();

  if (!conflictModal.isOpen || !conflictModal.currentVendor || !conflictModal.incomingVendor) {
    return null;
  }

  const { currentVendor, incomingVendor, pendingItem } = conflictModal;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          maxWidth: '480px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          animation: 'fadeIn 0.2s ease-out',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
            padding: '20px 24px',
            borderBottom: '1px solid #FDE68A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#F59E0B',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#92400E' }}>
                Replace Cart Items?
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#B45309' }}>
                Single-store ordering constraint
              </p>
            </div>
          </div>

          <button
            onClick={closeConflictModal}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#92400E',
              padding: '4px',
              display: 'flex',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', spaceY: '16px' }}>
          <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: '#334155' }}>
            Your cart currently has items from{' '}
            <strong style={{ color: '#0F172A' }}>{currentVendor.vendorName}</strong>.
            Gada Marketplace delivers from one merchant per order to guarantee speed and courier assignment.
          </p>

          <div
            style={{
              margin: '16px 0',
              padding: '14px 16px',
              borderRadius: '12px',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
            }}
          >
            <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>
              Pending item from <strong>{incomingVendor.vendorName}</strong>:
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
              {pendingItem?.title} &bull; ₦{pendingItem?.unitPrice.toLocaleString()}
            </div>
          </div>

          <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
            Do you want to clear your current cart and start a new order with{' '}
            <strong>{incomingVendor.vendorName}</strong>?
          </p>

          {/* Action Buttons */}
          <div
            style={{
              marginTop: '24px',
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
            }}
          >
            <button
              type="button"
              onClick={closeConflictModal}
              style={{
                padding: '12px 18px',
                borderRadius: '12px',
                border: '1px solid #CBD5E1',
                background: '#FFFFFF',
                color: '#475569',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Keep Existing Cart
            </button>

            <button
              type="button"
              onClick={confirmReplaceCart}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                borderRadius: '12px',
                border: 'none',
                background: '#FF6B00',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(255, 107, 0, 0.3)',
              }}
            >
              <RefreshCw size={15} />
              <span>Start New Order</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartConflictModal;
