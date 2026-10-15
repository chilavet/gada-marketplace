'use client';

import React from 'react';
import { useCartStore } from '@/store/useCartStore';
import { EmptyCartView } from '@/components/cart/EmptyCartView';
import { CartSummary } from '@/components/CartSummary';

export default function CartPage() {
  const { items } = useCartStore();

  if (items.length === 0) {
    return <EmptyCartView />;
  }

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <CartSummary />
    </main>
  );
}
