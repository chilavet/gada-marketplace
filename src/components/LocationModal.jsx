import React, { useState } from 'react';
import { X, MapPin, Navigation, Compass, CheckCircle2, Search, ExternalLink, ShieldCheck } from 'lucide-react';
import { POPULAR_LOCATIONS, locationService } from '../services/locationService';

export default function LocationModal({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation
}) {
  const [searchFilter, setSearchFilter] = useState('');
  const [isDetectingGPS, setIsDetectingGPS] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [activeCoords, setActiveCoords] = useState({
    lat: currentLocation?.lat || 7.3582,
    lng: currentLocation?.lng || 3.8643
  });

  if (!isOpen) return null;

  const filteredLocations = POPULAR_LOCATIONS.filter(loc =>
    loc.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    loc.area.toLowerCase().includes(searchFilter.toLowerCase()) ||
    loc.description.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleDetectGPS = async () => {
    setIsDetectingGPS(true);
    setGpsError('');

    try {
      const detected = await locationService.detectGPSLocation();
      setActiveCoords({ lat: detected.lat, lng: detected.lng });
      onSelectLocation(detected, `Accurate location detected via Google Maps & GPS: ${detected.name}`);
      onClose();
    } catch (err) {
      setGpsError(err.message || 'Please allow location permission in your browser to detect your coordinates.');
    } finally {
      setIsDetectingGPS(false);
    }
  };

  const handlePickLocation = (loc) => {
    locationService.setCurrentLocation(loc);
    setActiveCoords({ lat: loc.lat, lng: loc.lng });
    onSelectLocation(loc, `Location set to ${loc.name}! Items re-sorted by Google Maps distance.`);
    onClose();
  };

  const googleMapUrl = locationService.getGoogleMapEmbedUrl(activeCoords.lat, activeCoords.lng, 15);

  return (
    <div className="modal-overlay" onClick={onClose}>
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
        {/* Modal Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0B4FD8 0%, #1D4ED8 100%)',
            padding: '22px 26px',
            color: '#FFF',
            position: 'relative'
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '18px',
              right: '18px',
              background: 'rgba(255,255,255,0.15)',
              color: '#FFF',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Compass size={20} color="#FFA000" />
            <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#FFA000' }}>
              Google Maps Location Services
            </span>
          </div>

          <h3 style={{ fontSize: '20px', fontWeight: '800' }}>Accurate Delivery Location</h3>
          <p style={{ fontSize: '13px', color: '#BFDBFE', marginTop: '2px' }}>
            We use real-time Google Maps coordinates to match items and store hubs in your exact area.
          </p>

          {/* GPS Button */}
          <button
            onClick={handleDetectGPS}
            disabled={isDetectingGPS}
            style={{
              marginTop: '14px',
              width: '100%',
              background: '#FFF',
              color: '#0B4FD8',
              padding: '12px 18px',
              borderRadius: '12px',
              fontWeight: '800',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)'
            }}
          >
            <Navigation size={16} color="#0B4FD8" />
            <span>{isDetectingGPS ? 'Pinpointing exact location on Google Maps...' : '🎯 Auto-Detect My Location with Google Maps & GPS'}</span>
          </button>
        </div>

        {/* Live Google Map Preview */}
        <div style={{ position: 'relative', height: '170px', background: '#E2E8F0', borderBottom: '1px solid #CBD5E1' }}>
          <iframe
            title="Google Maps Location Preview"
            src={googleMapUrl}
            width="100%"
            height="100%"
            style={{ border: 'none', filter: 'contrast(1.02)' }}
            loading="lazy"
          />
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '12px',
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(6px)',
              color: '#FFF',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <MapPin size={12} color="#FFA000" />
            <span>Map Pin: {activeCoords.lat.toFixed(4)}°N, {activeCoords.lng.toFixed(4)}°E</span>
          </div>
        </div>

        {/* Search bar */}
        <div style={{ padding: '16px 22px 10px', background: '#F8FAFC' }}>
          {gpsError && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C', padding: '8px 12px', borderRadius: '10px', fontSize: '12px', marginBottom: '10px' }}>
              ⚠️ {gpsError}
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by neighborhood, street, or landmark (e.g. Bodija, Ring Road, Dugbe)..."
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 38px',
                borderRadius: '12px',
                border: '1px solid #CBD5E1',
                fontSize: '13px',
                background: '#FFF'
              }}
            />
          </div>
        </div>

        {/* Location List */}
        <div style={{ padding: '8px 22px 20px', maxHeight: '250px', overflowY: 'auto' }}>
          <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
            Quick Select Verified Delivery Hubs
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredLocations.map(loc => {
              const isSelected = currentLocation?.id === loc.id || currentLocation?.name === loc.name;
              return (
                <div
                  key={loc.id}
                  onClick={() => handlePickLocation(loc)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid #0B4FD8' : '1px solid #E2E8F0',
                    background: isSelected ? '#EFF6FF' : '#FFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={e => !isSelected && (e.currentTarget.style.background = '#F8FAFC')}
                  onMouseLeave={e => !isSelected && (e.currentTarget.style.background = '#FFF')}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        background: isSelected ? '#0B4FD8' : '#F1F5F9',
                        color: isSelected ? '#FFF' : '#64748B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '2px',
                        fontSize: '13px'
                      }}
                    >
                      {loc.id === 'loc-all' ? '🌐' : <MapPin size={15} />}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>
                          {loc.name}
                        </span>
                        <span style={{ fontSize: '10px', background: '#E2E8F0', padding: '1px 6px', borderRadius: '6px', fontWeight: '700', color: '#475569' }}>
                          {loc.area}
                        </span>
                      </div>
                      <span style={{ fontSize: '11px', color: '#64748B', marginTop: '1px', display: 'block' }}>
                        {loc.description}
                      </span>
                    </div>
                  </div>

                  {isSelected && <CheckCircle2 size={18} color="#0B4FD8" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
