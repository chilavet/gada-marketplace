import React, { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';
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
  onOpenPartnerRegistration
}) {
  const [hoveredCard, setHoveredCard] = useState(null);

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
      <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '48px 24px 60px' }}>
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
    </div>
  );
}

