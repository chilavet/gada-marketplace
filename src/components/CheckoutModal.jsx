import React, { useState } from 'react';
import {
  X, MapPin, Wallet, CreditCard, Landmark, CheckCircle, ShieldCheck,
  Plus, Sparkles, UserCheck, AlertCircle, ArrowRight, Lock, ExternalLink,
  Store, Clock, FileText, CheckCircle2, Loader2
} from 'lucide-react';
import { checkoutApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function CheckoutModal({
  isOpen,
  onClose,
  totalAmount,
  onOpenAuth,
  onConfirmOrder
}) {

  const { currentUser, addAddress } = useAuth();
  const { cartItems, vendorGroups, summary } = useCart();

  const [paymentMethod, setPaymentMethod] = useState('card_flutterwave'); // 'card_flutterwave' | 'wallet'
  const [selectedAddressId, setSelectedAddressId] = useState(
    currentUser?.addresses?.find(a => a.isDefault)?.id || currentUser?.addresses?.[0]?.id || 'custom'
  );
  const [customAddress, setCustomAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [riderTip, setRiderTip] = useState(300);

  // Address creation toggle
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [newAddressText, setNewAddressText] = useState('');
  const [newAddressLabel, setNewAddressLabel] = useState('Home');

  // Gateway Simulation State
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [gatewayStep, setGatewayStep] = useState('form'); // 'form' | 'gateway_modal' | 'verifying'
  const [paymentReference, setPaymentReference] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '4084 0820 1928 4402', expiry: '12/28', cvv: '381' });

  const finalTotal = summary.total + riderTip;
  const userWallet = currentUser?.walletBalance || 0;
  const hasSufficientWallet = userWallet >= finalTotal;

  // Selected address resolution
  const resolvedAddress = currentUser?.addresses?.find(a => a.id === selectedAddressId)?.address
    || customAddress
    || (currentUser?.addresses?.[0]?.address)
    || 'No 14, Ring Road, Ibadan, Oyo State';

  const handleAddNewAddressSubmit = async (e) => {
    e.preventDefault();
    if (!newAddressText.trim()) return;
    await addAddress({
      label: newAddressLabel,
      address: newAddressText.trim(),
      isDefault: true
    });
    setIsAddingNewAddress(false);
    setNewAddressText('');
  };

  const handleProceedPayment = async () => {
    if (!currentUser) {
      onOpenAuth('register', 'Please create an account or sign in to complete checkout.');
      return;
    }

    if (paymentMethod === 'wallet' && !hasSufficientWallet) {
      alert(`Insufficient wallet balance (₦${userWallet.toLocaleString()}). Please top up or select Flutterwave.`);
      return;
    }

    setIsProcessingPayment(true);

    try {
      // 1. Initialize Payment
      const initRes = await checkoutApi.initializePayment({
        orderPayload: {
          items: cartItems,
          total: finalTotal,
          address: resolvedAddress
        },
        paymentMethod
      });

      setPaymentReference(initRes.reference);

      // If online card gateway (Flutterwave), show the interactive checkout simulator
      if (paymentMethod === 'card_flutterwave') {
        setGatewayStep('gateway_modal');
        setIsProcessingPayment(false);
      } else {
        // Direct confirmation for Wallet
        completeOrderHandover(initRes.reference);
      }
    } catch (err) {
      alert(err.message || 'Payment initialization failed.');
      setIsProcessingPayment(false);
    }
  };

  const handleGatewayAuthorize = async () => {
    setGatewayStep('verifying');
    try {
      // 2. Verify Payment Callback
      const verifyRes = await checkoutApi.verifyPayment(paymentReference);
      completeOrderHandover(paymentReference);
    } catch (err) {
      alert('Payment authorization failed.');
      setGatewayStep('form');
    }
  };

  const completeOrderHandover = (reference) => {
    onConfirmOrder({
      paymentMethod,
      paymentReference: reference,
      address: resolvedAddress,
      deliveryNotes,
      totalPaid: finalTotal,
      riderTip,
      customerName: currentUser?.name || 'Customer',
      customerPhone: currentUser?.phone || '+234 800 000 0000',
      vendorGroups
    });
    setGatewayStep('form');
    setIsProcessingPayment(false);
  };
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1200 }}>
      <div
        className="modal-card checkout-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '560px',
          width: '92%',
          borderRadius: '24px',
          padding: 0,
          overflow: 'hidden',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#FFF'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#FFF4EC', color: '#FF6B00', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A' }}>
                Multi-Vendor Secure Checkout
              </h2>
              <p style={{ fontSize: '12px', color: '#64748B' }}>
                Ibadan Hyperlocal Delivery &bull; {vendorGroups.length} Merchant {vendorGroups.length === 1 ? 'Hub' : 'Hubs'}
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

        {/* Guest Auth Notice */}
        {!currentUser && (
          <div style={{ background: '#FFF4EC', padding: '16px 24px', borderBottom: '1px solid #FFD8BE', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#9A3412', fontWeight: '600' }}>
              <UserCheck size={18} />
              <span>Please sign in or create an account to proceed with checkout.</span>
            </div>
            <button
              onClick={() => onOpenAuth('register', 'Sign in to save your address and complete your order.')}
              style={{ padding: '6px 14px', borderRadius: '10px', background: '#FF6B00', color: '#FFF', border: 'none', fontSize: '12px', fontWeight: '800', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              Sign In / Register
            </button>
          </div>
        )}

        {/* INTERACTIVE FLUTTERWAVE GATEWAY POPUP SIMULATOR */}
        {gatewayStep === 'gateway_modal' && (
          <div style={{ padding: '28px', background: '#0F172A', color: '#FFF', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ background: '#1E293B', borderRadius: '20px', padding: '24px', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '14px', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FB923C', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '14px' }}>
                    F
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '800' }}>
                      Flutterwave Standard
                    </div>
                    <div style={{ fontSize: '11px', color: '#94A3B8' }}>Reference: {paymentReference}</div>
                  </div>
                </div>
                <div style={{ fontSize: '16px', fontWeight: '900', color: '#38BDF8' }}>
                  ₦{finalTotal.toLocaleString()}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase' }}>Card Number</label>
                  <input
                    type="text"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: '#0F172A', border: '1px solid #475569', color: '#FFF', fontSize: '14px', fontWeight: '700', marginTop: '4px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase' }}>Valid Thru</label>
                    <input
                      type="text"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: '#0F172A', border: '1px solid #475569', color: '#FFF', fontSize: '14px', fontWeight: '700', marginTop: '4px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase' }}>CVV</label>
                    <input
                      type="password"
                      maxLength={3}
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: '#0F172A', border: '1px solid #475569', color: '#FFF', fontSize: '14px', fontWeight: '700', marginTop: '4px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ fontSize: '11px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                  <Lock size={12} color="#10B981" />
                  <span>256-bit SSL Encrypted &bull; PCI-DSS Level 1 Certified</span>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                  <button
                    onClick={() => setGatewayStep('form')}
                    style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #475569', background: 'transparent', color: '#94A3B8', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleGatewayAuthorize}
                    style={{ flex: 2, padding: '12px', borderRadius: '12px', border: 'none', background: '#10B981', color: '#FFF', fontSize: '14px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <span>Authorize ₦{finalTotal.toLocaleString()}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VERIFYING PAYMENT LOADER */}
        {gatewayStep === 'verifying' && (
          <div style={{ padding: '60px 24px', textAlign: 'center', flex: 1 }}>
            <Loader2 size={40} color="#FF6B00" className="animate-spin" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A' }}>Verifying Transaction Callback...</h3>
            <p style={{ fontSize: '13px', color: '#64748B', marginTop: '6px' }}>Communicating with banking switch for reference {paymentReference}</p>
          </div>
        )}

        {/* MAIN CHECKOUT FORM STEP */}
        {gatewayStep === 'form' && (
          <div style={{ overflowY: 'auto', flex: 1, padding: '24px' }}>
            {/* 1. Delivery Address Selection */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A' }}>
                  1. Delivery Destination (Ibadan)
                </span>
                {currentUser && !isAddingNewAddress && (
                  <button
                    onClick={() => setIsAddingNewAddress(true)}
                    style={{ background: 'none', border: 'none', color: '#0B4FD8', fontSize: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                  >
                    <Plus size={14} /> Add New Address
                  </button>
                )}
              </div>

              {isAddingNewAddress ? (
                <form onSubmit={handleAddNewAddressSubmit} style={{ background: '#F8FAFC', padding: '16px', borderRadius: '14px', border: '1px solid #CBD5E1', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                    {['Home', 'Office', 'Other'].map(lbl => (
                      <button
                        key={lbl}
                        type="button"
                        onClick={() => setNewAddressLabel(lbl)}
                        style={{ padding: '4px 10px', borderRadius: '8px', border: newAddressLabel === lbl ? '1px solid #0B4FD8' : '1px solid #E2E8F0', background: newAddressLabel === lbl ? '#EFF6FF' : '#FFF', color: newAddressLabel === lbl ? '#0B4FD8' : '#64748B', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Enter street, house number, area in Ibadan"
                    value={newAddressText}
                    onChange={(e) => setNewAddressText(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box', marginBottom: '10px' }}
                  />
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={() => setIsAddingNewAddress(false)} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFF', fontSize: '12px', cursor: 'pointer' }}>Cancel</button>
                    <button type="submit" style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', background: '#0B4FD8', color: '#FFF', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>Save Address</button>
                  </div>
                </form>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {currentUser?.addresses && currentUser.addresses.length > 0 ? (
                    currentUser.addresses.map(addr => {
                      const isSelected = selectedAddressId === addr.id;
                      return (
                        <div
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          style={{
                            padding: '12px 14px',
                            borderRadius: '12px',
                            border: isSelected ? '2px solid #FF6B00' : '1px solid #E2E8F0',
                            background: isSelected ? '#FFF8F4' : '#FFF',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <MapPin size={16} color={isSelected ? '#FF6B00' : '#64748B'} />
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>{addr.label}</div>
                              <div style={{ fontSize: '12px', color: '#64748B' }}>{addr.address}</div>
                            </div>
                          </div>
                          {isSelected && <CheckCircle size={16} color="#FF6B00" />}
                        </div>
                      );
                    })
                  ) : (
                    <div>
                      <input
                        type="text"
                        placeholder="Type delivery address in Ibadan (e.g. Ring Road, Bodija, Dugbe)"
                        value={customAddress}
                        onChange={(e) => setCustomAddress(e.target.value)}
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #E2E8F0', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Delivery Notes */}
              <div style={{ marginTop: '12px' }}>
                <input
                  type="text"
                  placeholder="Delivery note for rider (e.g. Gate 2, call upon arrival, opposite mosque)"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '12px', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* 2. Payment Method Selector */}
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', display: 'block', marginBottom: '12px' }}>
                2. Payment Method
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Flutterwave Standard */}
                <div
                  onClick={() => setPaymentMethod('card_flutterwave')}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '14px',
                    border: paymentMethod === 'card_flutterwave' ? '2px solid #FF6B00' : '1px solid #E2E8F0',
                    background: paymentMethod === 'card_flutterwave' ? '#FFF8F4' : '#FFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Landmark size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>Flutterwave Gateway</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>Cards, USSD, Barter, Apple Pay & Bank Direct</div>
                    </div>
                  </div>
                  {paymentMethod === 'card_flutterwave' && <CheckCircle size={18} color="#FF6B00" />}
                </div>

                {/* Gada In-App Wallet */}
                <div
                  onClick={() => setPaymentMethod('wallet')}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '14px',
                    border: paymentMethod === 'wallet' ? '2px solid #FF6B00' : '1px solid #E2E8F0',
                    background: paymentMethod === 'wallet' ? '#FFF8F4' : '#FFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Wallet size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>
                        Gada In-App Wallet (₦{userWallet.toLocaleString()})
                      </div>
                      <div style={{ fontSize: '11px', color: hasSufficientWallet ? '#16A34A' : '#DC2626', fontWeight: '600' }}>
                        {hasSufficientWallet ? 'Sufficient balance for instant checkout' : 'Low balance - please top up or select Flutterwave'}
                      </div>
                    </div>
                  </div>
                  {paymentMethod === 'wallet' && <CheckCircle size={18} color="#FF6B00" />}
                </div>
              </div>
            </div>

            {/* Rider Tip */}
            <div style={{ marginBottom: '24px', background: '#F8FAFC', padding: '14px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A' }}>Add Rider Tip (Optional)</span>
                <span style={{ fontSize: '12px', fontWeight: '800', color: '#FF6B00' }}>+₦{riderTip.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[0, 200, 300, 500, 1000].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setRiderTip(amt)}
                    style={{
                      flex: 1,
                      padding: '6px',
                      borderRadius: '8px',
                      border: riderTip === amt ? '1px solid #FF6B00' : '1px solid #CBD5E1',
                      background: riderTip === amt ? '#FF6B00' : '#FFF',
                      color: riderTip === amt ? '#FFF' : '#334155',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {amt === 0 ? 'None' : `₦${amt}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Final Order Breakdown */}
            <div style={{ background: '#FFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                <span>Items Subtotal ({cartItems.length} items)</span>
                <span style={{ fontWeight: '700', color: '#0F172A' }}>₦{summary.subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                <span>Multi-Vendor Delivery ({vendorGroups.length} {vendorGroups.length === 1 ? 'Hub' : 'Hubs'})</span>
                <span style={{ fontWeight: '700', color: '#0F172A' }}>₦{summary.deliveryFee.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                <span>Marketplace Handling & Tech Fee</span>
                <span style={{ fontWeight: '700', color: '#0F172A' }}>₦{summary.serviceFee.toLocaleString()}</span>
              </div>
              {summary.discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16A34A' }}>
                  <span>Discount</span>
                  <span style={{ fontWeight: '800' }}>-₦{summary.discountAmount.toLocaleString()}</span>
                </div>
              )}
              {riderTip > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                  <span>Rider Tip</span>
                  <span style={{ fontWeight: '700', color: '#0F172A' }}>₦{riderTip.toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '900', color: '#0F172A', paddingTop: '10px', borderTop: '1px solid #E2E8F0' }}>
                <span>Total Amount Due</span>
                <span style={{ color: '#FF6B00' }}>₦{finalTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Sticky Action Footer */}
        {gatewayStep === 'form' && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid #E2E8F0', background: '#FFF' }}>
            <button
              onClick={handleProceedPayment}
              disabled={isProcessingPayment || !currentUser}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '16px',
                border: 'none',
                background: !currentUser ? '#94A3B8' : 'linear-gradient(135deg, #FF6B00 0%, #FF8533 100%)',
                color: '#FFF',
                fontSize: '15px',
                fontWeight: '800',
                cursor: !currentUser ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: !currentUser ? 'none' : '0 8px 20px rgba(255, 107, 0, 0.3)'
              }}
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Contacting Gateway...</span>
                </>
              ) : (
                <>
                  <Lock size={16} />
                  <span>Pay & Dispatch Order &bull; ₦{finalTotal.toLocaleString()}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
