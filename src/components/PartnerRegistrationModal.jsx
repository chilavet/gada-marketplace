import React, { useState } from 'react';
import { X, Store, UserCheck, CheckCircle2, Building2, MapPin, Phone, Mail, Clock, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
export default function PartnerRegistrationModal({ isOpen, onClose, initialTab = 'vendor', onSuccess }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'vendor' | 'agent'
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // Vendor form fields
  const [vendorForm, setVendorForm] = useState({
    businessName: '',
    category: 'Restaurant & Hot Meals',
    ownerName: '',
    phone: '',
    email: '',
    address: '',
    area: 'Bodija',
    operatingHours: '8:00 AM - 10:00 PM',
    estimatedDailyOrders: '10 - 30 orders',
    deliveryReadiness: 'Ready for immediate dispatch'
  });

  // Agent form fields
  const [agentForm, setAgentForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    preferredHub: 'Bodija Market Hub',
    residentArea: '',
    experienceYears: '1-3 years',
    assignedRidersCount: '1 - 5 riders',
    idType: 'National ID (NIN)',
    guarantorPhone: ''
  });

  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleVendorSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!vendorForm.businessName.trim() || !vendorForm.ownerName.trim() || !vendorForm.phone.trim()) {
      setError('Please fill in all mandatory business and contact details.');
      return;
    }

    const application = {
      id: `VEND-APP-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'vendor',
      ...vendorForm,
      submittedAt: new Date().toISOString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem('gada_vendor_applications') || '[]');
      existing.push(application);
      localStorage.setItem('gada_vendor_applications', JSON.stringify(existing));
    } catch {}

    setSubmittedData(application);
    setSubmitted(true);
    if (onSuccess) onSuccess('Vendor application submitted successfully! 🏪');
  };

  const handleAgentSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!agentForm.fullName.trim() || !agentForm.phone.trim() || !agentForm.preferredHub.trim()) {
      setError('Please fill in your full name, phone number, and hub preference.');
      return;
    }

    const application = {
      id: `AGENT-APP-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'agent',
      ...agentForm,
      submittedAt: new Date().toISOString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem('gada_agent_applications') || '[]');
      existing.push(application);
      localStorage.setItem('gada_agent_applications', JSON.stringify(existing));
    } catch {}

    setSubmittedData(application);
    setSubmitted(true);
    if (onSuccess) onSuccess('Agent application received! Our onboarding team will contact you. 👔');
  };

  const handleReset = () => {
    setSubmitted(false);
    setSubmittedData(null);
    setError('');
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 2500 }}>
      <div
        className="modal-card"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '680px',
          width: '95%',
          borderRadius: '24px',
          padding: '0',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* Header Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0B4FD8 0%, #1D4ED8 100%)',
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', background: 'rgba(255,160,0,0.2)', color: '#FFA000', border: '1px solid #FFA000', padding: '2px 8px', borderRadius: '10px', fontWeight: '800', textTransform: 'uppercase' }}>
              Gada Partner Network
            </span>
          </div>

          <h3 style={{ fontSize: '22px', fontWeight: '800' }}>Grow With Gada Marketplace & Logistics</h3>
          <p style={{ fontSize: '13px', color: '#BFDBFE', marginTop: '4px' }}>
            Expand your restaurant/store sales or operate a dedicated store dispatch hub in your area.
          </p>

          {/* Tab Switcher */}
          {!submitted && (
            <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
              <button
                type="button"
                onClick={() => { setActiveTab('vendor'); handleReset(); }}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  background: activeTab === 'vendor' ? '#FFF' : 'rgba(255,255,255,0.15)',
                  color: activeTab === 'vendor' ? '#0B4FD8' : '#FFF',
                  transition: 'all 0.2s'
                }}
              >
                <Store size={16} />
                <span>🏪 Register as Vendor / Store</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('agent'); handleReset(); }}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  background: activeTab === 'agent' ? '#FFF' : 'rgba(255,255,255,0.15)',
                  color: activeTab === 'agent' ? '#0B4FD8' : '#FFF',
                  transition: 'all 0.2s'
                }}
              >
                <UserCheck size={16} />
                <span>👔 Register as Store Agent</span>
              </button>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px 28px', maxHeight: '65vh', overflowY: 'auto' }}>
          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', padding: '12px', color: '#B91C1C', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '20px 10px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <CheckCircle2 size={36} />
              </div>
              <h4 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A' }}>
                {submittedData?.type === 'vendor' ? 'Vendor Application Submitted!' : 'Agent Application Submitted!'}
              </h4>
              <p style={{ fontSize: '13px', color: '#64748B', marginTop: '6px', maxWidth: '440px', margin: '6px auto 0' }}>
                Your reference number is <strong>#{submittedData?.id}</strong>. Our partnership team will review your application and contact you within 24 business hours to inspect and activate your account.
              </p>

              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '16px', marginTop: '20px', textAlign: 'left', maxWidth: '440px', margin: '20px auto 0' }}>
                <p style={{ fontSize: '12px', color: '#475569', marginBottom: '6px' }}>
                  <strong>Applicant:</strong> {submittedData?.businessName || submittedData?.fullName}
                </p>
                <p style={{ fontSize: '12px', color: '#475569', marginBottom: '6px' }}>
                  <strong>Contact Phone:</strong> {submittedData?.phone}
                </p>
                <p style={{ fontSize: '12px', color: '#475569' }}>
                  <strong>Assigned Area/Hub:</strong> {submittedData?.area || submittedData?.preferredHub}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    background: '#0B4FD8',
                    color: '#FFF',
                    padding: '10px 24px',
                    borderRadius: '12px',
                    fontWeight: '800',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Done & Return
                </button>
              </div>
            </div>
          ) : activeTab === 'vendor' ? (
            /* VENDOR FORM */
            <form onSubmit={handleVendorSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Business / Restaurant Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mama Put Deluxe, Cocoa Mall Bakery"
                    value={vendorForm.businessName}
                    onChange={e => setVendorForm({ ...vendorForm, businessName: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Store Category *
                  </label>
                  <select
                    value={vendorForm.category}
                    onChange={e => setVendorForm({ ...vendorForm, category: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', background: '#FFF' }}
                  >
                    <option value="Restaurant & Hot Meals">Restaurant & Hot Meals</option>
                    <option value="Supermarket & Groceries">Supermarket & Groceries</option>
                    <option value="Bakery & Pastries">Bakery & Pastries</option>
                    <option value="Pharmacy & Health">Pharmacy & Health</option>
                    <option value="Drinks & Beverages">Drinks & Beverages</option>
                    <option value="Fresh Market Farm Produce">Fresh Market Farm Produce</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Owner / Manager Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Adebayo Alabi"
                    value={vendorForm.ownerName}
                    onChange={e => setVendorForm({ ...vendorForm, ownerName: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Contact Phone Number (WhatsApp Enabled) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+234 801 234 5678"
                    value={vendorForm.phone}
                    onChange={e => setVendorForm({ ...vendorForm, phone: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Store Address / Landmark *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shop 4, Bodija Market Road, Ibadan"
                    value={vendorForm.address}
                    onChange={e => setVendorForm({ ...vendorForm, address: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Neighborhood / Area *
                  </label>
                  <select
                    value={vendorForm.area}
                    onChange={e => setVendorForm({ ...vendorForm, area: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', background: '#FFF' }}
                  >
                    <option value="Bodija">Bodija Estate / Market</option>
                    <option value="Ring Road">Ring Road / Challenge</option>
                    <option value="Dugbe">Dugbe / Cocoa House Axis</option>
                    <option value="UI / Samonda">UI / Samonda / Agbowo</option>
                    <option value="Jericho">Jericho GRA / Onireke</option>
                    <option value="Oluyole">Oluyole Estate</option>
                    <option value="Akobo">Akobo / Basorun</option>
                    <option value="Iwo Road">Iwo Road</option>
                    <option value="Mokola">Mokola Roundabout</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Business Email
                  </label>
                  <input
                    type="email"
                    placeholder="vendor@example.com"
                    value={vendorForm.email}
                    onChange={e => setVendorForm({ ...vendorForm, email: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Operating Hours
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 8:00 AM - 10:00 PM"
                    value={vendorForm.operatingHours}
                    onChange={e => setVendorForm({ ...vendorForm, operatingHours: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '12px', fontSize: '12px', color: '#1E40AF', lineHeight: '1.5' }}>
                💡 <strong>Zero Onboarding Fee:</strong> Joining Gada Marketplace is 100% free. We connect you with local customers and provide automatic rider dispatch from assigned hub agents.
              </div>

              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #0B4FD8 0%, #1D4ED8 100%)',
                  color: '#FFF',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  fontWeight: '800',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(11,79,216,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '6px'
                }}
              >
                <Store size={18} />
                <span>Submit Vendor Application</span>
              </button>
            </form>
          ) : (
            /* AGENT FORM */
            <form onSubmit={handleAgentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Agent Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Babatunde Ogunlesi"
                    value={agentForm.fullName}
                    onChange={e => setAgentForm({ ...agentForm, fullName: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Phone Number (WhatsApp Active) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+234 802 345 6789"
                    value={agentForm.phone}
                    onChange={e => setAgentForm({ ...agentForm, phone: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Preferred Dispatch Hub / Market *
                  </label>
                  <select
                    value={agentForm.preferredHub}
                    onChange={e => setAgentForm({ ...agentForm, preferredHub: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', background: '#FFF' }}
                  >
                    <option value="Bodija Market Hub">Bodija Market & Estate Hub</option>
                    <option value="Ring Road Hub">Ring Road & Palms Mall Hub</option>
                    <option value="Dugbe Commercial Hub">Dugbe Commercial Hub</option>
                    <option value="Aleshinloye Hub">Aleshinloye Market Hub</option>
                    <option value="UI / Samonda Hub">UI & Agbowo Transit Hub</option>
                    <option value="Sango Market Hub">Sango Food Market Hub</option>
                    <option value="Oja Oba Hub">Oja Oba Central Hub</option>
                    <option value="Challenge Express Hub">Challenge Express Hub</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Your Residential Address / Area *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sango, Ibadan"
                    value={agentForm.residentArea}
                    onChange={e => setAgentForm({ ...agentForm, residentArea: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Identity Verification Document *
                  </label>
                  <select
                    value={agentForm.idType}
                    onChange={e => setAgentForm({ ...agentForm, idType: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', background: '#FFF' }}
                  >
                    <option value="National ID (NIN)">National Identity Number (NIN)</option>
                    <option value="Voters Card">Permanent Voter's Card (PVC)</option>
                    <option value="Drivers License">Driver's License</option>
                    <option value="International Passport">International Passport</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Riders Managed / Affiliated
                  </label>
                  <select
                    value={agentForm.assignedRidersCount}
                    onChange={e => setAgentForm({ ...agentForm, assignedRidersCount: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', background: '#FFF' }}
                  >
                    <option value="Individual Operator (1 rider)">Individual Operator (1 rider)</option>
                    <option value="Small Team (2 - 5 riders)">Small Team (2 - 5 riders)</option>
                    <option value="Fleet Hub (6 - 15 riders)">Fleet Hub (6 - 15 riders)</option>
                    <option value="Major Logistics Partner (15+ riders)">Major Logistics Partner (15+ riders)</option>
                  </select>
                </div>
              </div>

              <div style={{ background: '#FFF4EC', border: '1px solid #FFD8BE', borderRadius: '12px', padding: '12px', fontSize: '12px', color: '#9A3412', lineHeight: '1.5' }}>
                👔 <strong>What Store Agents Do:</strong> Agents receive incoming customer marketplace orders for their assigned store/market hub and dispatch them directly to available riders via the Gada Rider & Agent App.
              </div>

              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #FF6B00 0%, #E05D00 100%)',
                  color: '#FFF',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  fontWeight: '800',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(255,107,0,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '6px'
                }}
              >
                <UserCheck size={18} />
                <span>Submit Store Agent Registration</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
