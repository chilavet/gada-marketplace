'use client';

import React from 'react';
import { useStoreHours } from '@/hooks/useStoreHours';
import { VendorOperatingHours } from '@/types/marketplace';

interface Props {
  operatingHours?: VendorOperatingHours[];
  className?: string;
}

export function StoreStatusBadge({ operatingHours, className = '' }: Props) {
  const { isOpen, statusText, colorClass } = useStoreHours(operatingHours);

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${colorClass} ${className}`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
        }`}
      />
      <span>{statusText}</span>
    </div>
  );
}

export default StoreStatusBadge;
