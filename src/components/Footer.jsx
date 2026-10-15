import React from 'react';
import {
  Phone, Mail, MapPin, Clock, ShieldCheck, Store, UserCheck, Bike,
  ExternalLink, Heart, Sparkles, CheckCircle2, ChevronRight, HelpCircle,
  MessageCircle, FileText, Lock, Globe, Scale
} from 'lucide-react';

export default function Footer({
  onOpenLegal,
  onOpenCookieSettings,
  onOpenPartnerRegistration,
  onNavigateToMarketRun
}) {
  return (
    <footer
      style={{
        background: 'linear-gradient(180deg, #0B132B 0%, #070B19 100%)',
        color: '#E2E8F0',
        paddingTop: '64px',
        paddingBottom: '32px',
        marginTop: 'auto',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        width: '100%'
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px' }}>
        {/* Top Partner CTA Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(11,79,216,0.3) 0%, rgba(255,107,0,0.2) 100%)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '24px',
            padding: '28px 36px',
            marginBottom: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
            boxShadow: '0 12px 36px rgba(0,0,0,0.3)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', background: '#FF6B00', color: '#FFF', fontWeight: '800', padding: '2px 8px', borderRadius: '10px', textTransform: 'uppercase' }}>
                Join The Network
              </span>
              <span style={{ fontSize: '12px', color: '#CBD5E1', fontWeight: '600' }}>
                Grow your business across Nigeria with Gada Logistics
              </span>
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#FFF' }}>
              Are you a Food Vendor, Store Owner, or Want to be a Hub Agent?
            </h3>
            <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>
              List your catalog on display for free or manage order dispatches from assigned local market hubs.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => onOpenPartnerRegistration('vendor')}
              style={{
                background: '#0B4FD8',
                color: '#FFF',
                border: 'none',
                padding: '12px 22px',
                borderRadius: '14px',
                fontSize: '13px',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(11,79,216,0.4)',
                transition: 'all 0.2s'
              }}
            >
              <Store size={18} />
              <span>Register as Vendor</span>
            </button>

            <button
              onClick={() => onOpenPartnerRegistration('agent')}
              style={{
                background: '#FF6B00',
                color: '#FFF',
                border: 'none',
                padding: '12px 22px',
                borderRadius: '14px',
                fontSize: '13px',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(255,107,0,0.35)',
                transition: 'all 0.2s'
              }}
            >
              <UserCheck size={18} />
              <span>Register as Store Agent</span>
            </button>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '40px',
            marginBottom: '48px'
          }}
        >
          {/* Column 1: Brand & Contact Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <img
                src="/gada-marketplace-logo-white-text.png"
                alt="Gada Marketplace"
                style={{ height: '36px', objectFit: 'contain' }}
              />
            </div>

            <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: '1.6', marginBottom: '20px' }}>
              Hyperlocal marketplace and on-demand delivery logistics connecting local restaurants, supermarkets, and farm markets directly to customer doorsteps in Nigeria with Google Maps precision.
            </p>

            {/* Contact details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} color="#FF6B00" style={{ flexShrink: 0 }} />
                <span>
                  <strong style={{ color: '#FFF' }}>Hotline:</strong>{' '}
                  <a href="tel:09072688238" style={{ color: '#E2E8F0', textDecoration: 'none' }}>09072688238</a>
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={16} color="#60A5FA" style={{ flexShrink: 0 }} />
                <span>
                  <strong style={{ color: '#FFF' }}>Support:</strong>{' '}
                  <a href="mailto:support@gadamarketplace.com" style={{ color: '#E2E8F0', textDecoration: 'none' }}>support@gadamarketplace.com</a>
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong style={{ color: '#FFF' }}>HQ:</strong> 202 Festac Town, Lagos State, Nigeria
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={16} color="#FBBF24" style={{ flexShrink: 0 }} />
                <span>
                  <strong style={{ color: '#FFF' }}>Hours:</strong> 24/7 Operations & Store Agent Dispatch
                </span>
              </div>
            </div>

            {/* Social Media Links */}
            <div style={{ marginTop: '24px' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Follow Our Communities
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                  title="Instagram @gadamarketplace"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>

                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                  title="X (Twitter) @gadamarketplace"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>

                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                  title="Facebook Gada Marketplace"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                  title="LinkedIn Gadatech Integrated Synergy Ltd"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                </a>

                <a
                  href="https://wa.me/2349072688238"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(37,211,102,0.2)', color: '#25D366', border: '1px solid #25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                  title="Chat on WhatsApp (09072688238)"
                >
                  <MessageCircle size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Partners & Ecosystem */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#FFF', marginBottom: '18px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Partners & Ecosystem
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <li>
                <button
                  onClick={() => onOpenPartnerRegistration('vendor')}
                  style={{ color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', textAlign: 'left', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#FFA000'}
                  onMouseLeave={e => e.currentTarget.style.color = '#CBD5E1'}
                >
                  <Store size={15} color="#FFA000" />
                  <span>Register as a Store Vendor</span>
                </button>
              </li>

              <li>
                <button
                  onClick={() => onOpenPartnerRegistration('agent')}
                  style={{ color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', textAlign: 'left', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#60A5FA'}
                  onMouseLeave={e => e.currentTarget.style.color = '#CBD5E1'}
                >
                  <UserCheck size={15} color="#60A5FA" />
                  <span>Register as Store Hub Agent</span>
                </button>
              </li>

              <li>
                <a
                  href="#rider-signup"
                  onClick={(e) => { e.preventDefault(); alert("To join as a delivery courier, download the Gada Rider App from Google Play or Apple App Store and complete verification."); }}
                  style={{ color: '#CBD5E1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Bike size={15} color="#10B981" />
                  <span>Become a Delivery Rider</span>
                </a>
              </li>

              <li>
                <button
                  onClick={onNavigateToMarketRun}
                  style={{ color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', textAlign: 'left' }}
                >
                  <Sparkles size={15} color="#FBBF24" />
                  <span>Market Run Personal Shopper</span>
                </button>
              </li>


            </ul>
          </div>

          {/* Column 3: Legal, Trust & Policies */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#FFF', marginBottom: '18px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Legal & Compliance
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <li>
                <button
                  onClick={() => onOpenLegal('terms')}
                  style={{ color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', textAlign: 'left' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#FFF'}
                  onMouseLeave={e => e.currentTarget.style.color = '#CBD5E1'}
                >
                  <FileText size={15} color="#94A3B8" />
                  <span>Terms & Conditions</span>
                </button>
              </li>

              <li>
                <button
                  onClick={() => onOpenLegal('privacy')}
                  style={{ color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', textAlign: 'left' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#FFF'}
                  onMouseLeave={e => e.currentTarget.style.color = '#CBD5E1'}
                >
                  <Lock size={15} color="#94A3B8" />
                  <span>Privacy Policy</span>
                </button>
              </li>

              <li>
                <button
                  onClick={() => onOpenLegal('cookies')}
                  style={{ color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', textAlign: 'left' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#FFF'}
                  onMouseLeave={e => e.currentTarget.style.color = '#CBD5E1'}
                >
                  <Globe size={15} color="#94A3B8" />
                  <span>Cookies Policy</span>
                </button>
              </li>

              <li>
                <button
                  onClick={onOpenCookieSettings}
                  style={{
                    color: '#60A5FA',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontWeight: '700'
                  }}
                >
                  <span>⚙️ Configure Cookies</span>
                </button>
              </li>

              <li>
                <button
                  onClick={() => onOpenLegal('compliance')}
                  style={{ color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', textAlign: 'left' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#FFF'}
                  onMouseLeave={e => e.currentTarget.style.color = '#CBD5E1'}
                >
                  <ShieldCheck size={15} color="#10B981" />
                  <span>Compliance & Governance</span>
                </button>
              </li>

              <li>
                <button
                  onClick={() => onOpenLegal('dsa')}
                  style={{ color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', textAlign: 'left' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#FFF'}
                  onMouseLeave={e => e.currentTarget.style.color = '#CBD5E1'}
                >
                  <Scale size={15} color="#FBBF24" />
                  <span>Digital Services Act (DSA)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: App Stores & Mobile Download */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#FFF', marginBottom: '18px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Experience On Mobile
            </h4>
            <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: '1.5', marginBottom: '16px' }}>
              Order meals on the go and track riders in real time with our native mobile apps.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Google Play Button */}
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '14px',
                  padding: '10px 16px',
                  color: '#FFF',
                  textDecoration: 'none',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              >
                <svg width="26" height="26" viewBox="0 0 512 512" fill="none">
                  <path d="M47.2 24.2C37.5 34.6 32 50.1 32 69.8v372.4c0 19.7 5.5 35.2 15.2 45.6l2.3 2.2L258 281.5V230.5L49.5 22l-2.3 2.2z" fill="#00E676" />
                  <path d="M331.4 354.9l-73.4-73.4v-51L331.4 157l3.8 2.2 87.2 49.5c24.9 14.1 24.9 37.3 0 51.5l-87.2 49.5-3.8 5.2z" fill="#FFD600" />
                  <path d="M258 281.5L49.5 490c13.7 14.6 36.3 16.3 62.4 1.5l219.5-124.6-73.4-85.4z" fill="#FF3D00" />
                  <path d="M258 230.5l73.4-85.4L111.9 20.5C85.8 5.7 63.2 7.4 49.5 22L258 230.5z" fill="#00B0FF" />
                </svg>
                <div>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#94A3B8', fontWeight: '700' }}>GET IT ON</div>
                  <div style={{ fontSize: '15px', fontWeight: '800', lineHeight: '1.2' }}>Google Play</div>
                </div>
              </a>

              {/* Apple App Store Button */}
              <a
                href="https://www.apple.com/app-store/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '14px',
                  padding: '10px 16px',
                  color: '#FFF',
                  textDecoration: 'none',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              >
                <svg width="26" height="26" viewBox="0 0 170 170" fill="currentColor">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.34-6.3-9.59-11.28-20.73-14.93-33.42-3.66-12.7-5.49-24.81-5.49-36.33 0-14.36 3.65-26.24 10.96-35.65 7.31-9.41 16.56-14.19 27.75-14.35 5.37 0 11.22 1.45 17.54 4.36 6.32 2.91 10.27 4.37 11.85 4.37 1.34 0 5.46-1.48 12.35-4.44 6.89-2.97 12.59-4.27 17.1-3.92 12.65.65 22.84 5.36 30.56 14.15-11.05 6.74-16.45 16.03-16.2 27.86.25 9.25 3.78 17.16 10.59 23.74 6.81 6.58 14.99 10.36 24.54 11.35-2.22 6.54-4.88 13.06-7.98 19.57zM119.22 31.84c0-7.39 2.68-14.36 8.04-20.91 5.36-6.55 12.01-10.53 19.95-11.93.44 1.3.66 2.5.66 3.6 0 7.39-2.73 14.44-8.19 21.14-5.46 6.7-12.27 10.63-20.46 11.78z" />
                </svg>
                <div>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#94A3B8', fontWeight: '700' }}>Download on the</div>
                  <div style={{ fontSize: '15px', fontWeight: '800', lineHeight: '1.2' }}>App Store</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance Statement */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '12px',
            color: '#64748B'
          }}
        >
          <div>
            © {new Date().getFullYear()} <strong>Gadatech Integrated Synergy Ltd</strong>. All rights reserved.
            <span style={{ margin: '0 8px' }}>•</span>
            Registered RC: 7357388 (CAC Nigeria)
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10B981' }}>
              <ShieldCheck size={14} /> NDPR & GDPR Certified
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#60A5FA' }}>
              <Scale size={14} /> DSA Intermediary Compliant
            </span>
            <button
              onClick={onOpenCookieSettings}
              style={{ color: '#94A3B8', textDecoration: 'underline', cursor: 'pointer', background: 'none', border: 'none', fontSize: '12px' }}
            >
              Cookie Preferences
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
