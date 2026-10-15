import React, { useState } from 'react';
import { X, FileText, Shield, Lock, Scale, CheckCircle2, Globe, Printer, ChevronRight } from 'lucide-react';

export default function LegalModal({ isOpen, onClose, initialDocument = 'terms' }) {
  const [activeDoc, setActiveDoc] = useState(initialDocument); // 'terms' | 'privacy' | 'cookies' | 'compliance' | 'dsa'
  if (!isOpen) return null;

  const documents = [
    { id: 'terms', title: 'Terms & Conditions', icon: <FileText size={16} /> },
    { id: 'privacy', title: 'Privacy Policy', icon: <Lock size={16} /> },
    { id: 'cookies', title: 'Cookies Policy', icon: <Globe size={16} /> },
    { id: 'compliance', title: 'Compliance & Governance', icon: <Shield size={16} /> },
    { id: 'dsa', title: 'Digital Services Act (DSA)', icon: <Scale size={16} /> }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 2600 }}>
      <div
        className="modal-card"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '860px',
          width: '95%',
          height: '85vh',
          borderRadius: '24px',
          padding: '0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* Top Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            color: '#FFF',
            padding: '20px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/gada-marketplace-logo-white-text.png" alt="Gada Marketplace" style={{ height: '24px', objectFit: 'contain' }} />
            <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.15)', padding: '2px 8px', borderRadius: '8px', fontWeight: '800' }}>
              Legal & Trust Center
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handlePrint}
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: '#FFF',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
              title="Print current document"
            >
              <Printer size={14} />
              <span>Print</span>
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.15)',
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
          </div>
        </div>

        {/* Modal Layout: Sidebar + Document Content */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Sidebar */}
          <div
            style={{
              width: '240px',
              borderRight: '1px solid #E2E8F0',
              background: '#F8FAFC',
              padding: '16px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              flexShrink: 0
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', padding: '4px 10px 8px', letterSpacing: '0.5px' }}>
              Legal Framework
            </span>

            {documents.map(doc => {
              const isActive = activeDoc === doc.id;
              return (
                <button
                  key={doc.id}
                  onClick={() => setActiveDoc(doc.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: isActive ? '800' : '600',
                    color: isActive ? '#0B4FD8' : '#334155',
                    background: isActive ? '#EFF6FF' : 'transparent',
                    border: isActive ? '1px solid #BFDBFE' : '1px solid transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {doc.icon}
                    <span>{doc.title}</span>
                  </div>
                  {isActive && <ChevronRight size={14} color="#0B4FD8" />}
                </button>
              );
            })}

            <div style={{ marginTop: 'auto', padding: '12px', background: '#FFF', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '11px', color: '#64748B' }}>
              <strong>Last Updated:</strong><br />
              October 2026<br />
              <span style={{ color: '#0B4FD8' }}>Version 2.4 (Active)</span>
            </div>
          </div>

          {/* Document Content View */}
          <div style={{ flex: 1, padding: '28px 36px', overflowY: 'auto', lineHeight: '1.7', color: '#334155' }}>
            {/* 1. TERMS & CONDITIONS */}
            {activeDoc === 'terms' && (
              <div>
                <span style={{ fontSize: '12px', background: '#EFF6FF', color: '#0B4FD8', fontWeight: '800', padding: '2px 8px', borderRadius: '8px' }}>
                  Terms of Service & Delivery Contract
                </span>
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', margin: '8px 0 16px' }}>
                  Gada Marketplace & Logistics Terms and Conditions
                </h2>
                <p style={{ fontSize: '14px', marginBottom: '16px' }}>
                  Welcome to Gada Marketplace & Logistics ("Gada", "we", "us", or "our"). These Terms and Conditions govern your use of the Gada customer website, mobile applications, marketplace services, and on-demand delivery ecosystem.
                </p>

                <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', marginTop: '20px', marginBottom: '8px' }}>
                  1. The Gada Three-Tier Logistics Ecosystem
                </h4>
                <p style={{ fontSize: '13px', marginBottom: '14px' }}>
                  Gada operates an integrated delivery network comprising:
                  (a) <strong>The Customer Website/App</strong> for browsing local catalog items, ordering food, groceries, and dispatching Market Runs;
                  (b) <strong>Assigned Store Hub Agents</strong> who receive confirmed customer orders at assigned markets or merchant hubs and dispatch them to available couriers;
                  (c) <strong>Authorized Delivery Riders</strong> who pick up packages from vendors and transport them to the customer doorstep.
                </p>

                <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', marginTop: '20px', marginBottom: '8px' }}>
                  2. User Registration & Account Security
                </h4>
                <p style={{ fontSize: '13px', marginBottom: '14px' }}>
                  Customers must provide accurate contact and location information upon registration. You are solely responsible for safeguarding your credentials, phone verification codes, and wallet transactions.
                </p>

                <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', marginTop: '20px', marginBottom: '8px' }}>
                  3. Pricing, Delivery Fees & Distance Calculations
                </h4>
                <p style={{ fontSize: '13px', marginBottom: '14px' }}>
                  Prices displayed on the website are set by participating vendors or prevailing market rates. Delivery fees are dynamically determined by Google Maps distance calculations from the fulfilling store hub to your designated address. A base delivery fee of ₦450 applies, plus ₦140 per kilometer.
                </p>

                <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', marginTop: '20px', marginBottom: '8px' }}>
                  4. Market Run Errands
                </h4>
                <p style={{ fontSize: '13px', marginBottom: '14px' }}>
                  When requesting a Market Run, an authorized personal shopping agent will visit the market specified in your request. The fixed agent service fee is ₦1,500. The agent will contact you by telephone to confirm prevailing prices before making purchases with your allocated budget.
                </p>

                <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', marginTop: '20px', marginBottom: '8px' }}>
                  5. Cancellations & Refunds
                </h4>
                <p style={{ fontSize: '13px', marginBottom: '14px' }}>
                  Orders may be cancelled free of charge before the store or vendor begins meal preparation. Once an agent has assigned a rider or food has been packaged, delivery costs may not be refundable. Quality claims or damaged item reports must be lodged within 2 hours of handover.
                </p>
              </div>
            )}

            {/* 2. PRIVACY POLICY */}
            {activeDoc === 'privacy' && (
              <div>
                <span style={{ fontSize: '12px', background: '#DCFCE7', color: '#166534', fontWeight: '800', padding: '2px 8px', borderRadius: '8px' }}>
                  Data Protection & Privacy
                </span>
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', margin: '8px 0 16px' }}>
                  Gada Privacy Policy & Data Usage
                </h2>
                <p style={{ fontSize: '14px', marginBottom: '16px' }}>
                  Gadatech Integrated Synergy Ltd is dedicated to safeguarding your personal information in strict compliance with the Nigeria Data Protection Act (NDPA) and global data protection standards (GDPR).
                </p>

                <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', marginTop: '20px', marginBottom: '8px' }}>
                  1. Information We Collect
                </h4>
                <p style={{ fontSize: '13px', marginBottom: '14px' }}>
                  We collect information necessary to fulfill your orders, including:
                  (a) Contact details (Full Name, Phone Number, Email Address);
                  (b) Exact Delivery Location coordinates (GPS latitude and longitude obtained via Google Maps API with your permission);
                  (c) Transaction records, wallet top-ups, and order history;
                  (d) Device metadata and browser attributes for fraud prevention.
                </p>

                <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', marginTop: '20px', marginBottom: '8px' }}>
                  2. Use of Google Maps & Real-Time Geolocation
                </h4>
                <p style={{ fontSize: '13px', marginBottom: '14px' }}>
                  Your geolocation is processed in real time to calculate distances to the nearest vendor hubs and ensure couriers navigate to your doorstep. We never sell your location history to advertisers or third-party data brokers.
                </p>

                <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', marginTop: '20px', marginBottom: '8px' }}>
                  3. Sharing of Information with Logistics Partners
                </h4>
                <p style={{ fontSize: '13px', marginBottom: '14px' }}>
                  When you place an order, your delivery address, recipient name, and contact telephone number are shared exclusively with the assigned Store Hub Agent and the dispatched Rider for the sole purpose of fulfillment.
                </p>

                <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', marginTop: '20px', marginBottom: '8px' }}>
                  4. Your Rights
                </h4>
                <p style={{ fontSize: '13px', marginBottom: '14px' }}>
                  You have the right to inspect, correct, export, or request deletion of your personal data at any time by contacting <strong>privacy@gadamarketplace.com</strong>.
                </p>
              </div>
            )}

            {/* 3. COOKIES POLICY */}
            {activeDoc === 'cookies' && (
              <div>
                <span style={{ fontSize: '12px', background: '#FEF3C7', color: '#92400E', fontWeight: '800', padding: '2px 8px', borderRadius: '8px' }}>
                  Cookie Framework
                </span>
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', margin: '8px 0 16px' }}>
                  Gada Cookies & Tracking Policy
                </h2>
                <p style={{ fontSize: '14px', marginBottom: '16px' }}>
                  This policy outlines how Gada Marketplace utilizes cookies, web storage, and related tracking technologies across our web properties.
                </p>

                <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', marginTop: '20px', marginBottom: '8px' }}>
                  1. What Are Cookies?
                </h4>
                <p style={{ fontSize: '13px', marginBottom: '14px' }}>
                  Cookies are small data files placed on your browser or device when visiting our website. They enable session continuity, remember your neighborhood location, and preserve shopping cart items across visits.
                </p>

                <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', marginTop: '20px', marginBottom: '8px' }}>
                  2. Types of Cookies We Deploy
                </h4>
                <ul style={{ fontSize: '13px', paddingLeft: '20px', marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li><strong>Strictly Necessary:</strong> Required for user authentication, security, and cart preservation.</li>
                  <li><strong>Functional Cookies:</strong> Stores your active location choice, address labels, and filter settings.</li>
                  <li><strong>Performance & Analytics:</strong> Aggregated anonymous stats to measure delivery speed and website responsiveness.</li>
                  <li><strong>Third-Party (Google Maps):</strong> Loads maps, road topography, and distance estimations.</li>
                </ul>

                <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', marginTop: '20px', marginBottom: '8px' }}>
                  3. Managing Your Cookies
                </h4>
                <p style={{ fontSize: '13px', marginBottom: '14px' }}>
                  You can modify your preferences at any time by clicking <strong>"Configure Cookies"</strong> in the footer of this website, or through your browser's security settings.
                </p>
              </div>
            )}

            {/* 4. COMPLIANCE & GOVERNANCE */}
            {activeDoc === 'compliance' && (
              <div>
                <span style={{ fontSize: '12px', background: '#F1F5F9', color: '#334155', fontWeight: '800', padding: '2px 8px', borderRadius: '8px' }}>
                  Regulatory & Corporate Governance
                </span>
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', margin: '8px 0 16px' }}>
                  Compliance & Regulatory Standards
                </h2>
                <p style={{ fontSize: '14px', marginBottom: '16px' }}>
                  Gada operates in full conformance with Nigerian corporate laws, transportation standards, commerce guidelines, and consumer protection protocols.
                </p>

                <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', marginTop: '20px', marginBottom: '8px' }}>
                  1. Corporate Registration & Licensing
                </h4>
                <p style={{ fontSize: '13px', marginBottom: '14px' }}>
                  Gada Marketplace & Logistics is an enterprise operating under Gadatech Integrated Synergy Ltd, registered with the Corporate Affairs Commission (CAC) of the Federal Republic of Nigeria.
                </p>

                <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', marginTop: '20px', marginBottom: '8px' }}>
                  2. Food Safety & Hygiene Standards
                </h4>
                <p style={{ fontSize: '13px', marginBottom: '14px' }}>
                  All culinary partners and restaurants onboarded to Gada are verified for sanitation, kitchen safety, and regulatory compliance with NAFDAC and local food safety inspectorships. Couriers utilize insulated, hygienic delivery cases for meal protection.
                </p>

                <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', marginTop: '20px', marginBottom: '8px' }}>
                  3. Anti-Money Laundering (AML) & KYC
                </h4>
                <p style={{ fontSize: '13px', marginBottom: '14px' }}>
                  In accordance with financial regulations, wallet transactions and high-value payments undergo automated monitoring. Store Agents and high-volume merchant vendors must undergo identity verification (NIN / CAC).
                </p>

                <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', marginTop: '20px', marginBottom: '8px' }}>
                  4. Fair Labor & Courier Welfare
                </h4>
                <p style={{ fontSize: '13px', marginBottom: '14px' }}>
                  Riders operating on the Gada Logistics Network receive competitive delivery payouts, safety gear, dispatch support, and direct access to assigned Store Hub Agents for on-the-road assistance.
                </p>
              </div>
            )}

            {/* 5. DIGITAL SERVICES ACT (DSA) */}
            {activeDoc === 'dsa' && (
              <div>
                <span style={{ fontSize: '12px', background: '#F0FDF4', color: '#15803D', fontWeight: '800', padding: '2px 8px', borderRadius: '8px' }}>
                  Digital Services Act (EU 2022/2065 & International Standards)
                </span>
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', margin: '8px 0 16px' }}>
                  Digital Services Act (DSA) Compliance Statement
                </h2>
                <p style={{ fontSize: '14px', marginBottom: '16px' }}>
                  This section provides information required under Regulation (EU) 2022/2065 (Digital Services Act - DSA) and equivalent transparent intermediary standards.
                </p>

                <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', marginTop: '20px', marginBottom: '8px' }}>
                  1. Single Points of Contact
                </h4>
                <p style={{ fontSize: '13px', marginBottom: '8px' }}>
                  Pursuant to Articles 11 and 12 of the DSA, Gada has designated single points of contact:
                </p>
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '14px', fontSize: '13px', marginBottom: '14px' }}>
                  <p><strong>For Authorities:</strong> <code>legal@gadamarketplace.com</code> (Languages: English)</p>
                  <p style={{ marginTop: '4px' }}><strong>For Recipients of Service (Customers & Vendors):</strong> <code>support@gadamarketplace.com</code> or +234 812 345 6789</p>
                </div>

                <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', marginTop: '20px', marginBottom: '8px' }}>
                  2. Notice and Action Mechanism (Illegal Products / Content)
                </h4>
                <p style={{ fontSize: '13px', marginBottom: '14px' }}>
                  Under Article 16 of the DSA, any individual or entity can submit a notice concerning illegal items, expired products, counterfeit goods, or prohibited pharmaceutical listings by emailing <strong>notices@gadamarketplace.com</strong>. Gada will review and take down infringing items within 12 hours.
                </p>

                <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', marginTop: '20px', marginBottom: '8px' }}>
                  3. Recommender Systems Transparency
                </h4>
                <p style={{ fontSize: '13px', marginBottom: '14px' }}>
                  Our customer catalog ranks items based on objective criteria:
                  (a) <strong>Physical Distance:</strong> Proximity of fulfilling store hub to customer coordinates via Google Maps;
                  (b) <strong>Estimated Preparation & Delivery Time:</strong> Fastest fulfillment;
                  (c) <strong>Customer Feedback:</strong> Verified ratings and reviews;
                  (d) <strong>Category relevance:</strong> Explicit category selection (Rice, Swallow, Snacks, etc.).
                </p>

                <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', marginTop: '20px', marginBottom: '8px' }}>
                  4. Out-of-Court Dispute Settlement
                </h4>
                <p style={{ fontSize: '13px', marginBottom: '14px' }}>
                  Customers and vendors who are dissatisfied with moderation decisions have the right to engage in certified dispute settlement mechanisms or lodge arbitration in accordance with applicable consumer protection protocols.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
