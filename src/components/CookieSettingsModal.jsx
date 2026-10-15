import React, { useState, useEffect } from 'react';
import { X, Cookie, ShieldCheck, Check, Sparkles, Sliders } from 'lucide-react';

export default function CookieSettingsModal({ isOpen, onClose, onSave }) {
  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem('gada_cookie_preferences');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: false
    };
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleToggle = (key) => {
    if (key === 'necessary') return; // Cannot toggle strictly necessary
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSavePreferences = () => {
    localStorage.setItem('gada_cookie_preferences', JSON.stringify(preferences));
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      if (onSave) onSave(preferences);
      onClose();
    }, 600);
  };

  const handleAcceptAll = () => {
    const allOn = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true
    };
    setPreferences(allOn);
    localStorage.setItem('gada_cookie_preferences', JSON.stringify(allOn));
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      if (onSave) onSave(allOn);
      onClose();
    }, 600);
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 2500 }}>
      <div
        className="modal-card"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '560px',
          width: '95%',
          borderRadius: '24px',
          padding: '0',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            color: '#FFF',
            padding: '24px 28px',
            position: 'relative'
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255,255,255,0.12)',
              color: '#FFF',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,160,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cookie size={20} color="#FFA000" />
            </div>
            <div>
              <span style={{ fontSize: '11px', color: '#FFA000', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Privacy & Data Preferences
              </span>
              <h3 style={{ fontSize: '20px', fontWeight: '800' }}>Configure Cookie Settings</h3>
            </div>
          </div>

          <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '6px', lineHeight: '1.5' }}>
            We use cookies to guarantee security, remember your area preferences, and ensure accurate Google Maps distance calculations. You can customize your preferences below.
          </p>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px 28px', maxHeight: '60vh', overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* 1. Necessary */}
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} color="#16A34A" />
                  <strong style={{ fontSize: '14px', color: '#0F172A' }}>Strictly Necessary Cookies</strong>
                </div>
                <span style={{ fontSize: '11px', background: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: '10px', fontWeight: '800' }}>
                  Always Active
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.5' }}>
                Essential for basic website functions, secure login, authentication tokens, shopping cart persistence, and checkout protection. These cannot be switched off.
              </p>
            </div>

            {/* 2. Functional & Location */}
            <div style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div>
                  <strong style={{ fontSize: '14px', color: '#0F172A' }}>Functional & Google Maps Location</strong>
                  <p style={{ fontSize: '11px', color: '#64748B' }}>Stores neighborhood coordinates for closest-to-farthest item ordering</p>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={preferences.functional}
                    onChange={() => handleToggle('functional')}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: preferences.functional ? '#0B4FD8' : '#CBD5E1',
                      borderRadius: '24px',
                      transition: '0.2s'
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        height: '18px',
                        width: '18px',
                        left: preferences.functional ? '22px' : '3px',
                        bottom: '3px',
                        backgroundColor: '#FFF',
                        borderRadius: '50%',
                        transition: '0.2s'
                      }}
                    />
                  </span>
                </label>
              </div>
              <p style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.5' }}>
                Enables advanced features like remembering your favorite stores, recently viewed items, and custom delivery instructions.
              </p>
            </div>

            {/* 3. Analytics & Performance */}
            <div style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div>
                  <strong style={{ fontSize: '14px', color: '#0F172A' }}>Performance & Analytics</strong>
                  <p style={{ fontSize: '11px', color: '#64748B' }}>Helps us measure site traffic and rider dispatch bottlenecks</p>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={() => handleToggle('analytics')}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: preferences.analytics ? '#0B4FD8' : '#CBD5E1',
                      borderRadius: '24px',
                      transition: '0.2s'
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        height: '18px',
                        width: '18px',
                        left: preferences.analytics ? '22px' : '3px',
                        bottom: '3px',
                        backgroundColor: '#FFF',
                        borderRadius: '50%',
                        transition: '0.2s'
                      }}
                    />
                  </span>
                </label>
              </div>
              <p style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.5' }}>
                Collects aggregated, anonymous data on how visitors interact with the marketplace, allowing us to enhance load times and delivery estimates.
              </p>
            </div>

            {/* 4. Marketing & Notifications */}
            <div style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div>
                  <strong style={{ fontSize: '14px', color: '#0F172A' }}>Promotions & Marketing</strong>
                  <p style={{ fontSize: '11px', color: '#64748B' }}>Tailored discounts for local restaurants and market runs</p>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={() => handleToggle('marketing')}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: preferences.marketing ? '#0B4FD8' : '#CBD5E1',
                      borderRadius: '24px',
                      transition: '0.2s'
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        height: '18px',
                        width: '18px',
                        left: preferences.marketing ? '22px' : '3px',
                        bottom: '3px',
                        backgroundColor: '#FFF',
                        borderRadius: '50%',
                        transition: '0.2s'
                      }}
                    />
                  </span>
                </label>
              </div>
              <p style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.5' }}>
                Used to deliver relevant food offers, free delivery vouchers, and partner deals based on your area.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '18px 28px',
            borderTop: '1px solid #E2E8F0',
            background: '#F8FAFC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}
        >
          <button
            onClick={handleAcceptAll}
            style={{
              padding: '10px 18px',
              borderRadius: '12px',
              border: '1px solid #CBD5E1',
              background: '#FFF',
              color: '#334155',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Accept All
          </button>

          <button
            onClick={handleSavePreferences}
            style={{
              padding: '10px 22px',
              borderRadius: '12px',
              background: savedSuccess ? '#16A34A' : '#0B4FD8',
              color: '#FFF',
              fontWeight: '800',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            {savedSuccess ? (
              <>
                <Check size={16} />
                <span>Preferences Saved!</span>
              </>
            ) : (
              <span>Save My Preferences</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
