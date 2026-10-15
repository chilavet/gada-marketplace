import React, { useState, useEffect } from 'react';
import {
  X, Plus, Minus, ShoppingBag, Sparkles, MapPin, Clock, ExternalLink,
  Star, ShieldCheck, ChevronRight, Check, Heart, Share2, AlertCircle, Store
} from 'lucide-react';
import { locationService } from '../services/locationService';
import { catalogApi } from '../api';

export default function ItemModal({
  item,
  onClose,
  onAddToCart,
  currentLocation,
  onSelectVendor,
  onSelectItem
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(
    item?.variants?.[0] || { id: 'var-reg', name: 'Regular Portion', priceDiff: 0, inStock: true }
  );
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isCopied, setIsCopied] = useState(false);

  // Gallery images fallback
  const images = item?.images && item.images.length > 0 ? item.images : [
    item?.image || '',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80'
  ];

  // Variants list fallback
  const variants = item?.variants || [
    { id: 'var-reg', name: 'Regular Portion', priceDiff: 0, inStock: true },
    { id: 'var-lrg', name: 'Large Portion (+30% More)', priceDiff: 800, inStock: true },
    { id: 'var-jmb', name: 'Jumbo Feast Pack', priceDiff: 1800, inStock: true }
  ];

  // Addons list fallback
  const addons = item?.addons || [
    { name: 'Extra Portion Sauce / Pepper', price: 250 },
    { name: 'Bottled Spring Water (75cl)', price: 300 },
    { name: 'Chilled Hibiscus Zobo (500ml)', price: 700 }
  ];

  const distance = item?.distance || (currentLocation ? locationService.getDistanceKm(currentLocation.lat, currentLocation.lng, item?.lat || 7.3872, item?.lng || 3.8824) : 1.5);
  const deliveryTime = item?.deliveryTime || locationService.estimateDeliveryTime(distance);
  const deliveryFee = item?.deliveryFee || locationService.calculateDeliveryFee(distance);

  // Fetch related products
  useEffect(() => {
    if (item?.id) {
      catalogApi.getRelatedProducts(item.id, item.category)
        .then(res => setRelatedProducts(res))
        .catch(err => console.warn(err));
    }
  }, [item?.id, item?.category]);

  const toggleAddon = (addon) => {
    if (selectedAddons.some(a => a.name === addon.name)) {
      setSelectedAddons(selectedAddons.filter(a => a.name !== addon.name));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const basePrice = item.price + (selectedVariant?.priceDiff || 0);
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = basePrice + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    onAddToCart({
      ...item,
      quantity,
      selectedVariant,
      selectedAddons,
      specialInstructions,
      calculatedPrice: totalPrice
    });
    onClose();
  };

  const handleShare = () => {
    const url = `${window.location.origin}/#product-${item.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (!item) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1200 }}>
      <div
        className="modal-card pdp-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '680px',
          width: '92%',
          borderRadius: '24px',
          padding: 0,
          overflow: 'hidden',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)'
        }}
      >
        {/* Header bar */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#FFF'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', background: '#FFF4EC', color: '#FF6B00', fontWeight: '800', padding: '3px 10px', borderRadius: '12px', textTransform: 'uppercase' }}>
              Product Detail Page (PDP)
            </span>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>
              SKU: {item.sku || `GADA-${item.id.toUpperCase()}`}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleShare}
              title="Share product link"
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                border: '1px solid #E2E8F0',
                background: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#475569'
              }}
            >
              <Share2 size={16} />
            </button>
            <button
              onClick={onClose}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                border: '1px solid #E2E8F0',
                background: '#F8FAFC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#475569'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {/* Gallery Carousel & Main Image */}
          <div style={{ position: 'relative', width: '100%', height: '280px', background: '#0F172A' }}>
            <img
              src={images[activeImageIndex] || item.image}
              alt={item.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.6) 0%, transparent 50%)' }} />

            {/* Stock status badge */}
            <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
              <span
                style={{
                  background: 'rgba(16, 185, 129, 0.95)',
                  color: '#FFF',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: '800',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Check size={12} strokeWidth={3} /> In Stock (Available for Instant Dispatch)
              </span>
            </div>

            {/* Price Badge on Image */}
            <div style={{ position: 'absolute', bottom: '16px', left: '20px', color: '#FFF' }}>
              <div style={{ fontSize: '24px', fontWeight: '900', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                ₦{basePrice.toLocaleString()}
              </div>
              {item.originalPrice && (
                <div style={{ fontSize: '13px', textDecoration: 'line-through', color: '#CBD5E1' }}>
                  ₦{item.originalPrice.toLocaleString()}
                </div>
              )}
            </div>

            {/* Image Thumbnail Selector Dots / Strips */}
            {images.length > 1 && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  right: '20px',
                  display: 'flex',
                  gap: '6px'
                }}
              >
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      border: activeImageIndex === idx ? '2px solid #FF6B00' : '1px solid rgba(255,255,255,0.6)',
                      padding: 0,
                      overflow: 'hidden',
                      cursor: 'pointer'
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Description & Details */}
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0F172A', lineHeight: '1.2' }}>
                  {item.name}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', fontSize: '13px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#D97706', fontWeight: '700' }}>
                    <Star size={14} fill="#D97706" /> {item.rating || 4.8} ({item.reviewsCount || 120}+ reviews)
                  </span>
                  <span style={{ color: '#CBD5E1' }}>•</span>
                  <span style={{ color: '#0B4FD8', fontWeight: '700' }}>{item.category.toUpperCase()}</span>
                </div>
              </div>
            </div>

            <p style={{ fontSize: '14px', color: '#475569', marginTop: '14px', lineHeight: '1.6' }}>
              {item.description}
            </p>

            {/* Vendor Attribution Card */}
            <div
              style={{
                marginTop: '20px',
                padding: '14px 18px',
                borderRadius: '16px',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: '#EFF6FF',
                    color: '#0B4FD8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800'
                  }}
                >
                  <Store size={22} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A' }}>
                      {item.vendor}
                    </span>
                    <ShieldCheck size={16} color="#10B981" />
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <MapPin size={12} />
                    <span>{item.locationName || 'Bodija Central Hub'}</span>
                    <span>•</span>
                    <span style={{ color: '#0B4FD8', fontWeight: '700' }}>{distance} km away</span>
                  </div>
                </div>
              </div>

              {onSelectVendor && (
                <button
                  onClick={() => {
                    onSelectVendor({
                      id: item.vendorId || 'v1',
                      name: item.vendor,
                      address: item.locationName,
                      locationName: item.locationName,
                      rating: item.rating,
                      banner: item.image,
                      logo: item.image,
                      menu: [item]
                    });
                    onClose();
                  }}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    background: '#FFF',
                    color: '#0F172A',
                    fontSize: '12px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Visit Storefront
                  <ChevronRight size={14} />
                </button>
              )}
            </div>

            {/* Variant Selector (Portion/Size) */}
            <div style={{ marginTop: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A' }}>
                  Select Portion / Variant
                </span>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>Required (Pick 1)</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {variants.map(variant => {
                  const isSelected = selectedVariant.id === variant.id;
                  return (
                    <div
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: isSelected ? '2px solid #FF6B00' : '1px solid #E2E8F0',
                        background: isSelected ? '#FFF8F4' : '#FFF',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.15s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            border: isSelected ? '5px solid #FF6B00' : '2px solid #CBD5E1',
                            background: '#FFF'
                          }}
                        />
                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A' }}>
                          {variant.name}
                        </span>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: '800', color: isSelected ? '#FF6B00' : '#475569' }}>
                        {variant.priceDiff > 0 ? `+₦${variant.priceDiff.toLocaleString()}` : 'Base Price'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Addons / Side Items */}
            {addons.length > 0 && (
              <div style={{ marginTop: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A' }}>
                    Optional Add-ons & Drinks
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Customize your meal</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {addons.map((addon, idx) => {
                    const isChecked = selectedAddons.some(a => a.name === addon.name);
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleAddon(addon)}
                        style={{
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: isChecked ? '2px solid #0B4FD8' : '1px solid #E2E8F0',
                          background: isChecked ? '#EFF6FF' : '#FFF',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            style={{ accentColor: '#0B4FD8', width: '16px', height: '16px' }}
                          />
                          <span style={{ fontSize: '13px', fontWeight: '600', color: '#0F172A' }}>
                            {addon.name}
                          </span>
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: '800', color: '#0B4FD8' }}>
                          +₦{addon.price.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div style={{ marginTop: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#0F172A', marginBottom: '6px' }}>
                Special Instructions for the Kitchen / Vendor
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Please make it mild spicy, no extra onions, pack soup separately..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid #E2E8F0',
                  fontSize: '13px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Related Items */}
            {relatedProducts.length > 0 && (
              <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', marginBottom: '12px' }}>
                  Frequently Ordered Together
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
                  {relatedProducts.map(rel => (
                    <div
                      key={rel.id}
                      onClick={() => onSelectItem && onSelectItem(rel)}
                      style={{
                        padding: '10px',
                        borderRadius: '12px',
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      <img src={rel.image} alt={rel.name} style={{ width: '100%', height: '70px', objectFit: 'cover', borderRadius: '8px' }} />
                      <div style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A', marginTop: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {rel.name}
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: '800', color: '#FF6B00', marginTop: '2px' }}>
                        ₦{rel.price.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Bottom Actions Bar */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #E2E8F0',
            background: '#FFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}
        >
          {/* Quantity Selector */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: '#F1F5F9',
              padding: '6px 12px',
              borderRadius: '14px'
            }}
          >
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#FFF', border: '1px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <Minus size={14} />
            </button>
            <span style={{ fontSize: '15px', fontWeight: '800', minWidth: '20px', textAlign: 'center' }}>
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#FFF', border: '1px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAdd}
            style={{
              flex: 1,
              padding: '14px 20px',
              borderRadius: '16px',
              border: 'none',
              background: 'linear-gradient(135deg, #FF6B00 0%, #FF8533 100%)',
              color: '#FFF',
              fontSize: '15px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 8px 20px rgba(255, 107, 0, 0.3)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingBag size={18} />
              <span>Add to Order</span>
            </div>
            <span>₦{totalPrice.toLocaleString()}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
