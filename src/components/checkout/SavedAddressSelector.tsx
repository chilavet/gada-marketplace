'use client';

import React, { useState } from 'react';
import { Address } from '@/types/marketplace';

const SAMPLE_SAVED_ADDRESSES: Address[] = [
  {
    id: 'addr_home',
    street: '14 Aminu Kano Crescent, Wuse II',
    city: 'Abuja',
    state: 'FCT',
    country: 'Nigeria',
    landmark: 'Opposite KFC',
    isDefault: true,
  },
  {
    id: 'addr_office',
    street: 'Plot 202 Festac Town',
    city: 'Lagos',
    state: 'Lagos',
    country: 'Nigeria',
    landmark: 'Beside First Bank',
    isDefault: false,
  },
];

interface Props {
  onSelectAddress: (address: Address) => void;
}

export function SavedAddressSelector({ onSelectAddress }: Props) {
  const [addresses] = useState<Address[]>(SAMPLE_SAVED_ADDRESSES);
  const [selectedId, setSelectedId] = useState<string>(addresses[0]?.id || '');

  const handleSelect = (addr: Address) => {
    setSelectedId(addr.id);
    onSelectAddress(addr);
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="text-base font-bold text-gray-900">Saved Addresses</h3>
        <span className="text-xs text-amber-600 font-semibold cursor-pointer hover:underline">
          + Add New
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {addresses.map((addr) => {
          const isSelected = selectedId === addr.id;

          return (
            <div
              key={addr.id}
              onClick={() => handleSelect(addr)}
              className={`p-3.5 rounded-xl border text-xs cursor-pointer transition ${
                isSelected
                  ? 'border-amber-500 bg-amber-50/40 ring-1 ring-amber-500'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-gray-900 capitalize">
                  {addr.id.replace('addr_', '')}
                </span>
                {addr.isDefault && (
                  <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">
                    Default
                  </span>
                )}
              </div>
              <p className="text-gray-600 line-clamp-1">{addr.street}</p>
              <p className="text-gray-400 text-[11px] mt-0.5">
                {addr.city}, {addr.state}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SavedAddressSelector;
