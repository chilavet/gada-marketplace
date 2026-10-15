'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { orderService } from '@/services/orderService';
import { Order, OrderStatus } from '@/types/marketplace';
import { OrderChatModal } from '@/components/chat/OrderChatModal';
import { LiveRiderMapTracking } from '@/components/tracking/LiveRiderMapTracking';
import { OrderDeliveredModal } from '@/components/tracking/OrderDeliveredModal';

// Sequence of order milestones
const STATUS_STEPS: { key: OrderStatus; label: string; desc: string }[] = [
  { key: 'order_placed', label: 'Order Confirmed', desc: 'Received and sent to merchants' },
  { key: 'preparing', label: 'Preparing Items', desc: 'Merchants are packing your items' },
  { key: 'rider_assigned', label: 'Rider Assigned', desc: 'Dispatch rider is en route to pickup' },
  { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Rider is on the way to your address' },
  { key: 'delivered', label: 'Delivered', desc: 'Package delivered safely' },
];

export function playStatusNotificationChime() {
  if (typeof window === 'undefined') return;

  try {
    // Generate an in-browser synth chime using Web Audio API without needing external MP3 assets
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {
    console.warn('Audio notification failed:', e);
  }
}

export async function requestPushPermissionAndNotify(title: string, body: string) {
  if (typeof window === 'undefined' || !('Notification' in window)) return;

  if (Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/favicon.ico' });
  } else if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      new Notification(title, { body, icon: '/favicon.ico' });
    }
  }
}

