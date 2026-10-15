import React, { useState } from 'react';
import { Bike, Navigation, DollarSign, CheckCircle2, Phone, MapPin, Package, ShieldCheck, Power } from 'lucide-react';
import { INITIAL_RIDER_DATA } from '../data/marketplaceData';

export default function RiderPortal() {
  const [rider, setRider] = useState(INITIAL_RIDER_DATA);
  const [isOnline, setIsOnline] = useState(true);
  const [activeOrders, setActiveOrders] = useState(INITIAL_RIDER_DATA.activeOrders);

  const completeOrder = (orderId) => {
    setActiveOrders(activeOrders.map(o => o.id === orderId ? { ...o, status: 'Delivered' } : o));
    setRider(prev => ({ ...prev, todayEarnings: prev.todayEarnings + 1200 }));
  };

  return (
    <div className="main-content" style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Rider Hero Banner */}
      <div style={{ background: isOnline ? 'linear-gradient(135deg, #111827 0%, #1F2937 100%)' : '#475569', borderRadius: '24px', padding: '24px 28px', color: '#FFF', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#FF6B00', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bike size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800' }}>{rider.name}</h2>
              <span style={{ fontSize: '11px', background: '#FEF3C7', color: '#D97706', fontWeight: '800', padding: '2px 8px', borderRadius: '10px' }}>
                ★ {rider.rating}
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>{rider.vehicle}</p>
          </div>
        </div>

        {/* Online / Offline Toggle */}
        <button
          onClick={() => setIsOnline(!isOnline)}
          style={{
            padding: '10px 20px',
            borderRadius: '999px',
            background: isOnline ? '#10B981' : '#E2E8F0',
            color: isOnline ? '#FFF' : '#475569',
            fontWeight: '800',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: isOnline ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none'
          }}
        >
          <Power size={16} />
          <span>{isOnline ? 'ONLINE & READY' : 'OFFLINE'}</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#FFF', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '20px' }}>
          <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '700' }}>TODAY'S EARNINGS</span>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#10B981', marginTop: '4px' }}>
            ₦{rider.todayEarnings.toLocaleString()}
          </div>
        </div>

        <div style={{ background: '#FFF', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '20px' }}>
          <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '700' }}>WEEKLY TOTAL</span>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', marginTop: '4px' }}>
            ₦{rider.weeklyEarnings.toLocaleString()}
          </div>
        </div>

        <div style={{ background: '#FFF', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '20px' }}>
          <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '700' }}>COMPLETED TRIPS</span>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#FF6B00', marginTop: '4px' }}>
            {rider.completedDeliveries}
          </div>
        </div>
      </div>

      {/* Active Orders Section */}
      <div style={{ background: '#FFF', border: '1px solid #E5E7EB', borderRadius: '20px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A' }}>Active Delivery Orders</h3>
          <span style={{ fontSize: '12px', background: '#FFF4EC', color: '#FF6B00', padding: '4px 10px', borderRadius: '10px', fontWeight: '700' }}>
            {activeOrders.filter(o => o.status !== 'Delivered').length} Pending
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {activeOrders.map(order => (
            <div key={order.id} style={{ background: '#F8F9FA', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E5E7EB', paddingBottom: '12px', marginBottom: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A' }}>Order #{order.id}</span>
                    <span style={{ fontSize: '11px', background: '#DCFCE7', color: '#16A34A', fontWeight: '700', padding: '2px 8px', borderRadius: '6px' }}>
                      {order.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>Customer: {order.customerName} ({order.customerPhone})</p>
                </div>
                <span style={{ fontSize: '16px', fontWeight: '800', color: '#FF6B00' }}>
                  +₦{order.earnings} Payout
                </span>
              </div>

              {/* Pickup & Dropoff details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#334155' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <MapPin size={16} color="#FF6B00" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Pickup:</strong> {order.vendorName} ({order.pickupAddress})
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <Navigation size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Deliver to:</strong> {order.deliveryAddress} ({order.distance})
                  </div>
                </div>

                <div style={{ background: '#FFF', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '12px', color: '#475569', marginTop: '4px' }}>
                  <strong>Items:</strong> {order.items.join(', ')}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <a href={`tel:${order.customerPhone}`} style={{ flex: 1, textDecoration: 'none' }}>
                  <button style={{ width: '100%', padding: '10px', borderRadius: '12px', background: '#FFF', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: '700', color: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <Phone size={14} /> Call Customer
                  </button>
                </a>
                {order.status !== 'Delivered' ? (
                  <button
                    onClick={() => completeOrder(order.id)}
                    style={{ flex: 1, padding: '10px', borderRadius: '12px', background: '#10B981', color: '#FFF', fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <CheckCircle2 size={16} /> Complete Delivery Handoff
                  </button>
                ) : (
                  <span style={{ flex: 1, textAlign: 'center', color: '#10B981', fontWeight: '800', padding: '10px' }}>✓ Completed</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
