'use client';

import React, { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { ACTIVE_ZONES, DeliveryZone } from '@/types/zones';

interface DeliveryZoneSelectorProps {
  vendorSupportedZoneIds?: string[]; // If omitted or empty, all city zones are considered available
  vendorCity?: 'Lagos' | 'Abuja';
  onZoneSelected: (zone: DeliveryZone | null, isDeliverable: boolean) => void;
}

export function DeliveryZoneSelector({
  vendorSupportedZoneIds = [],
  vendorCity = 'Lagos',
  onZoneSelected,
}: DeliveryZoneSelectorProps) {
  const { setDeliveryZoneFee } = useCartStore();
  const [selectedCity, setSelectedCity] = useState<'Lagos' | 'Abuja'>(vendorCity);
  const [selectedZoneId, setSelectedZoneId] = useState<string>('');
  const [zoneStatus, setZoneStatus] = useState<{
    zone: DeliveryZone | null;
    isDeliverable: boolean;
    errorMsg?: string;
  }>({
    zone: null,
    isDeliverable: false,
  });

  // Filter available zones by city
  const cityZones = ACTIVE_ZONES.filter((z) => z.city === selectedCity);

  useEffect(() => {
    if (!selectedZoneId) {
      setZoneStatus({ zone: null, isDeliverable: false });
      onZoneSelected(null, false);
      return;
    }

    const matchedZone = ACTIVE_ZONES.find((z) => z.id === selectedZoneId) || null;

    if (!matchedZone) {
      setZoneStatus({ zone: null, isDeliverable: false, errorMsg: 'Unknown zone selected.' });
      onZoneSelected(null, false);
      return;
    }

    // Check if the current vendor services this zone
    const isSupported =
      vendorSupportedZoneIds.length === 0 ||
      vendorSupportedZoneIds.includes(matchedZone.id);

    if (isSupported) {
      // Update delivery fee directly in Zustand store
      setDeliveryZoneFee(matchedZone.baseFee);
      setZoneStatus({
        zone: matchedZone,
        isDeliverable: true,
      });
      onZoneSelected(matchedZone, true);
    } else {
      // Vendor does not deliver here
      setZoneStatus({
        zone: matchedZone,
        isDeliverable: false,
        errorMsg: `This vendor does not currently deliver to ${matchedZone.name}. Please select a closer zone or another vendor.`,
      });
      onZoneSelected(matchedZone, false);
    }
  }, [selectedZoneId, vendorSupportedZoneIds, setDeliveryZoneFee, onZoneSelected]);

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <h3 className="text-base font-bold text-gray-900">Select Delivery Area</h3>
          <p className="text-xs text-gray-500">Delivery fees are calculated by Gadaride operational zones</p>
        </div>

        {/* City Toggle */}
        <div className="flex bg-gray-100 p-0.5 rounded-lg text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setSelectedCity('Lagos');
              setSelectedZoneId('');
            }}
            className={`px-3 py-1 rounded-md transition ${
              selectedCity === 'Lagos'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Lagos
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedCity('Abuja');
              setSelectedZoneId('');
            }}
            className={`px-3 py-1 rounded-md transition ${
              selectedCity === 'Abuja'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Abuja
          </button>
        </div>
      </div>

      {/* Zone Dropdown */}
      <div>
        <label className="block text-xs font-semibold uppercase text-gray-600 mb-1.5">
          Delivery Neighborhood / Zone
        </label>
        <select
          value={selectedZoneId}
          onChange={(e) => setSelectedZoneId(e.target.value)}
          className="w-full border rounded-xl px-3.5 py-2.5 text-sm bg-gray-50/50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none transition"
        >
          <option value="">-- Choose your neighborhood --</option>
          {cityZones.map((zone) => {
            const isSupported =
              vendorSupportedZoneIds.length === 0 ||
              vendorSupportedZoneIds.includes(zone.id);

            return (
              <option key={zone.id} value={zone.id}>
                {zone.name} {!isSupported ? '(Outside Vendor Range)' : `— ₦${zone.baseFee.toLocaleString()}`}
              </option>
            );
          })}
        </select>
      </div>

      {/* Deliverable Confirmation Badge */}
      {zoneStatus.isDeliverable && zoneStatus.zone && (
        <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
          <div className="flex items-center space-x-2">
            <span className="h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
              ✓
            </span>
            <div>
              <p className="font-semibold">{zoneStatus.zone.name}</p>
              <p className="text-emerald-700">Estimated delivery: {zoneStatus.zone.estimatedMinutes}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="font-bold text-sm text-emerald-950">
              ₦{zoneStatus.zone.baseFee.toLocaleString()}
            </span>
            <p className="text-[10px] text-emerald-700">Dispatch Fee</p>
          </div>
        </div>
      )}

      {/* Out of Range Warning */}
      {!zoneStatus.isDeliverable && zoneStatus.errorMsg && (
        <div className="flex items-start space-x-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800">
          <span className="text-red-500 font-bold text-base leading-none">⚠</span>
          <p className="leading-relaxed">{zoneStatus.errorMsg}</p>
        </div>
      )}
    </div>
  );
}

export default DeliveryZoneSelector;
