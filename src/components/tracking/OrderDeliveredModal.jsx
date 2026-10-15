import React, { useState } from 'react';
import {
  CheckCircle2, Star, ArrowRight, MapPin, Sparkles, X
} from 'lucide-react';
import { playStatusNotificationChime } from '../../lib/soundNotifications';

export function OrderDeliveredModal({
  isOpen,
  onClose,
  orderId = 'GADA-8291',
  riderName = 'Babatunde Adeleke',
  riderPhoto = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  destinationAddress = 'Plot 202 Festac Town, Lagos',
  totalAmount = 8400,
  onReturnHome
}) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState(['Super Fast', 'Polite Rider']);
  const [feedbackSent, setFeedbackSent] = useState(false);

  if (!isOpen) return null;

  const compliments = [
    'Super Fast',
    'Polite Rider',
    'Careful Handling',
    'Hot & Fresh',
    'Followed Instructions'
  ];

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmitFeedback = () => {
    setFeedbackSent(true);
    playStatusNotificationChime();
    setTimeout(() => {
      if (onClose) onClose();
      if (onReturnHome) onReturnHome();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
        {/* Celebration Header */}
        <div className="relative bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-700 text-white p-6 text-center shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
          >
            <X size={18} />
          </button>

          {/* Animated Delivery Checkmark */}
          <div className="relative inline-flex items-center justify-center mb-3">
            <span className="animate-ping absolute inline-flex h-16 w-16 rounded-full bg-white opacity-40" />
            <div className="relative w-16 h-16 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-lg text-3xl font-extrabold">
              <CheckCircle2 size={36} className="text-emerald-600" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles size={13} className="text-amber-300" />
            <span>Order Completed</span>
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight">
            Package Delivered! 🎉
          </h2>
          <p className="text-xs text-emerald-100 mt-1 max-w-xs mx-auto">
            Your items have been safely handed over to your doorstep.
          </p>
        </div>

        {/* Scrollable Receipt & Rating Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-gray-800">
          {/* Order Summary Pill */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] text-gray-400 uppercase font-bold block">Order Reference</span>
              <span className="text-sm font-extrabold text-gray-900">#{orderId}</span>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                <MapPin size={12} className="text-amber-500 shrink-0" />
                <span className="line-clamp-1">{destinationAddress}</span>
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-gray-400 uppercase font-bold block">Total Paid</span>
              <span className="text-base font-extrabold text-emerald-600">₦{totalAmount.toLocaleString()}</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full block mt-0.5">
                Paid In Full
              </span>
            </div>
          </div>

          {/* Courier Handover Badge */}
          <div className="flex items-center gap-3 p-3 bg-amber-50/60 border border-amber-200 rounded-2xl">
            <img
              src={riderPhoto}
              alt={riderName}
              className="w-12 h-12 rounded-full object-cover border-2 border-amber-500 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] text-amber-700 font-bold uppercase block">Delivered by</span>
              <h4 className="text-sm font-bold text-gray-900 truncate">{riderName}</h4>
              <p className="text-[11px] text-gray-500">Verified Gadaride Express Courier</p>
            </div>
            <span className="text-xs bg-white text-emerald-700 font-extrabold px-2.5 py-1 rounded-xl border border-emerald-200 shadow-sm">
              ✓ Verified
            </span>
          </div>

          {/* Feedback & Star Rating */}
          <div className="text-center space-y-3 pt-1">
            <h3 className="text-sm font-bold text-gray-900">
              How was your delivery experience?
            </h3>

            {/* Stars */}
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      size={28}
                      className={
                        isFilled
                          ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
                          : 'text-gray-300'
                      }
                    />
                  </button>
                );
              })}
            </div>

            {/* Compliments Chips */}
            <div className="flex flex-wrap gap-1.5 justify-center pt-1">
              {compliments.map((comp) => {
                const active = selectedTags.includes(comp);
                return (
                  <button
                    key={comp}
                    type="button"
                    onClick={() => toggleTag(comp)}
                    className={`text-[11px] px-3 py-1 rounded-full font-semibold border transition ${
                      active
                        ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {comp}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-col gap-2 shrink-0">
          <button
            onClick={handleSubmitFeedback}
            disabled={feedbackSent}
            className="w-full py-3.5 px-4 rounded-2xl bg-gray-900 hover:bg-black text-white font-extrabold text-sm shadow transition flex items-center justify-center gap-2 disabled:bg-emerald-600"
          >
            {feedbackSent ? (
              <>
                <CheckCircle2 size={18} />
                <span>Thank You! Feedback Saved</span>
              </>
            ) : (
              <>
                <span>Confirm Delivery & Finish</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderDeliveredModal;
