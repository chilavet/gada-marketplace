'use client';

import React, { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { CartSummary } from '@/components/CartSummary';
import { FlutterwaveCheckoutButton } from '@/components/checkout/FlutterwaveCheckoutButton';
import { DeliveryZoneSelector } from '@/components/checkout/DeliveryZoneSelector';
import { DeliveryZone } from '@/types/zones';
import { useStoreHours } from '@/hooks/useStoreHours';
import { EmptyCartView } from '@/components/cart/EmptyCartView';
import { DeliveryScheduleToggle, ScheduleSelection } from '@/components/checkout/DeliveryScheduleToggle';
import { SavedAddressSelector } from '@/components/checkout/SavedAddressSelector';
import { Address } from '@/types/marketplace';
import { PromoCodeInput, DiscountState } from '@/components/checkout/PromoCodeInput';

export default function CheckoutPage() {
  const { items, activeVendor } = useCartStore();
  const { isOpen: isStoreCurrentlyOpen } = useStoreHours(activeVendor?.operatingHours);

  const [isDeliverable, setIsDeliverable] = useState(false);
  const [selectedDeliveryZone, setSelectedDeliveryZone] = useState<DeliveryZone | null>(null);
  const [schedule, setSchedule] = useState<ScheduleSelection>({ type: 'now' });
  const [appliedPromo, setAppliedPromo] = useState<DiscountState | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    city: 'Lagos',
    state: 'Lagos',
    notes: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddressSelect = (addr: Address) => {
    setFormData((prev) => ({
      ...prev,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      notes: addr.landmark ? `Landmark: ${addr.landmark}` : prev.notes,
    }));
  };

  if (items.length === 0) {
    return <EmptyCartView />;
  }

  return (
    <main className="max-w-6xl mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-12 gap-8">
      {/* Customer & Delivery Form */}
      <div className="md:col-span-7 space-y-6">
        {/* Saved Addresses Quick Selection */}
        <SavedAddressSelector onSelectAddress={handleAddressSelect} />

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Delivery Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="08012345678"
                className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
              Email Address (for receipt)
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          {/* Operational Delivery Zone Selector */}
          <DeliveryZoneSelector
            vendorCity={((activeVendor as any)?.city as 'Lagos' | 'Abuja') || 'Lagos'}
            // Pass supported zone IDs from the current active vendor (if returned by backend API)
            vendorSupportedZoneIds={
              ((activeVendor as any)?.supportedZoneIds) || ['zone_festac', 'zone_surulere', 'zone_ikeja']
            }
            onZoneSelected={(zone, deliverable) => {
              setSelectedDeliveryZone(zone);
              setIsDeliverable(deliverable);
              if (zone) {
                setFormData((prev) => ({
                  ...prev,
                  city: zone.city,
                  state: zone.city === 'Abuja' ? 'FCT' : 'Lagos',
                }));
              }
            }}
          />

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
              Street Delivery Address
            </label>
            <input
              type="text"
              name="street"
              required
              value={formData.street}
              onChange={handleChange}
              placeholder={
                selectedDeliveryZone
                  ? `House / Street address in ${selectedDeliveryZone.name}`
                  : 'e.g. 14 Aminu Kano Crescent, Wuse II'
              }
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          {/* Delivery Timing & Scheduling */}
          <DeliveryScheduleToggle
            onScheduleChange={(selection) => setSchedule(selection)}
          />

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
              Rider Delivery Instructions
            </label>
            <textarea
              name="notes"
              rows={2}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Gate code, landmark, or specific drop-off notes"
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Cart Summary & Flutterwave Trigger */}
      <div className="md:col-span-5 space-y-6">
        <CartSummary />

        {/* Promo / Voucher Code Input */}
        <PromoCodeInput onApplyDiscount={(d) => setAppliedPromo(d)} />

        {!isStoreCurrentlyOpen && activeVendor && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
            <span className="text-base">🌙</span>
            <span>
              <strong>{activeVendor.vendorName}</strong> is currently closed. Checkout will re-enable during opening hours.
            </span>
          </div>
        )}

        <FlutterwaveCheckoutButton
          email={formData.email}
          fullName={formData.fullName}
          phone={formData.phone}
          shippingAddressId={selectedDeliveryZone?.id || ''}
          deliveryNotes={
            [
              schedule.type === 'scheduled' && schedule.scheduledTime ? `[SCHEDULED: ${schedule.scheduledTime}]` : '',
              appliedPromo ? `[PROMO: ${appliedPromo.code}]` : '',
              formData.notes,
            ].filter(Boolean).join(' ').trim()
          }
          // Disabled if out of zone OR store is closed OR form fields empty
          disabled={
            !isDeliverable ||
            !isStoreCurrentlyOpen ||
            !formData.fullName ||
            !formData.email ||
            !formData.phone
          }
        />
      </div>
    </main>
  );
}
