'use client';

import React, { useState } from 'react';

export interface ScheduleSelection {
  type: 'now' | 'scheduled';
  scheduledTime?: string;
}

interface Props {
  onScheduleChange: (selection: ScheduleSelection) => void;
}

export function DeliveryScheduleToggle({ onScheduleChange }: Props) {
  const [scheduleType, setScheduleType] = useState<'now' | 'scheduled'>('now');
  const [selectedSlot, setSelectedSlot] = useState('Today, 7:00 PM - 8:00 PM');

  const availableSlots = [
    'Today, 6:00 PM - 7:00 PM',
    'Today, 7:00 PM - 8:00 PM',
    'Today, 8:00 PM - 9:00 PM',
    'Tomorrow, 12:00 PM - 1:00 PM',
    'Tomorrow, 1:00 PM - 2:00 PM',
  ];

  const handleSelectType = (type: 'now' | 'scheduled') => {
    setScheduleType(type);
    onScheduleChange({
      type,
      scheduledTime: type === 'scheduled' ? selectedSlot : undefined,
    });
  };

  const handleSlotChange = (slot: string) => {
    setSelectedSlot(slot);
    onScheduleChange({ type: 'scheduled', scheduledTime: slot });
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
      <div className="flex justify-between items-center border-b pb-3">
        <h3 className="text-base font-bold text-gray-900">Delivery Timing</h3>
        <span className="text-xs text-amber-600 font-semibold">Gadaride Express</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleSelectType('now')}
          className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
            scheduleType === 'now'
              ? 'border-amber-500 bg-amber-50/40 text-amber-950 font-bold'
              : 'border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="text-lg">⚡</div>
          <div>
            <div className="text-xs font-bold">Deliver Now</div>
            <div className="text-[11px] font-normal text-gray-500 mt-0.5">25 - 45 mins</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleSelectType('scheduled')}
          className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
            scheduleType === 'scheduled'
              ? 'border-amber-500 bg-amber-50/40 text-amber-950 font-bold'
              : 'border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="text-lg">📅</div>
          <div>
            <div className="text-xs font-bold">Schedule for Later</div>
            <div className="text-[11px] font-normal text-gray-500 mt-0.5">Pick time slot</div>
          </div>
        </button>
      </div>

      {scheduleType === 'scheduled' && (
        <div className="space-y-1.5 pt-2">
          <label className="block text-xs font-semibold text-gray-700">Choose Arrival Window</label>
          <select
            value={selectedSlot}
            onChange={(e) => handleSlotChange(e.target.value)}
            className="w-full text-xs border border-gray-200 rounded-xl p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
          >
            {availableSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

export default DeliveryScheduleToggle;
