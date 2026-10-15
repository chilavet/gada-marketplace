import React, { useState, useEffect, useMemo } from 'react';
import { CATEGORIES, PROMO_BANNERS, POPULAR_ITEMS, VENDORS } from '../data/marketplaceData';
import { locationService, POPULAR_LOCATIONS } from '../services/locationService';
import { catalogApi } from '../api';
import {
  Star, Clock, ArrowRight, Heart, Plus, ShoppingBag, ShieldCheck,
  Sparkles, MapPin, Navigation, SlidersHorizontal, ArrowDownUp, Compass,
  Search, Check, Filter, X, ChevronDown, Loader2
} from 'lucide-react';

export default function HomePage({
  selectedCategory,
  setSelectedCategory,
  onSelectItem,
  onSelectVendor,
  onNavigateToMarketRun,
  onAddToCart,
  currentLocation,
  onSelectLocation,
  onOpenLocationModal
}) {
  const [vendorCategory, setVendorCategory] = useState('All');
  const [favorites, setFavorites] = useState({});
  const [sortBy, setSortBy] = useState('closest'); // 'closest' | 'rating' | 'fastest' | 'price_asc' | 'price_desc'
  const [searchKeyword, setSearchKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(20000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [productsData, setProductsData] = useState({ data: [], total: 0, hasMore: false });
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Debounce search input (350ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(searchKeyword);
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchKeyword]);

  // Fetch paginated products from catalogApi with debounced keyword & filters
  useEffect(() => {
    let isMounted = true;
    setIsLoadingProducts(true);

    catalogApi.getProducts({
      query: debouncedKeyword,
      category: selectedCategory,
      minRating,
      maxPrice,
      inStockOnly,
      sortBy,
      currentLocation,
      page: currentPage,
      limit: 12
    })
      .then(res => {
        if (!isMounted) return;
        setProductsData(res);
      })
      .catch(err => {
        console.warn('Catalog search error:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingProducts(false);
      });

    return () => { isMounted = false; };
  }, [debouncedKeyword, selectedCategory, minRating, maxPrice, inStockOnly, sortBy, currentLocation, currentPage]);

  const toggleFav = (id, e) => {
    e.stopPropagation();
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const currentCategoryObj = CATEGORIES.find(c => c.id === selectedCategory) || { id: 'all', name: 'All Items', icon: '🍽️' };

  // Dynamically enrich vendors with real-time distance and sort closest to farthest
  const vendorsWithDistance = useMemo(() => {
    const enriched = locationService.enrichVendorsWithLocation(VENDORS, currentLocation);

    const filtered = enriched.filter(v => {
      if (vendorCategory === 'All') return true;
      return v.category === vendorCategory;
    });

    return filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }, [currentLocation, vendorCategory]);

  return (
    <div className="home-page-container" style={{ width: '100%', minHeight: '100vh', background: '#F8FAFC' }}>
      {/* Category Navigation Pills */}
      <div className="categories-bar" style={{ background: '#FFF', borderBottom: '1px solid #E2E8F0', padding: '14px 32px' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`category-pill ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategory(cat.id);
                setCurrentPage(1);
                if (cat.id === 'market-run') {
                  onNavigateToMarketRun();
                }
              }}
              style={{
                padding: '8px 16px',
                borderRadius: '24px',
                border: selectedCategory === cat.id ? '1px solid #FF6B00' : '1px solid #E2E8F0',
                background: selectedCategory === cat.id ? '#FF6B00' : '#FFF',
                color: selectedCategory === cat.id ? '#FFF' : '#334155',
                fontWeight: '700',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
              {cat.badge && (
                <span style={{ fontSize: '10px', background: '#FFF', color: '#0B4FD8', padding: '1px 6px', borderRadius: '10px', fontWeight: '800' }}>
                  {cat.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="main-content" style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 32px' }}>
        {/* Promotional Hero Banners */}
        <div className="banners-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {PROMO_BANNERS.map(b => (
            <div
              key={b.id}
              style={{
                borderRadius: '24px',
                background: b.bgGradient,
                padding: '24px 28px',
                color: '#FFF',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '160px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
              }}
            >
              <div>
                <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: '12px', fontWeight: '800', textTransform: 'uppercase' }}>
                  {b.tag}
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: '900', marginTop: '10px', lineHeight: '1.2' }}>{b.title}</h3>
                <p style={{ fontSize: '12px', opacity: 0.9, marginTop: '4px', maxWidth: '75%' }}>{b.subtitle}</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px' }}>
                <span style={{ fontSize: '13px', fontWeight: '800', background: '#FFF', color: '#0F172A', padding: '4px 12px', borderRadius: '12px' }}>
                  {b.discount}
                </span>
                {b.id === 1 && (
                  <button
                    onClick={onNavigateToMarketRun}
                    style={{ background: 'rgba(255,255,255,0.25)', border: 'none', color: '#FFF', padding: '6px 14px', borderRadius: '12px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <span>Request Errand</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Search, Filter Bar & Sort Controls */}
        <div
          style={{
            background: '#FFF',
            padding: '16px 20px',
            borderRadius: '20px',
            border: '1px solid #E2E8F0',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}
        >
          {/* Debounced Search Bar */}
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Search catalog by food, grocery item, or merchant..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 16px 11px 42px',
                borderRadius: '14px',
                border: '1.5px solid #E2E8F0',
                fontSize: '13px',
                boxSizing: 'border-box'
              }}
            />
            {searchKeyword && (
              <button
                onClick={() => setSearchKeyword('')}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowDownUp size={15} color="#64748B" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1px solid #CBD5E1',
                  background: '#F8FAFC',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#334155',
                  cursor: 'pointer'
                }}
              >
                <option value="closest">Sort: Closest to Me 📍</option>
                <option value="rating">Sort: Highest Rated ★</option>
                <option value="fastest">Sort: Fastest Delivery ⚡</option>
                <option value="price_asc">Sort: Price (Low to High)</option>
                <option value="price_desc">Sort: Price (High to Low)</option>
              </select>
            </div>

            {/* Filter Drawer Toggle */}
            <button
              onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
              style={{
                padding: '10px 16px',
                borderRadius: '12px',
                border: isFilterDrawerOpen ? '1px solid #FF6B00' : '1px solid #CBD5E1',
                background: isFilterDrawerOpen ? '#FFF4EC' : '#FFF',
                color: isFilterDrawerOpen ? '#FF6B00' : '#334155',
                fontSize: '13px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <Filter size={15} />
              <span>Filters {minRating > 0 || maxPrice < 20000 || inStockOnly ? '• Active' : ''}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Filters Panel (Collapsible) */}
        {isFilterDrawerOpen && (
          <div
            style={{
              background: '#FFF',
              border: '1px solid #E2E8F0',
              borderRadius: '20px',
              padding: '20px 24px',
              marginBottom: '28px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px',
              animation: 'fadeIn 0.2s ease'
            }}
          >
            {/* Price Filter */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700', marginBottom: '8px' }}>
                <span>Max Price</span>
                <span style={{ color: '#FF6B00' }}>₦{maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={1000}
                max={30000}
                step={500}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#FF6B00' }}
              />
            </div>

            {/* Rating Filter */}
            <div>
              <span style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px' }}>Minimum Rating</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[0, 4.0, 4.5, 4.8].map(r => (
                  <button
                    key={r}
                    onClick={() => setMinRating(r)}
                    style={{
                      flex: 1,
                      padding: '6px',
                      borderRadius: '8px',
                      border: minRating === r ? '1px solid #FF6B00' : '1px solid #CBD5E1',
                      background: minRating === r ? '#FF6B00' : '#F8FAFC',
                      color: minRating === r ? '#FFF' : '#334155',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {r === 0 ? 'All' : `${r}★+`}
                  </button>
                ))}
              </div>
            </div>

            {/* In-Stock Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '16px' }}>
              <input
                type="checkbox"
                id="stockCheck"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                style={{ accentColor: '#10B981', width: '18px', height: '18px' }}
              />
              <label htmlFor="stockCheck" style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A', cursor: 'pointer' }}>
                Only Show In-Stock Items
              </label>
            </div>

            {/* Reset Filters */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setMaxPrice(20000);
                  setMinRating(0);
                  setInStockOnly(false);
                  setSearchKeyword('');
                }}
                style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#F8FAFC', fontSize: '12px', fontWeight: '700', color: '#64748B', cursor: 'pointer' }}
              >
                Reset All Filters
              </button>
            </div>
          </div>
        )}

        {/* SECTION: Catalog Products Grid */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#0F172A' }}>
                {debouncedKeyword ? `Search Results for "${debouncedKeyword}"` : currentCategoryObj.name}
              </h2>
              <p style={{ fontSize: '13px', color: '#64748B' }}>
                Showing {productsData.data.length} of {productsData.total} items
              </p>
            </div>
          </div>

          {/* Loading Skeletons */}
          {isLoadingProducts ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                <div key={n} style={{ background: '#FFF', borderRadius: '20px', height: '280px', border: '1px solid #E2E8F0', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ width: '100%', height: '140px', background: '#E2E8F0', borderRadius: '14px', animation: 'pulse 1.5s infinite' }} />
                  <div style={{ width: '60%', height: '16px', background: '#E2E8F0', borderRadius: '8px' }} />
                  <div style={{ width: '90%', height: '12px', background: '#F1F5F9', borderRadius: '6px' }} />
                  <div style={{ width: '40%', height: '18px', background: '#E2E8F0', borderRadius: '8px', marginTop: 'auto' }} />
                </div>
              ))}
            </div>
          ) : productsData.data.length === 0 ? (
            /* Empty State */
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FFF', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔎</div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A' }}>No matching items found</h3>
              <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
                Try adjusting your price range, clearing keywords, or switching categories.
              </p>
            </div>
          ) : (
            /* Products Grid */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
              {productsData.data.map(item => (
                <div
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  style={{
                    background: '#FFF',
                    borderRadius: '20px',
                    border: '1px solid #E2E8F0',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.02)';
                  }}
                >
                  <div style={{ position: 'relative', height: '160px', background: '#E2E8F0' }}>
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      onClick={(e) => toggleFav(item.id, e)}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.9)',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <Heart size={16} fill={favorites[item.id] ? '#EF4444' : 'none'} color={favorites[item.id] ? '#EF4444' : '#64748B'} />
                    </button>
                    {item.tag && (
                      <span style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(15,23,42,0.85)', color: '#FFF', padding: '3px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '800' }}>
                        {item.tag}
                      </span>
                    )}
                  </div>

                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#FF6B00', fontWeight: '700', textTransform: 'uppercase' }}>
                        {item.vendor}
                      </div>
                      <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', marginTop: '2px', lineHeight: '1.3' }}>
                        {item.name}
                      </h4>
                      <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.description}
                      </p>
                    </div>

                    <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '16px', fontWeight: '900', color: '#0F172A' }}>
                        ₦{item.price.toLocaleString()}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart({ ...item, quantity: 1, calculatedPrice: item.price });
                        }}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '12px',
                          border: 'none',
                          background: '#FF6B00',
                          color: '#FFF',
                          fontSize: '12px',
                          fontWeight: '800',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        <Plus size={14} /> Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {productsData.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '32px' }}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                style={{ padding: '8px 16px', borderRadius: '12px', border: '1px solid #CBD5E1', background: '#FFF', fontSize: '13px', fontWeight: '700', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
              >
                Previous
              </button>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                Page {currentPage} of {productsData.totalPages}
              </span>
              <button
                disabled={!productsData.hasMore}
                onClick={() => setCurrentPage(p => p + 1)}
                style={{ padding: '8px 16px', borderRadius: '12px', border: '1px solid #CBD5E1', background: '#FFF', fontSize: '13px', fontWeight: '700', cursor: !productsData.hasMore ? 'not-allowed' : 'pointer' }}
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* SECTION: Featured Verified Vendors */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#0F172A' }}>
                Verified Partner Vendors
              </h2>
              <p style={{ fontSize: '13px', color: '#64748B' }}>
                Sorted by closest distance to your area in Ibadan
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {vendorsWithDistance.map(vendor => (
              <div
                key={vendor.id}
                onClick={() => onSelectVendor(vendor)}
                style={{
                  background: '#FFF',
                  borderRadius: '20px',
                  border: '1px solid #E2E8F0',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.02)';
                }}
              >
                <div style={{ position: 'relative', height: '140px', background: '#CBD5E1' }}>
                  <img src={vendor.banner} alt={vendor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: '10px', left: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={vendor.logo} alt="" style={{ width: '48px', height: '48px', borderRadius: '12px', border: '2px solid #FFF', objectFit: 'cover', background: '#FFF' }} />
                    <span style={{ fontSize: '15px', fontWeight: '900', color: '#FFF', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                      {vendor.name}
                    </span>
                  </div>
                </div>

                <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: '#64748B' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#D97706', fontWeight: '800' }}>
                    <Star size={14} fill="#D97706" /> {vendor.rating}
                  </span>
                  <span>&bull;</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} /> {vendor.deliveryTime}
                  </span>
                  <span>&bull;</span>
                  <span style={{ color: '#0B4FD8', fontWeight: '700' }}>
                    📍 {vendor.distance || 1.5} km away
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
