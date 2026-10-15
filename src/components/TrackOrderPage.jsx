import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Phone, MessageSquare, CheckCircle, Clock, MapPin, Bike,
  Navigation, Store, UserCheck, ShieldCheck, ExternalLink, ChevronRight,
  AlertCircle, RefreshCw
} from 'lucide-react';
import { orderApi } from '../api';
import OrderChatModal from './chat/OrderChatModal';
import LiveRiderMapTracking from './tracking/LiveRiderMapTracking';
import OrderDeliveredModal from './tracking/OrderDeliveredModal';

export default function TrackOrderPage({ order, onBack }) {
  // Timeline status states:
  // 1: 'Order Placed'
  // 2: 'Vendor Preparing'
  // 3: 'Rider Assigned'
  // 4: 'Out for Delivery'
  // 5: 'Delivered'
  const [currentStep, setCurrentStep] = useState(2);
  const [etaMinutes, setEtaMinutes] = useState(18);
  const [isPolling, setIsPolling] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDeliveredModalOpen, setIsDeliveredModalOpen] = useState(false);

  const handleDelivered = () => {
    setCurrentStep(5);
    setEtaMinutes(0);
    setIsDeliveredModalOpen(true);
  };

  // Auto step progression simulation and live polling simulation
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setCurrentStep(3);
      setEtaMinutes(14);
    }, 6000);

    const timer2 = setTimeout(() => {
      setCurrentStep(4);
      setEtaMinutes(8);
    }, 14000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Polling simulation every 8 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!order?.id) return;
      try {
        setIsPolling(true);
        const latest = await orderApi.trackOrder(order.id);
        if (latest?.etaMinutes) setEtaMinutes(latest.etaMinutes);
      } catch (err) {
        console.warn('Tracking polling failed:', err);
      } finally {
        setTimeout(() => setIsPolling(false), 800);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [order?.id]);

  const storeLocation = order?.storeLocation || order?.vendorLocation || 'Bodija Central Hub, Ibadan';
  const rider = order?.rider || order?.assignedRider;
  const riderName = rider?.name || order?.riderName || 'Babatunde Ogunlesi';
  const riderPhone = rider?.phone || '+234 812 893 4921';
  const deliveryAddress = order?.delivery?.shippingAddress?.street
    ? `${order.delivery.shippingAddress.street}, ${order.delivery.shippingAddress.city || 'Ibadan'}`
    : (order?.address || order?.deliveryAddress || 'No 14, Ring Road, Ibadan');
  const orderId = order?.id || order?.orderNumber || 'GADA-9104';

  const steps = [
    {
      title: 'Order Placed',
      actor: 'Customer Order Received',
      desc: `Order received and logged in dispatch system with reference ${orderId}`,
      time: 'Confirmed',
      icon: <CheckCircle size={16} />
    },
    {
      title: 'Vendor Preparing',
      actor: `Store: ${order?.storeName || order?.vendorName || 'Bodija Market Hub'}`,
      desc: 'Merchant kitchen is packaging fresh items and assembling order',
      time: 'In Progress',
      icon: <Store size={16} />
    },
    {
      title: 'Rider Assigned',
      actor: `${riderName} (Dispatched Courier)`,
      desc: `${riderName} accepted dispatch and arrived at vendor hub`,
      time: 'Pickup Verified',
      icon: <Bike size={16} />
    },
    {
      title: 'Out for Delivery',
      actor: 'Live Courier Transit',
      desc: `Rider en route towards delivery destination: ${deliveryAddress}`,
      time: `ETA ~${etaMinutes} mins`,
      icon: <Navigation size={16} />
    },
    {
      title: 'Delivered',
      actor: 'Destination Handover',
      desc: 'Package handed over to customer with confirmation pin',
      time: 'Final Destination',
      icon: <CheckCircle size={16} />
    }
  ];

  const getStepStatus = (index) => {
    const stepNumber = index + 1;
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'active';
    return 'pending';
  };

  return (
    <div className="track-order-page" style={{ width: '100%', minHeight: '100vh', background: '#F8FAFC' }}>
      {/* Header bar */}
      <div
        style={{
          padding: '16px 32px',
          width: '100%',
          background: '#FFF',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={onBack}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: '#F1F5F9',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A' }}>
                Track Order #{orderId}
              </h1>
              <span
                style={{
                  fontSize: '11px',
                  background: currentStep === 5 ? '#DCFCE7' : '#FFF4EC',
                  color: currentStep === 5 ? '#166534' : '#FF6B00',
                  fontWeight: '800',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {isPolling && <RefreshCw size={10} className="animate-spin" />}
                {steps[currentStep - 1]?.title}
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#64748B' }}>
              {currentStep === 5 ? 'Order delivered successfully!' : `Estimated Arrival: ~${etaMinutes} mins`}
            </p>
          </div>
        </div>

        {/* Manual Step Switcher for demo & verification */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600' }}>Simulate Stage:</span>
          {steps.map((st, i) => (
            <button
              key={i}
              onClick={() => {
                const targetStep = i + 1;
                setCurrentStep(targetStep);
                if (targetStep === 5) {
                  handleDelivered();
                }
              }}
              style={{
                padding: '4px 8px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: '700',
                border: 'none',
                background: currentStep === i + 1 ? '#FF6B00' : '#F1F5F9',
                color: currentStep === i + 1 ? '#FFF' : '#475569',
                cursor: 'pointer'
              }}
              title={st.title}
            >
              {i + 1}. {st.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Tracking Content Layout */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px' }}>
        {/* Live Rider Map Tracking when Rider is En Route */}
        {currentStep >= 3 && (
          <div style={{ marginBottom: '28px' }}>
            <LiveRiderMapTracking
              orderId={orderId}
              riderName={riderName}
              riderPhone={riderPhone}
              storeName={storeLocation}
              destinationAddress={deliveryAddress}
              initialEta={etaMinutes}
              isOutForDelivery={currentStep === 4}
              onDelivered={handleDelivered}
            />
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
          {/* Left Column: Live Progress Timeline */}
          <div style={{ background: '#FFF', borderRadius: '24px', padding: '28px', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A' }}>
                  Live Logistics Timeline
                </h2>
                <p style={{ fontSize: '12px', color: '#64748B' }}>
                  Real-time status updates from store agent & rider app
                </p>
              </div>

              <div style={{ background: '#EFF6FF', color: '#0B4FD8', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '800' }}>
                Stage {currentStep} of 5
              </div>
            </div>

            {/* Stepper Vertical Flow */}
            <div style={{ position: 'relative', paddingLeft: '8px' }}>
              {steps.map((step, idx) => {
                const status = getStepStatus(idx);
                const isCompleted = status === 'completed';
                const isActive = status === 'active';
                const isPending = status === 'pending';

                return (
                  <div key={idx} style={{ display: 'flex', gap: '16px', position: 'relative', paddingBottom: idx < steps.length - 1 ? '32px' : '0' }}>
                    {/* Connecting line */}
                    {idx < steps.length - 1 && (
                      <div
                        style={{
                          position: 'absolute',
                          left: '17px',
                          top: '36px',
                          bottom: '0',
                          width: '2px',
                          background: isCompleted ? '#10B981' : '#E2E8F0'
                        }}
                      />
                    )}

                    {/* Node Icon */}
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: isCompleted ? '#10B981' : isActive ? '#FF6B00' : '#F1F5F9',
                        color: isCompleted || isActive ? '#FFF' : '#94A3B8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2,
                        flexShrink: 0,
                        boxShadow: isActive ? '0 0 0 4px rgba(255, 107, 0, 0.2)' : 'none',
                        transition: 'all 0.3s'
                      }}
                    >
                      {step.icon}
                    </div>

                    {/* Step Details */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h4 style={{ fontSize: '15px', fontWeight: '800', color: isPending ? '#94A3B8' : '#0F172A' }}>
                          {step.title}
                        </h4>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: isActive ? '#FF6B00' : isCompleted ? '#10B981' : '#94A3B8' }}>
                          {step.time}
                        </span>
                      </div>

                      <div style={{ fontSize: '12px', fontWeight: '600', color: isActive ? '#0B4FD8' : '#64748B', marginTop: '2px' }}>
                        {step.actor}
                      </div>

                      <p style={{ fontSize: '13px', color: isPending ? '#94A3B8' : '#475569', marginTop: '4px', lineHeight: '1.4' }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Assigned Rider Card & Order Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Assigned Rider Card */}
            <div style={{ background: '#FFF', borderRadius: '24px', padding: '24px', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Assigned Delivery Rider
                </span>
                <span style={{ fontSize: '11px', background: '#DCFCE7', color: '#166534', fontWeight: '800', padding: '2px 8px', borderRadius: '10px' }}>
                  Verified Courier
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                  alt={riderName}
                  style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #FF6B00' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A' }}>{riderName}</h3>
                    <ShieldCheck size={16} color="#10B981" />
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                    TVS Neo Delivery Bike &bull; <strong>IBD-492-OYO</strong>
                  </div>
                  <div style={{ fontSize: '12px', color: '#D97706', fontWeight: '700', marginTop: '2px' }}>
                    ★ 4.9 Rating (1,400+ deliveries)
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <a
                  href={`tel:${riderPhone}`}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '12px',
                    background: '#0B4FD8',
                    color: '#FFF',
                    fontSize: '13px',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    textDecoration: 'none'
                  }}
                >
                  <Phone size={15} />
                  <span>Call Rider</span>
                </a>

                <button
                  type="button"
                  onClick={() => setIsChatOpen(true)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '12px',
                    background: '#FF6B00',
                    color: '#FFF',
                    fontSize: '13px',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(255,107,0,0.3)',
                    transition: 'all 0.2s'
                  }}
                >
                  <MessageSquare size={15} />
                  <span>Chat with Rider</span>
                </button>
              </div>
            </div>

            {/* Destination & Order Summary Card */}
            <div style={{ background: '#FFF', borderRadius: '24px', padding: '24px', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', marginBottom: '14px' }}>
                Order Summary & Routing
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Store size={16} color="#0B4FD8" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Merchant Hub</span>
                    <strong style={{ color: '#0F172A' }}>{order?.storeName || 'Bodija Market Central Hub'}</strong>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>{storeLocation}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <MapPin size={16} color="#FF6B00" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Customer Destination</span>
                    <strong style={{ color: '#0F172A' }}>{deliveryAddress}</strong>
                    {order?.deliveryNotes && (
                      <div style={{ fontSize: '11px', color: '#FF6B00', marginTop: '2px' }}>
                        Note: {order.deliveryNotes}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ paddingTop: '12px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Total Amount Paid</span>
                  <strong style={{ color: '#0F172A', fontSize: '15px' }}>
                    ₦{(order?.total || 0).toLocaleString()}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inbuilt Rider & Order Chat System */}
      <OrderChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        orderId={orderId}
        riderName={riderName}
        riderPhone={riderPhone}
        storeName={storeLocation}
      />

      {/* Package Delivered Celebration Modal */}
      <OrderDeliveredModal
        isOpen={isDeliveredModalOpen}
        onClose={() => setIsDeliveredModalOpen(false)}
        orderId={orderId}
        riderName={riderName}
        destinationAddress={deliveryAddress}
        totalAmount={order?.total || 8400}
        onReturnHome={onBack}
      />
    </div>
  );
}
