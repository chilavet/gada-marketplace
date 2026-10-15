import React, { useState } from 'react';
import { ShoppingBag, Search, MapPin, User, LogOut, Package, Wallet, ChevronDown, Sparkles, LogIn } from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  cartCount,
  onOpenCart,
  searchQuery,
  setSearchQuery,
  currentUser,
  onOpenAuth,
  onLogout,
  currentLocation,
  onOpenLocationModal
}) {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-content">
        {/* Brand Logo */}
        <div className="brand-logo" onClick={() => setActiveTab('home')} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <img
            src="/gada-marketplace-logo-transparent.png"
            alt="Gada Marketplace"
            style={{
              height: '38px',
              objectFit: 'contain'
            }}
          />
        </div>

        {/* Location Picker */}
        <div
          className="location-picker"
          onClick={onOpenLocationModal}
          title="Click to view Google Map and change delivery location"
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <MapPin size={16} color={currentLocation?.isGPS ? '#16A34A' : '#0B4FD8'} />
          <span style={{ fontWeight: '700', color: '#0F172A', maxWidth: '170px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {currentLocation?.shortName || currentLocation?.name || 'Ring Road, Ibadan'}
          </span>
          <span
            style={{
              fontSize: '10px',
              background: currentLocation?.isGPS ? '#DCFCE7' : '#EFF6FF',
              color: currentLocation?.isGPS ? '#15803D' : '#0B4FD8',
              padding: '2px 8px',
              borderRadius: '12px',
              fontWeight: '800'
            }}
          >
            {currentLocation?.isGPS ? 'Google Maps' : 'Change'}
          </span>
        </div>

        {/* Search Bar */}
        <div className="search-bar-wrap">
          <Search size={18} className="search-icon-inside" />
          <input
            type="text"
            className="search-input"
            placeholder="Search items on display, groceries, restaurants, hubs..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (activeTab !== 'search' && e.target.value.trim() !== '') {
                setActiveTab('search');
              }
            }}
          />
        </div>

        {/* Nav Actions */}
        <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Cart Button */}
          <button className="icon-btn" onClick={onOpenCart} title="View Cart">
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="badge-count">{cartCount}</span>}
          </button>

          {/* User Auth Section */}
          {currentUser ? (
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Wallet Pill */}
                <button
                  className="icon-btn"
                  style={{ width: 'auto', padding: '0 12px', borderRadius: '20px', gap: '6px', fontSize: '13px', fontWeight: '700' }}
                  onClick={() => setActiveTab('profile')}
                  title="Wallet Balance"
                >
                  <span>💳</span>
                  <span>₦{(currentUser.walletBalance || 0).toLocaleString()}</span>
                </button>

                {/* Profile Pill Button */}
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '4px 10px 4px 6px',
                    borderRadius: '24px',
                    background: activeTab === 'profile' ? '#FFF4EC' : '#F1F5F9',
                    border: activeTab === 'profile' ? '1px solid #FF6B00' : '1px solid #E2E8F0',
                    cursor: 'pointer'
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#FF6B00',
                      color: '#FFF',
                      fontSize: '12px',
                      fontWeight: '800',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {currentUser.avatar || 'CU'}
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A', maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} color="#64748B" />
                </button>
              </div>

              {/* Dropdown Menu */}
              {showUserDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    top: '46px',
                    right: 0,
                    width: '220px',
                    background: '#FFF',
                    borderRadius: '16px',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                    border: '1px solid #E2E8F0',
                    padding: '8px',
                    zIndex: 200,
                    animation: 'fadeIn 0.2s ease'
                  }}
                  onMouseLeave={() => setShowUserDropdown(false)}
                >
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid #F1F5F9', marginBottom: '6px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>{currentUser.name}</div>
                    <div style={{ fontSize: '11px', color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.email}</div>
                  </div>

                  <button
                    onClick={() => { setActiveTab('profile'); setShowUserDropdown(false); }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#334155',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <User size={15} color="#FF6B00" /> My Profile & Wallet
                  </button>

                  <button
                    onClick={() => { setActiveTab('profile'); setShowUserDropdown(false); }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#334155',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <Package size={15} color="#3B82F6" /> Orders & Delivery History
                  </button>

                  <div style={{ height: '1px', background: '#F1F5F9', margin: '4px 0' }} />

                  <button
                    onClick={() => { onLogout(); setShowUserDropdown(false); }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#EF4444',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#FEF2F2'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button
                onClick={() => onOpenAuth('login')}
                className="primary-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 18px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                <LogIn size={15} />
                <span>Sign In</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
