import React, { useState } from 'react';
import { Lock, ArrowRight, Search, X, Sparkles, Smartphone } from 'lucide-react';
import TestimonialsShowcase from './testimonials/TestimonialsShowcase';

const ITEM_GROUPS = [
  {
    id: 'food',
    title: 'Food',
    subtitle: 'Hot Meals, Buka Dishes & Grills',
    icon: '🍲',
    badge: 'Hot & Fresh',
    badgeColor: '#FF6B00',
    itemCount: 'Buka Dishes & Fast Bites',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    description: 'Steaming hot amala and abula, smoky firewood party jollof, fried rice, pounded yam, spicy grilled chicken, suya, shawarma, and fresh snacks.',
    tags: ['Party Jollof Rice', 'Amala & Abula', 'Pounded Yam', 'Grilled Chicken & Suya', 'Chicken Shawarma']
  },
  {
    id: 'pharmacy',
    title: 'Pharmacy',
    subtitle: 'Medications, Wellness & Care',
    icon: '💊',
    badge: 'Health & Care',
    badgeColor: '#0284C7',
    itemCount: 'Medicines & Wellness',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80',
    description: 'Licensed pharmacy essentials: pain relief, cough syrups, multivitamins, first-aid care, wellness products, and baby diapers and wipes.',
    tags: ['Pain Relief & Cold Care', 'Vitamin C & Multivitamins', 'First Aid Supplies', 'Baby Diapers & Wipes', 'Wellness Essentials']
  },
  {
    id: 'market-run',
    title: 'Local Market',
    subtitle: 'Fresh Farm Produce & Tubers',
    icon: '🛍️',
    badge: 'Fresh Farm Produce',
    badgeColor: '#059669',
    itemCount: 'Market Run Errands',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    description: 'Fresh groceries sourced directly from local open-air farm markets: fresh tomatoes, habanero peppers, yam tubers, smoked fish, and local spices.',
    tags: ['Fresh Tomatoes & Peppers', 'Yam Tubers', 'Smoked Fish & Meat', 'Local Cooking Spices', 'Palm Oil & Grains']
  },
  {
    id: 'groceries',
    title: 'Supermarket',
    subtitle: 'Groceries, Household Provisions & Pantry',
    icon: '🛒',
    badge: 'Daily Groceries',
    badgeColor: '#16A34A',
    itemCount: 'Supermarket Provisions',
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80',
    description: 'Stock your kitchen and home: cooking vegetable oils, rice, pasta, noodles, milk, breakfast cereals, toiletries, and household pantry staples.',
    tags: ['Cooking Vegetable Oil', 'Rice & Golden Penny Pasta', 'Indomie Noodles', 'Breakfast Cereals & Milk', 'Toiletries & Essentials']
  }
];