export default function OrderTrackingPage({
  params,
}: {
  params: Promise<{ orderId: string }> | { orderId: string };
}) {
  const resolvedParams =
    params instanceof Promise || (params && typeof (params as any).then === 'function')
      ? use(params as Promise<{ orderId: string }>)
      : (params as { orderId: string });

  const { orderId } = resolvedParams || { orderId: 'ord_mock_9921' };

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDeliveredModalOpen, setIsDeliveredModalOpen] = useState(false);

  // Poll for live status changes every 12 seconds
  useEffect(() => {
    let isMounted = true;

    async function fetchStatus() {
      try {
        const response = await orderService.getOrderStatus(orderId);
        if (isMounted && response.data) {
          setOrder((prev) => {
            if (prev && prev.status !== response.data.status) {
              playStatusNotificationChime();
              const milestone = STATUS_STEPS.find((s) => s.key === response.data.status);
              requestPushPermissionAndNotify(
                `Order Update #${orderId}`,
                milestone ? `${milestone.label}: ${milestone.desc}` : `Status: ${response.data.status}`
              );
              if (response.data.status === 'delivered') {
                setIsDeliveredModalOpen(true);
              }
            }
            return response.data;
          });
          setError(null);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : 'Could not fetch order status';
          setError(msg);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchStatus();
    const interval = setInterval(fetchStatus, 12000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-24 px-4 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent mb-4" />
        <p className="text-gray-600 font-medium">Loading live tracking details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-4 border border-red-200">
          {error || 'Unable to load order details.'}
        </div>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-black transition"
        >
          Return to Marketplace
        </Link>
      </div>
    );
  }

  // Determine active step index
  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <main className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      {/* Header Banner */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="inline-block px-2.5 py-1 text-xs font-semibold uppercase tracking-wider bg-amber-100 text-amber-800 rounded-full mb-2">
            Live Order Tracking
          </span>
          <h1 className="text-2xl font-bold text-gray-900">
            Order #{order.orderNumber || order.id}
          </h1>
          <p className="text-sm text-gray-500">
            Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        <div className="text-right sm:border-l sm:pl-6">
          <p className="text-xs text-gray-500 uppercase font-semibold">Total Paid</p>
          <p className="text-2xl font-extrabold text-gray-900">
            ₦{order.pricing.grandTotal.toLocaleString()}
          </p>
          <span className="text-xs text-emerald-600 font-medium">
            Payment {order.payment.status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Cancellation Notice */}
      {isCancelled && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">
          <strong>Order Cancelled:</strong> This order has been cancelled. If your payment was deducted, a refund will be processed automatically to your payment source.
        </div>
      )}

      {/* Order Progression Stepper */}
      {!isCancelled && (
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-6">Delivery Progress</h2>

          <div className="relative border-l-2 border-gray-200 ml-4 sm:ml-6 space-y-8 py-2">
            {STATUS_STEPS.map((step, idx) => {
              const isPassed = currentStepIndex >= idx;
              const isCurrent = currentStepIndex === idx;

              return (
                <div key={step.key} className="relative pl-8">
                  {/* Step Marker Dot */}
                  <span
                    className={`absolute -left-[17px] top-0.5 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${isPassed
                      ? 'bg-amber-500 border-amber-500 text-white font-bold'
                      : 'bg-white border-gray-300 text-gray-400'
                      }`}
                  >
                    {isPassed ? '✓' : idx + 1}
                  </span>

                  <div>
                    <h3
                      className={`text-base font-semibold ${isCurrent
                        ? 'text-amber-600'
                        : isPassed
                          ? 'text-gray-900'
                          : 'text-gray-400'
                        }`}
                    >
                      {step.label}
                    </h3>
                    <p className="text-sm text-gray-500">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Live Rider Map Tracking when Rider is Out For Delivery */}
      {order.rider && (order.status === 'out_for_delivery' || order.status === 'rider_assigned') && (
        <LiveRiderMapTracking
          orderId={order.orderNumber || order.id}
          riderName={order.rider.name}
          riderPhone={order.rider.phone}
          storeName={order.vendorGroups?.[0]?.vendorName || 'Merchant Dispatch Hub'}
          destinationAddress={`${order.delivery.shippingAddress.street}, ${order.delivery.shippingAddress.city}`}
          city={(order.delivery.shippingAddress.city as 'Lagos' | 'Abuja') || 'Lagos'}
          initialEta={order.etaMinutes || 18}
          isOutForDelivery={order.status === 'out_for_delivery'}
          onDelivered={() => {
            setIsDeliveredModalOpen(true);
            setOrder((prev) => (prev ? { ...prev, status: 'delivered' } : null));
          }}
        />
      )}

      {/* Dispatch Rider Card */}
      {order.rider && (
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <div className="h-14 w-14 rounded-full bg-amber-500 flex items-center justify-center text-xl font-bold text-white uppercase overflow-hidden">
              {order.rider.photoUrl ? (
                <img
                  src={order.rider.photoUrl}
                  alt={order.rider.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                order.rider.name.slice(0, 2)
              )}
            </div>
            <div>
              <span className="text-xs text-amber-400 uppercase font-semibold tracking-wider">
                Assigned Dispatch Rider
              </span>
              <h3 className="text-lg font-bold">{order.rider.name}</h3>
              <p className="text-xs text-gray-300">
                Vehicle: {order.rider.vehicleType?.toUpperCase() || 'MOTORCYCLE'} • {order.rider.vehiclePlateNumber || 'Abuja Fleet'}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsChatOpen(true)}
              className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white font-semibold rounded-lg text-sm text-center transition flex items-center justify-center gap-2 border border-gray-700"
            >
              <span>💬 In-App Chat</span>
            </button>
            <a
              href={`tel:${order.rider.phone}`}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg text-sm text-center transition flex items-center justify-center gap-2"
            >
              <span>Call Rider ({order.rider.phone})</span>
            </a>
          </div>
        </div>
      )}

      {/* Delivery Destination & Sub-Orders Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Destination */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-3">
          <h3 className="text-base font-bold text-gray-900">Delivery Address</h3>
          <p className="text-sm text-gray-800 font-medium">
            {order.delivery.recipientName} ({order.delivery.recipientPhone})
          </p>
          <p className="text-sm text-gray-600">
            {order.delivery.shippingAddress.street}, {order.delivery.shippingAddress.city},{' '}
            {order.delivery.shippingAddress.state}
          </p>
          {order.delivery.deliveryInstructions && (
            <p className="text-xs bg-gray-50 border p-2.5 rounded-md text-gray-600 mt-2">
              <strong>Rider Notes:</strong> {order.delivery.deliveryInstructions}
            </p>
          )}
        </div>

        {/* Payment Summary */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-2 text-sm">
          <h3 className="text-base font-bold text-gray-900 mb-3">Cost Breakdown</h3>
          <div className="flex justify-between text-gray-600">
            <span>Items Subtotal</span>
            <span>₦{order.pricing.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Delivery Fee</span>
            <span>₦{order.pricing.totalDeliveryFee.toLocaleString()}</span>
          </div>
          {order.pricing.serviceFee > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Platform Service Fee</span>
              <span>₦{order.pricing.serviceFee.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-gray-900 text-base border-t pt-3 mt-2">
            <span>Total Amount Paid</span>
            <span>₦{order.pricing.grandTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Inbuilt Order & Rider Chat Modal */}
      <OrderChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        orderId={order.orderNumber || order.id}
        riderName={order.rider?.name || 'Assigned Courier'}
        riderPhone={order.rider?.phone || '+234 907 268 8238'}
        storeName={order.delivery?.shippingAddress?.city || 'Gadaride Fleet'}
      />

      {/* Package Delivered Celebration Modal */}
      <OrderDeliveredModal
        isOpen={isDeliveredModalOpen}
        onClose={() => setIsDeliveredModalOpen(false)}
        orderId={order.orderNumber || order.id}
        riderName={order.rider?.name || 'Babatunde Adeleke'}
        destinationAddress={`${order.delivery?.shippingAddress?.street}, ${order.delivery?.shippingAddress?.city}`}
        totalAmount={order.pricing?.grandTotal || 8400}
      />
    </main>
  );
}

export { OrderTrackingPage };
