import React, { useState, useMemo } from 'react';
import { MARKETS } from '../data/marketplaceData';
import { ShoppingBag, MapPin, Plus, Trash2, CheckCircle2, Sparkles, AlertCircle, ArrowLeft, Search, Store, X, Check } from 'lucide-react';

export default function MarketRunPage({ onBack, onSubmitMarketRun }) {
  const [selectedMarket, setSelectedMarket] = useState(MARKETS[0]);
  const [marketSearchQuery, setMarketSearchQuery] = useState(MARKETS[0].name);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [itemsList, setItemsList] = useState([
    { id: 1, text: '5kg Fresh Jos Tomatoes & Tatashe mix' },
    { id: 2, text: '2 Tubers of Benue Yam' },
    { id: 3, text: '1 Litre Pure Red Palm Oil' }
  ]);
  const [newItemText, setNewItemText] = useState('');
  const [estimatedBudget, setEstimatedBudget] = useState(15000);
  const [instructions, setInstructions] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Filter matching markets based on search query
  const searchResults = useMemo(() => {
    if (!marketSearchQuery.trim()) return MARKETS;
    return MARKETS.filter(m =>
      m.name.toLowerCase().includes(marketSearchQuery.toLowerCase()) ||
      m.location.toLowerCase().includes(marketSearchQuery.toLowerCase())
    );
  }, [marketSearchQuery]);

  const handleSelectMarket = (market) => {
    setSelectedMarket(market);
    setMarketSearchQuery(market.name);
    setIsSearchFocused(false);
  };

  const handleCustomMarketSubmit = () => {
    if (marketSearchQuery.trim()) {
      const customMarket = {
        id: `custom-${Date.now()}`,
        name: marketSearchQuery.trim(),
        location: 'Ibadan Market / Store',
        icon: '🛒'
      };
      setSelectedMarket(customMarket);
      setIsSearchFocused(false);
    }
  };

  const addItem = () => {
    if (newItemText.trim()) {
      setItemsList([...itemsList, { id: Date.now(), text: newItemText.trim() }]);
      setNewItemText('');
    }
  };

  const removeItem = (id) => {
    setItemsList(itemsList.filter(item => item.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (itemsList.length === 0) return;
    
    const finalMarket = selectedMarket || {
      id: 'custom-mkt',
      name: marketSearchQuery.trim() || 'Bodija Market',
      location: 'Ibadan',
      icon: '🛒'
    };

    onSubmitMarketRun({
      market: finalMarket,
      items: itemsList,
      budget: estimatedBudget,
      instructions,
      serviceFee: 1500
    });
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="main-content" style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center' }}>
        <div style={{ background: '#FFF', borderRadius: '24px', padding: '40px 24px', border: '1px solid #E5E7EB', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <div style={{ width: '70px', height: '70px', background: '#DCFCE7', color: '#16A34A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle2 size={40} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A' }}>Market Agent Dispatched!</h2>
          <p style={{ fontSize: '14px', color: '#64748B', marginTop: '8px' }}>
            Your Market Run order has been received. Agent <strong>Tunde</strong> is heading to <strong>{selectedMarket?.name}</strong> now.
          </p>
          <div style={{ background: '#F8F9FA', borderRadius: '16px', padding: '16px', marginTop: '24px', textAlign: 'left' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', marginBottom: '8px' }}>Order Summary</h4>
            <p style={{ fontSize: '13px', color: '#475569' }}><strong>Market:</strong> {selectedMarket?.name}</p>
            <p style={{ fontSize: '13px', color: '#475569' }}><strong>Location:</strong> {selectedMarket?.location}</p>
            <p style={{ fontSize: '13px', color: '#475569' }}><strong>Shopping Budget:</strong> ₦{estimatedBudget.toLocaleString()}</p>
            <p style={{ fontSize: '13px', color: '#475569' }}><strong>Agent Service Fee:</strong> ₦1,500</p>
          </div>
          <button className="primary-btn" style={{ marginTop: '24px' }} onClick={onBack}>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="market-run-page">
      {/* Header bar */}
      <div style={{ padding: '16px 32px', width: '100%', background: '#FFF', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={onBack} style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A' }}>Gada Market Run Errand</h2>
          <p style={{ fontSize: '12px', color: '#64748B' }}>Personal shopper to buy fresh produce directly from any market you choose</p>
        </div>
      </div>

      <div className="main-content" style={{ maxWidth: '1000px', margin: '0 auto', padding: '28px 32px' }}>
        <form onSubmit={handleSubmit} style={{ background: '#FFF', border: '1px solid #E5E7EB', borderRadius: '24px', padding: '28px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
          {/* Step 1: Search & Type Market */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', display: 'block', marginBottom: '8px' }}>
              1. Type the Market You Want
            </label>
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '14px' }}>
              Type any market name in Ibadan where you want your agent to shop.
            </p>

            <div style={{ position: 'relative' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#F8FAFC',
                  border: isSearchFocused ? '2px solid #0B4FD8' : '1px solid #CBD5E1',
                  borderRadius: '14px',
                  padding: '4px 14px',
                  transition: 'all 0.2s',
                  boxShadow: isSearchFocused ? '0 0 0 3px rgba(11,79,216,0.1)' : 'none'
                }}
              >
                <Search size={18} color="#0B4FD8" style={{ marginRight: '10px', flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Type market name (e.g. Bodija, Aleshinloye, Dugbe, Sango, Oja Oba, Mokola...)"
                  value={marketSearchQuery}
                  onChange={(e) => {
                    setMarketSearchQuery(e.target.value);
                    setIsSearchFocused(true);
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCustomMarketSubmit();
                    }
                  }}
                  style={{
                    flex: 1,
                    border: 'none',
                    background: 'transparent',
                    padding: '10px 0',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#0F172A',
                    outline: 'none'
                  }}
                />
                {marketSearchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setMarketSearchQuery('');
                      setIsSearchFocused(true);
                    }}
                    style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Autocomplete Suggestions Dropdown */}
              {isSearchFocused && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '8px',
                    background: '#FFF',
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 16px 36px rgba(0,0,0,0.12)',
                    zIndex: 100,
                    maxHeight: '260px',
                    overflowY: 'auto'
                  }}
                >
                  {/* Custom typed entry option */}
                  {marketSearchQuery.trim() && (
                    <div
                      onClick={handleCustomMarketSubmit}
                      style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid #F1F5F9',
                        background: '#EFF6FF',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontWeight: '700',
                        fontSize: '13px',
                        color: '#0B4FD8'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>✨</span>
                        <span>Shop at custom market: <strong>"{marketSearchQuery.trim()}"</strong></span>
                      </div>
                      <span style={{ fontSize: '11px', background: '#DBEAFE', padding: '3px 8px', borderRadius: '8px' }}>
                        Press Enter or Click
                      </span>
                    </div>
                  )}

                  {/* Filtered preset markets */}
                  {searchResults.map(market => (
                    <div
                      key={market.id}
                      onClick={() => handleSelectMarket(market)}
                      style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid #F8FAFC',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#FFF'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '20px' }}>{market.icon}</span>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A' }}>{market.name}</div>
                          <div style={{ fontSize: '12px', color: '#64748B' }}>{market.location}</div>
                        </div>
                      </div>
                      {selectedMarket?.id === market.id && (
                        <Check size={16} color="#0B4FD8" />
                      )}
                    </div>
                  ))}

                  {searchResults.length === 0 && !marketSearchQuery.trim() && (
                    <div style={{ padding: '16px', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
                      Start typing to find or enter any market name in Ibadan.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Currently Selected Market Pill */}
            {selectedMarket && (
              <div
                style={{
                  marginTop: '12px',
                  background: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>{selectedMarket.icon || '🛒'}</span>
                  <div>
                    <span style={{ fontSize: '11px', color: '#166534', fontWeight: '800', textTransform: 'uppercase' }}>
                      Selected Target Market:
                    </span>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A' }}>
                      {selectedMarket.name} <span style={{ fontSize: '12px', fontWeight: '500', color: '#64748B' }}>({selectedMarket.location || 'Ibadan'})</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMarketSearchQuery('');
                    setIsSearchFocused(true);
                  }}
                  style={{
                    background: '#FFF',
                    border: '1px solid #86EFAC',
                    color: '#15803D',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Change
                </button>
              </div>
            )}
          </div>

          {/* Step 2: Shopping List */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', display: 'block', marginBottom: '12px' }}>
              2. What should your Agent buy? (Shopping List)
            </label>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <input
                type="text"
                placeholder="Add item (e.g. 2kg Dry Fish, 1 Basket Tomatoes...)"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addItem(); } }}
                style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '14px' }}
              />
              <button
                type="button"
                onClick={addItem}
                style={{ background: '#FF6B00', color: '#FFF', padding: '0 20px', borderRadius: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={18} /> Add Item
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {itemsList.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '12px', background: '#F8F9FA', border: '1px solid #E5E7EB' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>• {item.text}</span>
                  <button type="button" onClick={() => removeItem(item.id)} style={{ color: '#EF4444', padding: '4px' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Step 3: Estimated Budget Slider */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A' }}>
                3. Estimated Shopping Budget
              </label>
              <span style={{ fontSize: '18px', fontWeight: '800', color: '#FF6B00' }}>
                ₦{estimatedBudget.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="5000"
              max="100000"
              step="1000"
              value={estimatedBudget}
              onChange={(e) => setEstimatedBudget(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#FF6B00' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>
              <span>₦5,000</span>
              <span>₦50,000</span>
              <span>₦100,000</span>
            </div>
          </div>

          {/* Step 4: Special Instructions */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', display: 'block', marginBottom: '8px' }}>
              4. Special Market Notes (Optional)
            </label>
            <textarea
              rows="3"
              placeholder="e.g. Ask Mama Bose at Shed 12 for firm tomatoes. Ensure meat is chopped into small soup pieces..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '13px' }}
            />
          </div>

          <div style={{ background: '#FFF4EC', border: '1px solid #FFD8BE', borderRadius: '12px', padding: '14px', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <AlertCircle size={20} color="#FF6B00" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '13px', color: '#9A3412', lineHeight: '1.5' }}>
              Agent Service Fee is <strong>₦1,500</strong>. Your agent will call to confirm prices before making any market purchases.
            </p>
          </div>

          <button type="submit" className="primary-btn">
            <Sparkles size={18} />
            <span>Dispatch Market Agent • Total: ₦{(estimatedBudget + 1500).toLocaleString()}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
