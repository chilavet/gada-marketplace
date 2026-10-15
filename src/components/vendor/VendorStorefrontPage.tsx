import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { vendorService } from '@/services/vendorService';
import { VendorProductCatalog } from '@/components/vendor/VendorProductCatalog';
import { StoreStatusBadge } from '@/components/vendor/StoreStatusBadge';

interface PageProps {
  params: Promise<{ vendorSlug: string }>;
}

// Generate dynamic OpenGraph SEO metadata for Google and social previews
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { vendorSlug } = await params;
  const res = await vendorService.getVendorBySlug(vendorSlug);
  const vendor = res.data;

  if (!vendor) {
    return { title: 'Store Not Found | Marketplace' };
  }

  return {
    title: `${vendor.name} - Order Online | Marketplace`,
    description: vendor.description || `Browse products and order online from ${vendor.name}.`,
    openGraph: {
      title: `${vendor.name} | Fast Delivery`,
      description: vendor.description,
      images: vendor.bannerUrl ? [{ url: vendor.bannerUrl }] : [],
    },
  };
}

export default async function VendorStorefrontPage({ params }: PageProps) {
  const { vendorSlug } = await params;
  
  const [vendorRes, productsRes] = await Promise.all([
    vendorService.getVendorBySlug(vendorSlug),
    vendorService.getVendorProducts(vendorSlug),
  ]);

  const vendor = vendorRes.data;
  const products = productsRes.data || [];

  if (!vendor) {
    notFound();
  }

  return (
    <main className="max-w-6xl mx-auto py-6 px-4 space-y-8">
      {/* Hero Header & Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gray-900 border shadow-sm">
        <div className="h-56 sm:h-72 w-full relative">
          <img
            src={vendor.bannerUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200'}
            alt={vendor.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>

        {/* Vendor Bio Details */}
        <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-xl bg-white border-2 border-white overflow-hidden shadow-lg shrink-0">
              <img
                src={vendor.logoUrl || 'https://placehold.co/150x150?text=Store'}
                alt={vendor.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold">{vendor.name}</h1>
                {vendor.isVerified && (
                  <span className="bg-emerald-500 text-white rounded-full p-0.5 text-[10px]" title="Verified Merchant">
                    ✓
                  </span>
                )}
                <StoreStatusBadge operatingHours={vendor.operatingHours} className="bg-white/90 backdrop-blur-md" />
              </div>
              <p className="text-xs sm:text-sm text-gray-200 line-clamp-1 max-w-xl">
                {vendor.address.street}, {vendor.address.city}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-center">
              <span className="text-amber-400 font-bold text-sm">★ {vendor.rating.toFixed(1)}</span>
              <span className="text-[11px] text-gray-300 ml-1">({vendor.ratingCount} reviews)</span>
            </div>
            {vendor.phone && (
              <a
                href={`tel:${vendor.phone}`}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 rounded-lg text-xs font-semibold text-white transition"
              >
                Call Store
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Catalog View */}
      <section className="space-y-4">
        <div className="border-b pb-3">
          <h2 className="text-xl font-bold text-gray-900">Store Menu & Catalog</h2>
          <p className="text-xs text-gray-500">Pick items to add directly to your multi-vendor cart.</p>
        </div>

        <VendorProductCatalog vendor={vendor} products={products} />
      </section>
    </main>
  );
}
