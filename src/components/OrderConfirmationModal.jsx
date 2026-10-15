import React from 'react';
import {
  CheckCircle2, X, Download, Printer, ArrowRight, ShieldCheck,
  MapPin, Clock, CreditCard, Store, Bike, FileText
} from 'lucide-react';

export default function OrderConfirmationModal({
  isOpen,
  onClose,
  order,
  onTrackOrder
}) {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1300 }}>
      <div
        className="modal-card receipt-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '540px',
          width: '92%',
          borderRadius: '24px',
          padding: 0,
          overflow: 'hidden',
          background: '#FFF',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Success Header Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
            color: '#FFF',
            padding: '28px 24px',
            textAlign: 'center',
            position: 'relative'
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>

          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: '#FFF',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
            }}
          >
            <CheckCircle2 size={32} />
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: '900' }}>Order Placed Successfully!</h2>
          <p style={{ fontSize: '13px', opacity: 0.9, marginTop: '4px' }}>
            Reference: <strong>{order.id || order.orderNumber}</strong>
          </p>
          <div style={{ marginTop: '8px', display: 'inline-block', background: 'rgba(255,255,255,0.2)', padding: '3px 12px', borderRadius: '14px', fontSize: '12px', fontWeight: '700' }}>
            Paid &bull; {order.paymentMethod === 'wallet' ? 'Gada Wallet' : 'Flutterwave Gateway'}
          </div>
        </div>

        {/* Receipt Content */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, fontSize: '13px', color: '#334155' }}>
          {/* Metadata Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              padding: '14px',
              background: '#F8FAFC',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              marginBottom: '20px'
            }}
          >
            <div>
              <span style={{ fontSize: '11px', color: '#64748B', display: 'block', textTransform: 'uppercase', fontWeight: '700' }}>Customer</span>
              <strong style={{ color: '#0F172A' }}>{order.customerName}</strong>
              <div style={{ fontSize: '11px', color: '#64748B' }}>{order.customerPhone}</div>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: '#64748B', display: 'block', textTransform: 'uppercase', fontWeight: '700' }}>Estimated Arrival</span>
              <strong style={{ color: '#059669' }}>~20-25 Mins</strong>
              <div style={{ fontSize: '11px', color: '#64748B' }}>Live Rider Dispatch</div>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <span style={{ fontSize: '11px', color: '#64748B', display: 'block', textTransform: 'uppercase', fontWeight: '700' }}>Delivery Address</span>
              <strong style={{ color: '#0F172A' }}>{order.address}</strong>
              {order.deliveryNotes && (
                <div style={{ fontSize: '11px', color: '#FF6B00', marginTop: '2px' }}>
                  Note: {order.deliveryNotes}
                </div>
              )}
            </div>
          </div>

          {/* Purchased Items List */}
          <div style={{ marginBottom: '20px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              Purchased Items ({order.items?.length || 0})
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '700', color: '#0F172A' }}>
                      {item.quantity}x {item.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>
                      {item.vendor} {item.selectedVariant ? `&bull; ${item.selectedVariant.name}` : ''}
                    </div>
                  </div>
                  <div style={{ fontWeight: '800', color: '#0F172A' }}>
                    ₦{(item.calculatedPrice || item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
              <span>Transaction Reference</span>
              <span style={{ fontWeight: '700', color: '#0F172A' }}>{order.paymentReference || order.id}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
              <span>Total Paid</span>
              <span style={{ fontWeight: '900', color: '#059669', fontSize: '16px' }}>₦{order.total?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #E2E8F0',
            background: '#FFF',
            display: 'flex',
            gap: '12px'
          }}
        >
          <button
            onClick={handlePrint}
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid #CBD5E1',
              background: '#FFF',
              color: '#334155',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Printer size={16} />
            <span>Print Receipt</span>
          </button>

          <button
            onClick={() => {
              onClose();
              if (onTrackOrder) onTrackOrder(order);
            }}
            style={{
              flex: 1,
              padding: '12px 18px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #FF6B00 0%, #FF8533 100%)',
              color: '#FFF',
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(255, 107, 0, 0.3)'
            }}
          >
            <span>Live Order Tracking</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
