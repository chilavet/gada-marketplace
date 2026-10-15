import React from 'react';
import Link from 'next/link';

export function StoreFooter() {
  return (
    <footer className="bg-gray-900 text-gray-400 text-xs border-t border-gray-800 mt-20">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand & Mission */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-white font-extrabold text-base">
            <span className="text-amber-500 text-lg">✦</span>
            <span>Gada Marketplace</span>
          </div>
          <p className="text-gray-400 text-[11px] leading-relaxed">
            The on-demand multi-vendor commerce and rapid delivery ecosystem powered by Gadatech Integrated Synergy Ltd & Gadaride logistics.
          </p>
          <p className="text-gray-500 text-[10px]">
            Lagos Hub: 202 Festac Town, Lagos, Nigeria.
          </p>
        </div>

        {/* Popular Categories */}
        <div className="space-y-2">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider">Marketplace</h4>
          <ul className="space-y-1.5 text-[11px]">
            <li><Link href="/stores" className="hover:text-white transition">All Verified Merchants</Link></li>
            <li><Link href="/category/food" className="hover:text-white transition">Restaurants & Grills</Link></li>
            <li><Link href="/category/groceries" className="hover:text-white transition">Daily Groceries</Link></li>
            <li><Link href="/category/pharmacy" className="hover:text-white transition">Pharmacy & Wellness</Link></li>
          </ul>
        </div>

        {/* Legal & Gateway Compliance */}
        <div className="space-y-2">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider">Compliance & Trust</h4>
          <ul className="space-y-1.5 text-[11px]">
            <li><Link href="/legal/terms" className="hover:text-white transition">Terms of Service</Link></li>
            <li><Link href="/legal/refunds" className="hover:text-white transition">Refund & Cancellation Policy</Link></li>
            <li><Link href="/legal/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
            <li><Link href="/legal/merchant-agreement" className="hover:text-white transition">Vendor Service Agreement</Link></li>
          </ul>
        </div>

        {/* Payment & Security */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider">Secure Settlement</h4>
          <p className="text-[11px] text-gray-400">
            Encrypted transactions verified via Flutterwave. Supports Nigerian Debit Cards, Bank Transfer, and USSD.
          </p>
          <div className="flex items-center space-x-2 text-emerald-400 text-[11px] font-semibold">
            <span>🔒</span>
            <span>256-bit SSL Gateway Verification</span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 py-6 text-center text-[11px] text-gray-500">
        &copy; {new Date().getFullYear()} Gadatech Integrated Synergy Ltd. All rights reserved.
      </div>
    </footer>
  );
}

export default StoreFooter;
