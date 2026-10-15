import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, Tag, ShoppingBag, Store, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer({
  isOpen,
  onClose,
  onProceedToCheckout
}) {

  const {
    cartItems,
    vendorGroups,
    summary,
    appliedPromo,
    updateQuantity,
    removeItem,
    clearCart,
    applyPromo,
    removePromo
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState(null);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromo(promoInput);
  };

  if (!isOpen) return null;

  return (
    <div className="cart-drawer-overlay" onClick={onClose} style={{ zIndex: 1200 }}>
      <div
        className="cart-drawer"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '440px',
          maxWidth: '92vw',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.2)'
        }}
      >
        {/* Drawer Header */}
        <div className="cart-header" style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FFF4EC', color: '#FF6B00', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A' }}>Your Cart</h3>
              <p style={{ fontSize: '12px', color: '#64748B' }}>
                {cartItems.length} items &bull; {vendorGroups.length} {vendorGroups.length === 1 ? 'Merchant' : 'Merchants'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F1F5F9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Multi-Vendor Banner if >1 vendor */}
        {vendorGroups.length > 1 && (
          <div style={{ background: '#EFF6FF', borderBottom: '1px solid #BFDBFE', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#1E40AF' }}>
            <Store size={15} />
            <span>
              <strong>Multi-Vendor Order:</strong> Your basket contains items from <strong>{vendorGroups.length} different market hubs</strong>.
            </span>
          </div>
        )}

        {/* Drawer Body */}
        <div className="cart-body" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748B' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🛒</div>
              <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A' }}>Your cart is empty</h4>
              <p style={{ fontSize: '13px', marginTop: '4px' }}>Add fresh market produce or meals from top verified vendors!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Render items grouped clearly by Vendor */}
              {vendorGroups.map((group, groupIdx) => (
                <div
                  key={groupIdx}
                  style={{
                    background: '#FFF',
                    borderRadius: '16px',
                    border: '1.5px solid #E2E8F0',
                    overflow: 'hidden',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                  }}
                >
                  {/* Vendor Group Header */}
                  <div
                    style={{
                      background: '#F8FAFC',
                      padding: '10px 14px',
                      borderBottom: '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Store size={14} color="#0B4FD8" />
                      <span style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>
                        {group.vendorName}
                      </span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>
                      {group.locationName}
                    </span>
                  </div>

                  {/* Group Items */}
                  <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {group.items.map((item, idx) => {
                      const itemTotal = item.calculatedPrice || item.price * item.quantity;
                      return (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            gap: '12px',
                            paddingBottom: idx < group.items.length - 1 ? '12px' : '0',
                            borderBottom: idx < group.items.length - 1 ? '1px dashed #E2E8F0' : 'none'
                          }}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover' }}
                          />
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                <h5 style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A', lineHeight: '1.2' }}>
                                  {item.name}
                                </h5>
                                <button
                                  onClick={() => removeItem(item.id, item.selectedVariant?.id)}
                                  style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '2px' }}
                                  title="Remove item"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>

                              {item.selectedVariant && (
                                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                                  Variant: <strong style={{ color: '#0F172A' }}>{item.selectedVariant.name}</strong>
                                </div>
                              )}
                              {item.selectedAddons && item.selectedAddons.length > 0 && (
                                <div style={{ fontSize: '10px', color: '#64748B' }}>
                                  Addons: {item.selectedAddons.map(a => a.name).join(', ')}
                                </div>
                              )}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                              <span style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A' }}>
                                ₦{itemTotal.toLocaleString()}
                              </span>

                              {/* Quantity Controls */}
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  background: '#F1F5F9',
                                  padding: '2px 8px',
                                  borderRadius: '20px'
                                }}
                              >
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedVariant?.id)}
                                  style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', display: 'flex' }}
                                >
                                  <Minus size={13} />
                                </button>
                                <span style={{ fontSize: '12px', fontWeight: '800' }}>{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedVariant?.id)}
                                  style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', display: 'flex' }}
                                >
                                  <Plus size={13} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Promo Code Input */}
              <div style={{ marginTop: '8px', background: '#F8FAFC', padding: '14px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Enter Promo Code (e.g. GADA20)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      fontSize: '13px',
                      textTransform: 'uppercase'
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: '8px 14px',
                      borderRadius: '10px',
                      border: 'none',
                      background: '#0B4FD8',
                      color: '#FFF',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Apply
                  </button>
                </form>

                {promoMessage && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: promoMessage.success ? '#16A34A' : '#DC2626', fontWeight: '600' }}>
                    {promoMessage.message}
                  </div>
                )}

                {appliedPromo && (
                  <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#DCFCE7', padding: '6px 10px', borderRadius: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#166534', fontWeight: '700' }}>
                      ✓ {appliedPromo.code}: {appliedPromo.description}
                    </span>
                    <button onClick={removePromo} style={{ background: 'none', border: 'none', color: '#DC2626', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Summary & Checkout CTA */}
        {cartItems.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid #E2E8F0', background: '#FFF' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#475569', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: '700', color: '#0F172A' }}>₦{summary.subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>
                  Delivery Fee ({summary.vendorCount} {summary.vendorCount > 1 ? 'Hubs' : 'Hub'})
                </span>
                <span style={{ fontWeight: '700', color: '#0F172A' }}>₦{summary.deliveryFee.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Platform Service Fee</span>
                <span style={{ fontWeight: '700', color: '#0F172A' }}>₦{summary.serviceFee.toLocaleString()}</span>
              </div>
              {summary.discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16A34A' }}>
                  <span>Promotional Discount</span>
                  <span style={{ fontWeight: '800' }}>-₦{summary.discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '900', color: '#0F172A', paddingTop: '8px', borderTop: '1px solid #E2E8F0' }}>
                <span>Grand Total</span>
                <span style={{ color: '#FF6B00' }}>₦{summary.total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => onProceedToCheckout(summary.total)}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '16px',
                border: 'none',
                background: 'linear-gradient(135deg, #FF6B00 0%, #FF8533 100%)',
                color: '#FFF',
                fontSize: '15px',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(255, 107, 0, 0.3)'
              }}
            >
              <span>Proceed to Multi-Vendor Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
