'use client';

import React, { useState } from 'react';
import { Product, Vendor } from '@/types/marketplace';
import { useCartStore } from '@/store/useCartStore';
import { useStoreHours } from '@/hooks/useStoreHours';
import { StoreStatusBadge } from '@/components/vendor/StoreStatusBadge';
import { VendorConflictModal } from '@/components/cart/VendorConflictModal';

interface Props {
  vendor: Vendor;
  products: Product[];
}

export function VendorProductCatalog({ vendor, products }: Props) {
  const { addItem } = useCartStore();
  const { isOpen } = useStoreHours(vendor.operatingHours);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [addedItemMap, setAddedItemMap] = useState<Record<string, boolean>>({});

  const categories = [
    'all',
    ...Array.from(new Set(products.flatMap((p) => (p.categories || []).map((c) => c.name)))),
  ];

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => (p.categories || []).some((c) => c.name === selectedCategory));

  const handleAddToCart = (product: Product) => {
    if (!isOpen) return; // Prevent adding items if store is closed

    const result = addItem(
      {
        productId: product.id,
        vendorId: vendor.id,
        title: product.title,
        unitPrice: product.basePrice,
        quantity: 1,
        image: product.images[0] || 'https://placehold.co/300x300?text=Product',
      },
      {
        vendorId: vendor.id,
        vendorName: vendor.name,
        vendorSlug: vendor.slug,
        city: (vendor.address?.city === 'Lagos' ? 'Lagos' : 'Abuja'),
        operatingHours: vendor.operatingHours,
      }
    );

    if (!result?.conflict) {
      setAddedItemMap((prev) => ({ ...prev, [product.id]: true }));
      setTimeout(() => {
        setAddedItemMap((prev) => ({ ...prev, [product.id]: false }));
      }, 1200);
    }
  };

  return (
    <div className="space-y-6">
      {/* Store Closed Warning Banner */}
      {!isOpen && (
        <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-sm">
          <div className="flex items-center gap-3">
            <span className="text-xl">🌙</span>
            <div>
              <p className="font-bold">{vendor.name} is currently closed.</p>
              <p className="text-xs text-amber-800">
                You can browse the menu, but ordering is disabled until the store opens.
              </p>
            </div>
          </div>
          <StoreStatusBadge operatingHours={vendor.operatingHours} />
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition capitalize ${
              selectedCategory === cat
                ? 'bg-gray-900 text-white'
                : 'bg-white border text-gray-700 hover:bg-gray-100'
            }`}
          >
            {cat === 'all' ? 'All Products' : cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const isButtonDisabled = !product.inStock || !isOpen;

          return (
            <div
              key={product.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                  <img
                    src={product.images[0] || 'https://placehold.co/400x300'}
                    alt={product.title}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                  {!product.inStock ? (
                    <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                      Sold Out
                    </span>
                  ) : !isOpen ? (
                    <span className="absolute top-2 right-2 bg-gray-900/80 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                      Store Closed
                    </span>
                  ) : null}
                </div>

                <div className="p-4 space-y-1.5">
                  <h3 className="font-semibold text-gray-900 line-clamp-1">{product.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center justify-between border-t border-gray-100 mt-2">
                <span className="text-base font-bold text-gray-900">
                  ₦{product.basePrice.toLocaleString()}
                </span>

                <button
                  type="button"
                  onClick={() => handleAddToCart(product)}
                  disabled={isButtonDisabled}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    addedItemMap[product.id]
                      ? 'bg-emerald-600 text-white'
                      : isButtonDisabled
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border'
                      : 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm'
                  }`}
                >
                  {addedItemMap[product.id]
                    ? '✓ Added'
                    : !isOpen
                    ? 'Closed'
                    : !product.inStock
                    ? 'Out of Stock'
                    : 'Add to Cart'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16 bg-white border rounded-xl text-gray-500">
          No products currently available in this category.
        </div>
      )}

      {/* Single-vendor cart conflict prompt */}
      <VendorConflictModal />
    </div>
  );
}

export default VendorProductCatalog;
