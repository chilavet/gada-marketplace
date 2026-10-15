import React, { useState, useMemo } from 'react';
import {
  ArrowLeft, Star, Clock, MapPin, ShieldCheck, Search, Plus, Check,
  ShoppingBag, Sparkles, Phone, Info, Award, Heart, Share2
} from 'lucide-react';

export default function VendorPage({ vendor, onBack, onSelectItem, onAddToCart, cartItems }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchFilter, setSearchFilter] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const menu = vendor?.menu || [];
  const categories = ['All', ...new Set(menu.map(item => item.category || 'General'))];

  const filteredMenu = useMemo(() => {
    return menu.filter(item => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                            (item.description && item.description.toLowerCase().includes(searchFilter.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [menu, activeCategory, searchFilter]);

  if (!vendor) return null;

  const getItemQuantity = (itemId) => {
    const found = cartItems.find(i => i.id === itemId);
    return found ? found.quantity : 0;
  };

  const handleShare = () => {
    const slug = vendor.slug || vendor.id;
    const url = `${window.location.origin}/#store-${slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="vendor-page" style={{ width: '100%', minHeight: '100vh', background: '#F8FAFC' }}>
      {/* Top Breadcrumb & Actions Bar */}
      <div
        style={{
          padding: '14px 32px',
          background: '#FFF',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: '72px',
          zIndex: 100,
          backdropFilter: 'blur(8px)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onBack}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#F1F5F9',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>
              Marketplace Storefront &bull; /store/{vendor.slug || vendor.id}
            </div>
            <div style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A' }}>
              {vendor.name}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handleShare}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              border: '1px solid #E2E8F0',
              background: '#FFF',
              fontSize: '12px',
              fontWeight: '700',
              color: '#334155',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Share2 size={14} />
            <span>{isCopied ? 'Link Copied! ✓' : 'Share Store'}</span>
          </button>
        </div>
      </div>

      {/* Hero Banner Header */}
      <div style={{ position: 'relative', height: '260px', background: '#0F172A', overflow: 'hidden' }}>
        <img
          src={vendor.banner}
          alt={vendor.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.3) 60%, transparent 100%)'
          }}
        />

        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '32px',
            right: '32px',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
            color: '#FFF'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '18px' }}>
            <img
              src={vendor.logo}
              alt={vendor.name}
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '20px',
                border: '3px solid #FFF',
                objectFit: 'cover',
                background: '#FFF',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '26px', fontWeight: '900', letterSpacing: '-0.5px' }}>
                  {vendor.name}
                </h1>
                <span style={{ background: '#10B981', color: '#FFF', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={14} /> Verified Partner
                </span>
              </div>

              <p style={{ fontSize: '13px', color: '#CBD5E1', marginTop: '4px', maxWidth: '600px' }}>
                {vendor.bio || `Top merchant in ${vendor.locationName || 'Ibadan'} offering fresh items, fast logistics prep, and authentic flavors.`}
              </p>

              {/* Vendor Badges Strip */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: '#E2E8F0', marginTop: '8px', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#FCD34D', fontWeight: '700' }}>
                  <Star size={15} fill="#FCD34D" /> {vendor.rating} (500+ reviews)
                </span>
                <span>&bull;</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={15} /> {vendor.deliveryTime || '20-30 mins'}
                </span>
                <span>&bull;</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={15} /> {vendor.address || vendor.locationName}
                </span>
                <span>&bull;</span>
                <span style={{ color: '#86EFAC', fontWeight: '700' }}>
                  Open Today: 8:00 AM - 10:00 PM
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Vendor Content Grid */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px' }}>
        {/* Menu Search & Category Filter Navigation */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '28px',
            flexWrap: 'wrap',
            background: '#FFF',
            padding: '16px 20px',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}
        >
          {/* Categories */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: activeCategory === cat ? '1px solid #FF6B00' : '1px solid #E2E8F0',
                  background: activeCategory === cat ? '#FF6B00' : '#F8FAFC',
                  color: activeCategory === cat ? '#FFF' : '#475569',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search inside menu */}
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder={`Search in ${vendor.name}...`}
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                fontSize: '13px',
                background: '#F8FAFC',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Menu Items Grid */}
        {filteredMenu.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FFF', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔍</div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A' }}>No items found in this section</h3>
            <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>Try switching categories or clearing your search keywords.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {filteredMenu.map(item => {
              const qtyInCart = getItemQuantity(item.id);
              return (
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
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
                  }}
                >
                  <div style={{ position: 'relative', height: '160px', background: '#E2E8F0' }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                      <span style={{ background: 'rgba(15,23,42,0.8)', color: '#FFF', padding: '3px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '700', backdropFilter: 'blur(4px)' }}>
                        ★ {item.rating || 4.8}
                      </span>
                    </div>
                  </div>

                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', lineHeight: '1.3' }}>
                        {item.name}
                      </h4>
                      <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.description}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #F1F5F9' }}>
                      <span style={{ fontSize: '16px', fontWeight: '900', color: '#0F172A' }}>
                        ₦{item.price.toLocaleString()}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart({
                            ...item,
                            vendor: vendor.name,
                            vendorId: vendor.id,
                            locationName: vendor.locationName || vendor.address,
                            quantity: 1,
                            calculatedPrice: item.price
                          });
                        }}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '12px',
                          border: 'none',
                          background: qtyInCart > 0 ? '#10B981' : '#FF6B00',
                          color: '#FFF',
                          fontSize: '12px',
                          fontWeight: '800',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        {qtyInCart > 0 ? (
                          <>
                            <Check size={14} /> {qtyInCart} in Cart
                          </>
                        ) : (
                          <>
                            <Plus size={14} /> Add
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