export default function ItemGroupsLanding({
  onOpenAuth,
  currentLocation,
  onOpenLocationModal,
  onSelectGroup,
  onOpenPartnerRegistration,
  searchQuery = '',
  setSearchQuery
}) {
  const [searchInput, setSearchInput] = useState(searchQuery || '');
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleSearchTrigger = (customTerm) => {
    const term = typeof customTerm === 'string' ? customTerm : searchInput;
    if (setSearchQuery) {
      setSearchQuery(term);
    }
    if (onOpenAuth) {
      onOpenAuth(
        'register',
        term.trim()
          ? `Sign up with Google or Email to search for "${term.trim()}" and order from local merchants! 🚀`
          : 'Sign up with Google or Email to search items, compare hub prices, and order! 🚀'
      );
    }
  };

  const handleGroupClick = (group) => {
    if (onSelectGroup) {
      onSelectGroup(group);
    } else if (onOpenAuth) {
      onOpenAuth('register', `Sign up with Google or Email to unlock menus, prices, and items in ${group.title}! 🚀`);
    }
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#F8FAFC' }}>
      {/* GROUPS / TYPES OF ITEMS SECTION */}
      <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '40px 24px 60px' }}>
        {/* HERO SEARCH BAR ON TOP OF CATEGORIES PREVIEW */}
        <div style={{ maxWidth: '780px', margin: '0 auto 40px' }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchTrigger();
            }}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 12px 36px rgba(15, 23, 42, 0.08), 0 2px 6px rgba(15, 23, 42, 0.04)',
              borderRadius: '9999px',
              background: '#FFFFFF',
              border: '2px solid #E2E8F0',
              padding: '6px 8px 6px 20px',
              transition: 'border-color 0.2s, box-shadow 0.2s'
            }}
          >
            <Search size={22} color="#FF6B00" style={{ flexShrink: 0, marginRight: '12px' }} />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search food, pharmacy, local market produce & supermarkets..."
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: 'clamp(14px, 2vw, 16px)',
                fontWeight: '600',
                color: '#0F172A',
                minWidth: '120px'
              }}
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '6px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  marginRight: '6px'
                }}
              >
                <X size={18} />
              </button>
            )}
            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #FF6B00 0%, #FF8533 100%)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '9999px',
                padding: '12px 26px',
                fontSize: '14px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(255, 107, 0, 0.35)',
                flexShrink: 0,
                transition: 'transform 0.15s ease'
              }}
            >
              <span>Search</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Trending Suggestions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '8px',
              marginTop: '16px',
              fontSize: '12px',
              color: '#64748B'
            }}
          >
            <span style={{ fontWeight: '800', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={14} color="#FF6B00" />
              <span>Trending:</span>
            </span>
            {['Party Jollof Rice', 'Amala & Abula', 'Paracetamol', 'Fresh Tomatoes', 'Grilled Chicken', 'Bread'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setSearchInput(tag);
                  handleSearchTrigger(tag);
                }}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '9999px',
                  padding: '4px 12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#334155',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Preview Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div
            style={{
              display: 'inline-block',
              color: '#FF6B00',
              fontWeight: '800',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '6px'
            }}
          >
            CATEGORIES PREVIEW
          </div>
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 32px)', fontWeight: '900', color: '#0F172A' }}>
            Food, Pharmacy, Local Market & Supermarket
          </h2>
          <p style={{ fontSize: '14px', color: '#64748B', maxWidth: '620px', margin: '8px auto 0' }}>
            Click on any category below to sign up with Google or Email and immediately unlock items, menus, and fast courier delivery to your doorstep.
          </p>
        </div>

        {/* The Grid of 4 Categories */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px'
          }}
        >
          {ITEM_GROUPS.map((group) => {
            const isHovered = hoveredCard === group.id;

            return (
              <div
                key={group.id}
                onClick={() => handleGroupClick(group)}
                onMouseEnter={() => setHoveredCard(group.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: isHovered ? '1.5px solid #FF6B00' : '1.5px solid #E2E8F0',
                  boxShadow: isHovered ? '0 16px 36px rgba(255, 107, 0, 0.15)' : '0 4px 14px rgba(0, 0, 0, 0.04)',
                  cursor: 'pointer',
                  transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Image Cover Banner */}
                <div style={{ position: 'relative', height: '170px', width: '100%', overflow: 'hidden' }}>
                  <img
                    src={group.image}
                    alt={group.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                      transition: 'transform 0.4s ease'
                    }}
                    loading="lazy"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.65) 100%)'
                    }}
                  />

                  {/* Top Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: group.badgeColor,
                      color: '#FFF',
                      fontSize: '11px',
                      fontWeight: '800',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}
                  >
                    {group.badge}
                  </div>

                  {/* Items Count Pill */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '12px',
                      background: 'rgba(15, 23, 42, 0.85)',
                      backdropFilter: 'blur(6px)',
                      color: '#FFF',
                      fontSize: '12px',
                      fontWeight: '800',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>{group.icon}</span>
                    <span>{group.itemCount}</span>
                  </div>

                  {/* Locked Overlay Icon */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.9)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isHovered ? '#FF6B00' : '#475569',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Lock size={15} />
                  </div>
                </div>

                {/* Card Content */}
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3
                    style={{
                      fontSize: '17px',
                      fontWeight: '800',
                      color: '#0F172A',
                      marginBottom: '8px',
                      lineHeight: 1.3
                    }}
                  >
                    {group.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '13px',
                      color: '#64748B',
                      lineHeight: 1.5,
                      marginBottom: '16px',
                      flex: 1
                    }}
                  >
                    {group.description}
                  </p>

                  {/* Sample items tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
                    {group.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          background: '#F1F5F9',
                          color: '#334155',
                          padding: '3px 8px',
                          borderRadius: '6px'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                    {group.tags.length > 3 && (
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          background: '#FFF4EC',
                          color: '#FF6B00',
                          padding: '3px 8px',
                          borderRadius: '6px'
                        }}
                      >
                        +{group.tags.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Unlock Button */}
                  <button
                    style={{
                      width: '100%',
                      padding: '11px',
                      borderRadius: '12px',
                      border: 'none',
                      background: isHovered ? '#FF6B00' : '#EFF6FF',
                      color: isHovered ? '#FFF' : '#0B4FD8',
                      fontSize: '13px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Lock size={14} />
                    <span>Sign Up to Unlock Items</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* VENDOR & RIDER TESTIMONIALS */}
      <TestimonialsShowcase
        onOpenAuth={onOpenAuth}
        onOpenPartnerRegistration={onOpenPartnerRegistration}
      />

      {/* DOWNLOAD GADA APP CALLOUT */}
      <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px 64px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #0B192C 0%, #1E293B 100%)',
            borderRadius: '24px',
            padding: '40px 36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
            border: '1px solid #334155'
          }}
        >
          <div style={{ maxWidth: '620px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 12px',
                borderRadius: '9999px',
                background: 'rgba(5, 150, 105, 0.2)',
                border: '1px solid rgba(5, 150, 105, 0.4)',
                color: '#34D399',
                fontSize: '11px',
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '12px'
              }}
            >
              <Smartphone size={13} />
              <span>Now On Google Play</span>
            </div>
            <h3 style={{ fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: '900', color: '#FFF', margin: '0 0 10px 0', lineHeight: 1.25 }}>
              Shop, Order & Track Faster With the Gada App
            </h3>
            <p style={{ fontSize: '14px', color: '#94A3B8', margin: 0, lineHeight: 1.6 }}>
              Get instant dispatch alerts, real-time courier speedometer tracking, and fast payment directly from your Android phone.
            </p>
          </div>

          <div>
            <a
              href="https://play.google.com/store/apps/details?id=com.gadaclient&pcampaignid=web_share"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '14px',
                background: '#FFFFFF',
                color: '#0F172A',
                padding: '12px 22px',
                borderRadius: '16px',
                textDecoration: 'none',
                fontWeight: '800',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                transition: 'transform 0.15s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <svg width="28" height="28" viewBox="0 0 512 512" fill="none">
                <path d="M47.2 24.2C37.5 34.6 32 50.1 32 69.8v372.4c0 19.7 5.5 35.2 15.2 45.6l2.3 2.2L258 281.5V230.5L49.5 22l-2.3 2.2z" fill="#00E676" />
                <path d="M331.4 354.9l-73.4-73.4v-51L331.4 157l3.8 2.2 87.2 49.5c24.9 14.1 24.9 37.3 0 51.5l-87.2 49.5-3.8 5.2z" fill="#FFD600" />
                <path d="M258 281.5L49.5 490c13.7 14.6 36.3 16.3 62.4 1.5l219.5-124.6-73.4-85.4z" fill="#FF3D00" />
                <path d="M258 230.5l73.4-85.4L111.9 20.5C85.8 5.7 63.2 7.4 49.5 22L258 230.5z" fill="#00B0FF" />
              </svg>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#64748B', fontWeight: '700' }}>GET IT ON</div>
                <div style={{ fontSize: '16px', fontWeight: '900', lineHeight: 1.1 }}>Google Play</div>
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

