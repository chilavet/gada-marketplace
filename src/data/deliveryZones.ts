export interface DeliveryZone {
  id: string;
  name: string;
  city: 'Lagos' | 'Abuja';
  baseFee: number; // in NGN
  estimatedMinutes: string;
}

export interface VendorZoneCoverage {
  vendorId: string;
  city: 'Lagos' | 'Abuja';
  supportedZoneIds: string[]; // List of zone IDs the merchant's riders service
}

// Master list of Gadaride operational zones
export const ACTIVE_ZONES: DeliveryZone[] = [
  // Lagos Zones
  { id: 'zone_festac', name: 'Festac Town / Amuwo Odofin', city: 'Lagos', baseFee: 1200, estimatedMinutes: '20-35 mins' },
  { id: 'zone_surulere', name: 'Surulere / Yaba', city: 'Lagos', baseFee: 1800, estimatedMinutes: '30-45 mins' },
  { id: 'zone_ikeja', name: 'Ikeja / Maryland / GRA', city: 'Lagos', baseFee: 2000, estimatedMinutes: '35-50 mins' },
  { id: 'zone_vi', name: 'Victoria Island / Ikoyi', city: 'Lagos', baseFee: 2500, estimatedMinutes: '30-45 mins' },
  { id: 'zone_lekki1', name: 'Lekki Phase 1 / Oniru', city: 'Lagos', baseFee: 2200, estimatedMinutes: '25-40 mins' },
  { id: 'zone_ajah', name: 'Chevron / VGC / Ajah', city: 'Lagos', baseFee: 3000, estimatedMinutes: '45-60 mins' },

  // Abuja Zones
  { id: 'zone_wuse', name: 'Wuse 2 / Wuse Zone 1-6', city: 'Abuja', baseFee: 1500, estimatedMinutes: '20-30 mins' },
  { id: 'zone_maitama', name: 'Maitama / Guzape', city: 'Abuja', baseFee: 1800, estimatedMinutes: '25-35 mins' },
  { id: 'zone_garki', name: 'Garki 1 & 2 / Central Area', city: 'Abuja', baseFee: 1500, estimatedMinutes: '20-30 mins' },
  { id: 'zone_jabi', name: 'Jabi / Utako', city: 'Abuja', baseFee: 1800, estimatedMinutes: '25-35 mins' },
  { id: 'zone_gwarinpa', name: 'Gwarinpa / Life Camp', city: 'Abuja', baseFee: 2200, estimatedMinutes: '35-45 mins' },
];

/**
 * Retrieve zone by ID
 */
export function getZoneById(zoneId: string): DeliveryZone | undefined {
  return ACTIVE_ZONES.find((z) => z.id === zoneId);
}

/**
 * Filter operational zones by city (Lagos / Abuja)
 */
export function getZonesByCity(city: 'Lagos' | 'Abuja'): DeliveryZone[] {
  return ACTIVE_ZONES.filter((z) => z.city === city);
}

/**
 * Check if a merchant services a specified delivery zone
 */
export function isZoneSupportedByVendor(
  vendorCoverage: VendorZoneCoverage,
  zoneId: string
): boolean {
  return vendorCoverage.supportedZoneIds.includes(zoneId);
}

export default ACTIVE_ZONES;
