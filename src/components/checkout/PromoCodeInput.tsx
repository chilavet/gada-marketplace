'use client';

import React, { useState } from 'react';

export interface DiscountState {
  code: string;
  type: 'percentage' | 'fixed' | 'free_delivery';
  amount: number;
}

interface Props {
  onApplyDiscount: (discount: DiscountState | null) => void;
}

export function PromoCodeInput({ onApplyDiscount }: Props) {
  const [code, setCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountState | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    setErrorMsg(null);
    if (!code.trim()) return;

    setLoading(true);
    // Simulate backend coupon validation
    await new Promise((r) => setTimeout(r, 600));

    const cleanCode = code.trim().toUpperCase();

    if (cleanCode === 'GADAFREE') {
      const discount: DiscountState = { code: cleanCode, type: 'free_delivery', amount: 0 };
      setAppliedDiscount(discount);
      onApplyDiscount(discount);
    } else if (cleanCode === 'GADA500') {
      const discount: DiscountState = { code: cleanCode, type: 'fixed', amount: 500 };
      setAppliedDiscount(discount);
      onApplyDiscount(discount);
    } else if (cleanCode === 'SAVE10') {
      const discount: DiscountState = { code: cleanCode, type: 'percentage', amount: 10 };
      setAppliedDiscount(discount);
      onApplyDiscount(discount);
    } else {
      setErrorMsg('Invalid or expired promotional code.');
    }
    setLoading(false);
  };

  const handleRemove = () => {
    setAppliedDiscount(null);
    setCode('');
    onApplyDiscount(null);
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-2">
      <label className="block text-xs font-bold uppercase text-gray-600">Have a Promo Code?</label>

      {appliedDiscount ? (
        <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900">
          <div className="flex items-center space-x-1.5 font-bold">
            <span>🏷️</span>
            <span>{appliedDiscount.code} Applied</span>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="text-red-600 hover:text-red-800 font-semibold text-xs"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="e.g. GADAFREE"
            className="flex-1 text-xs border border-gray-300 rounded-lg px-3 py-2 uppercase font-medium focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          <button
            type="button"
            onClick={handleApply}
            disabled={loading || !code.trim()}
            className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-lg transition disabled:bg-gray-300"
          >
            {loading ? 'Checking...' : 'Apply'}
          </button>
        </div>
      )}

      {errorMsg && <p className="text-[11px] text-red-600 font-medium">{errorMsg}</p>}
    </div>
  );
}

export default PromoCodeInput;
