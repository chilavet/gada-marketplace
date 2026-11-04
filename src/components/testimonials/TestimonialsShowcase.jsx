import React from 'react';
import {
  Star, Quote, Store, Bike, TrendingUp, CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { TESTIMONIALS } from '../../data/testimonialsData';

export default function TestimonialsShowcase() {
  const getPartnerTheme = (type) => {
    switch (type) {
      case 'vendor':
        return {
          icon: <Store size={14} color="#EA580C" />,
          borderColor: '#FED7AA',
          bgBadge: '#FFF4EC',
          textBadge: '#EA580C',
          accentColor: '#FF6B00',
          quoteColor: '#FDBA74'
        };
      case 'rider':
        return {
          icon: <Bike size={14} color="#047857" />,
          borderColor: '#A7F3D0',
          bgBadge: '#ECFDF5',
          textBadge: '#047857',
          accentColor: '#059669',
          quoteColor: '#6EE7B7'
        };
      case 'agent':
      default:
        return {
          icon: <ShieldCheck size={14} color="#1D4ED8" />,
          borderColor: '#BFDBFE',
          bgBadge: '#EFF6FF',
          textBadge: '#1D4ED8',
          accentColor: '#0B4FD8',
          quoteColor: '#93C5FD'
        };
    }
  };

  return (
    <section
      style={{
        width: '100%',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
        borderTop: '1px solid #E2E8F0',
        borderBottom: '1px solid #E2E8F0',
        padding: '48px 20px 56px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        {/* Headline */}
        <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 36px' }}>
          <h2
            style={{
              fontSize: 'clamp(24px, 4vw, 36px)',
              fontWeight: '900',
              color: '#0F172A',
              lineHeight: 1.2,
              letterSpacing: '-0.5px',
              margin: '0 0 10px 0'
            }}
          >
            Hear From Our <span style={{ color: '#FF6B00' }}>Vendor</span>, <span style={{ color: '#059669' }}>Rider</span> & <span style={{ color: '#0B4FD8' }}>Store Agent</span>
          </h2>

          <p
            style={{
              fontSize: 'clamp(14px, 2vw, 16px)',
              color: '#64748B',
              lineHeight: 1.5,
              maxWidth: '680px',
              margin: '0 auto'
            }}
          >
            Real stories from the people powering our ecosystem: local kitchen sales growth, rapid courier transit, and seamless neighborhood hub dispatch quality.
          </p>
        </div>

        {/* 3 TESTIMONIAL CARDS (Vendor, Rider, Agent) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}
        >
          {TESTIMONIALS.map((t) => {
            const theme = getPartnerTheme(t.type);

            return (
              <div
                key={t.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '24px',
                  border: `1.5px solid ${theme.borderColor}`,
                  padding: '24px',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.07)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.03)';
                }}
              >
                {/* Card Top: Type badge & Metric */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '16px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        borderRadius: '10px',
                        fontSize: '11px',
                        fontWeight: '800',
                        background: theme.bgBadge,
                        color: theme.textBadge,
                        border: `1px solid ${theme.borderColor}`
                      }}
                    >
                      {theme.icon}
                      <span>{t.typeLabel}</span>
                    </span>

                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '800',
                        color: t.metricColor,
                        background: '#F8FAFC',
                        padding: '3px 8px',
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <TrendingUp size={12} />
                      <span>{t.metric}</span>
                    </span>
                  </div>

                  {/* 5-Star Rating */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '14px' }}>
                    {[...Array(t.rating)].map((_, idx) => (
                      <Star key={idx} size={15} fill="#F59E0B" color="#F59E0B" />
                    ))}
                    <span style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A', marginLeft: '4px' }}>
                      5.0 Verified Review
                    </span>
                  </div>

                  {/* Quote Body */}
                  <div style={{ position: 'relative', marginBottom: '20px' }}>
                    <Quote
                      size={24}
                      color={theme.quoteColor}
                      style={{ position: 'absolute', top: '-8px', left: '-4px', opacity: 0.4, pointerEvents: 'none' }}
                    />
                    <p
                      style={{
                        fontSize: '13.5px',
                        color: '#334155',
                        lineHeight: 1.6,
                        margin: 0,
                        position: 'relative',
                        zIndex: 1,
                        paddingLeft: '6px'
                      }}
                    >
                      "{t.quote}"
                    </p>
                  </div>
                </div>

                {/* Card Footer: Person Profile */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    paddingTop: '16px',
                    borderTop: '1px solid #F1F5F9'
                  }}
                >
                  <img
                    src={t.image}
                    alt={t.name}
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: `2px solid ${theme.accentColor}`,
                      flexShrink: 0
                    }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <h4
                        style={{
                          fontSize: '14px',
                          fontWeight: '800',
                          color: '#0F172A',
                          margin: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {t.name}
                      </h4>
                      <CheckCircle2 size={14} color={theme.accentColor} style={{ flexShrink: 0 }} />
                    </div>

                    <div
                      style={{
                        fontSize: '12px',
                        color: '#475569',
                        fontWeight: '600',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        marginTop: '1px'
                      }}
                    >
                      {t.business}
                    </div>

                    <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '1px' }}>
                      {t.role} &bull; <strong style={{ color: theme.textBadge }}>{t.badge}</strong>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
