import { useMemo } from 'react';
import { VendorOperatingHours } from '@/types/marketplace';

export interface StoreStatus {
  isOpen: boolean;
  statusText: string;
  nextOpenText?: string;
  colorClass: string;
}

const DAYS_OF_WEEK: VendorOperatingHours['day'][] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

export function useStoreHours(operatingHours?: VendorOperatingHours[]): StoreStatus {
  return useMemo(() => {
    if (!operatingHours || operatingHours.length === 0) {
      // Default open if no schedule is enforced
      return {
        isOpen: true,
        statusText: 'Open Now',
        colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      };
    }

    const now = new Date();
    const currentDayName = DAYS_OF_WEEK[now.getDay()];
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Find today's schedule
    const todaySchedule = operatingHours.find((h) => h.day.toLowerCase() === currentDayName);

    if (!todaySchedule || !todaySchedule.isOpen) {
      return {
        isOpen: false,
        statusText: 'Closed Today',
        colorClass: 'text-red-700 bg-red-50 border-red-200',
      };
    }

    // Parse "HH:MM" strings into total minutes from midnight
    const [openH, openM] = todaySchedule.openTime.split(':').map(Number);
    const [closeH, closeM] = todaySchedule.closeTime.split(':').map(Number);

    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;

    // Normal daytime schedule (e.g., 08:00 to 22:00)
    if (closeMinutes > openMinutes) {
      if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
        return {
          isOpen: true,
          statusText: `Open Now • Closes at ${todaySchedule.closeTime}`,
          colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        };
      } else if (currentMinutes < openMinutes) {
        return {
          isOpen: false,
          statusText: `Closed • Opens at ${todaySchedule.openTime}`,
          colorClass: 'text-amber-800 bg-amber-50 border-amber-200',
        };
      } else {
        return {
          isOpen: false,
          statusText: 'Closed for the day',
          colorClass: 'text-red-700 bg-red-50 border-red-200',
        };
      }
    } else {
      // Overnight schedule (e.g., 18:00 to 03:00 next morning)
      const isOvernightOpen = currentMinutes >= openMinutes || currentMinutes < closeMinutes;
      if (isOvernightOpen) {
        return {
          isOpen: true,
          statusText: `Open Now • Closes at ${todaySchedule.closeTime}`,
          colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        };
      } else {
        return {
          isOpen: false,
          statusText: `Closed • Opens at ${todaySchedule.openTime}`,
          colorClass: 'text-amber-800 bg-amber-50 border-amber-200',
        };
      }
    }
  }, [operatingHours]);
}

export default useStoreHours;
