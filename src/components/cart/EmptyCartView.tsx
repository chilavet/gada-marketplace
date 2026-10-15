'use client';

import React from 'react';
import Link from 'next/link';

interface PopularCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  itemCountDesc: string;
}

interface FeaturedStore {
  id: string;
  name: string;
  slug: string;
  category: string;
  rating: number;
  deliveryTime: string;
  image: string;
  isOpen: boolean;
}

const POPULAR_CATEGORIES: PopularCategory[] = [
  { id: 'cat_food', name: 'Restaurants & Grills', slug: 'restaurants-grills', icon: '🍲', itemCountDesc: '40+ spots' },
  { id: 'cat_groceries', name: 'Groceries & Fresh', slug: 'groceries-fresh', icon: '🥦', itemCountDesc: 'Same-day delivery' },
  { id: 'cat_pharmacy', name: 'Pharmacy & Health', slug: 'pharmacy-health', icon: '💊', itemCountDesc: 'Express 25 mins' },
  { id: 'cat_drinks', name: 'Drinks & Liquors', slug: 'drinks-liquors', icon: '🍾', itemCountDesc: 'Chilled delivery' },
];

const OPEN_STORES: FeaturedStore[] = [
  {
    id: 'store_01',
    name: 'Tastia Restaurant & Bakery',
    slug: 'tastia-restaurant-wuse',
    category: 'African & Continental',
    rating: 4.8,
    deliveryTime: '20-35 mins',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
    isOpen: true,
  },
  {
    id: 'store_02',
    name: 'Mega Mart Supermarket',
    slug: 'mega-mart-groceries',
    category: 'Daily Groceries & Staples',
    rating: 4.7,
    deliveryTime: '30-45 mins',
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400',
    isOpen: true,
  },
  {
    id: 'store_03',
    name: 'KFC Express Delivery',
    slug: 'kfc-express',
    category: 'Fast Food & Combos',
    rating: 4.5,
    deliveryTime: '25-40 mins',
    image: 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=400',
    isOpen: true,
  },
];

export function EmptyCartView() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-12 animate-fade-in">
      {/* Central Illustration & Call to Action */}
      <div className="bg-white border border-gray-100 rounded-3xl p-8 sm:p-12 text-center shadow-sm max-w-xl mx-auto space-y-6">
        {/* Animated Bag / Cart Visual */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-amber-50 flex items-center justify-center text-4xl shadow-inner border border-amber-100">
            🛍️
          </div>
          <span className="absolute -top-1 -right-1 flex h-6 w-6">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-6 w-6 bg-amber-500 text-white text-[11px] font-bold items-center justify-center">
              0
            </span>
          </span>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Your shopping basket is empty
          </h2>
          <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
            Looks like you haven't selected anything yet. Pick a verified store to discover fresh meals, groceries, and daily essentials.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/stores"
            className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm shadow-sm hover:shadow transition duration-150"
          >
            Browse All Stores
          </Link>
          <Link
            href="/deals"
            className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-800 font-semibold text-sm border border-gray-200 transition duration-150"
          >
            Today's Top Offers
          </Link>
        </div>
      </div>

      {/* Explore Popular Categories Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Explore by Category</h3>
          <Link href="/categories" className="text-xs font-semibold text-amber-600 hover:text-amber-700">
            View all &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {POPULAR_CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-amber-300 hover:shadow-md transition duration-200 flex flex-col justify-between"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">
                {category.icon}
              </div>
              <div>
                <p className="font-bold text-sm text-gray-900 group-hover:text-amber-600 transition-colors">
                  {category.name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{category.itemCountDesc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Stores Currently Open */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Stores Open Near You</h3>
            <p className="text-xs text-gray-500">Dispatched promptly via Gadaride logistics</p>
          </div>
          <Link href="/stores?filter=open" className="text-xs font-semibold text-amber-600 hover:text-amber-700">
            See all open &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {OPEN_STORES.map((store) => (
            <Link
              key={store.id}
              href={`/store/${store.slug}`}
              className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-200 flex flex-col"
            >
              <div className="relative h-40 w-full bg-gray-100 overflow-hidden">
                <img
                  src={store.image}
                  alt={store.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white shadow-sm flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                  Open Now
                </span>
                <span className="absolute bottom-2.5 right-2.5 px-2 py-1 rounded-lg text-xs font-bold bg-black/60 text-white backdrop-blur-sm">
                  ⏱ {store.deliveryTime}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-sm text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                      {store.name}
                    </h4>
                    <span className="text-xs font-bold text-amber-600 flex items-center shrink-0">
                      ★ {store.rating}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{store.category}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-amber-600">
                  <span>Start Order</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EmptyCartView;
