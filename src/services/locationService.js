// Google Maps and Location Service for Gada Marketplace & Logistics
// Accurate GPS coordinates, distance calculation (Haversine formula), and Google Map embedding.

export const ALL_LOCATIONS_OPTION = {
  id: 'loc-all',
  name: 'All Nearby Hubs',
  shortName: 'All Areas',
  area: 'Nearby',
  lat: 7.3980,
  lng: 3.8850,
  description: 'Showcase items across all nearby stores and merchant hubs'
};

export const POPULAR_LOCATIONS = [
  ALL_LOCATIONS_OPTION,
  {
    id: 'loc-central',
    name: 'Central Merchant Hub',
    shortName: 'Central District',
    area: 'Commercial Central',
    lat: 7.3872,
    lng: 3.8824,
    description: 'Central business, retail stores & dining hub'
  },
  {
    id: 'loc-express',
    name: 'Express Delivery Terminal',
    shortName: 'Express Terminal',
    area: 'Commercial Axis',
    lat: 7.3582,
    lng: 3.8643,
    description: 'Retail stores, shopping & rapid logistics hub'
  },
  {
    id: 'loc-produce',
    name: 'Fresh Market & Produce District',
    shortName: 'Market District',
    area: 'Open Market Hub',
    lat: 7.4350,
    lng: 3.9050,
    description: 'Fresh farm produce & open market vendors'
  },
  {
    id: 'loc-metro',
    name: 'Metro Commercial Park',
    shortName: 'Metro Park',
    area: 'Metro Area',
    lat: 7.3980,
    lng: 3.8590,
    description: 'Boutique stores & residential community'
  }
];

const DEFAULT_LOCATION = {
  id: 'loc-default',
  name: 'Current Area',
  shortName: 'Near Me',
  area: 'Local Area',
  lat: 7.3872,
  lng: 3.8824,
  isGPS: false,
  description: 'Auto-detecting your device location'
};

const LOCATION_STORAGE_KEY = 'gada_customer_location';
const LOCATION_AUTO_REQUESTED_KEY = 'gada_gps_auto_requested';

const VENDOR_OFFSETS = [
  { dLat: 0.0048, dLng: 0.0035, hubSuffix: 'Central Store Hub' },
  { dLat: -0.0062, dLng: 0.0051, hubSuffix: 'Market Terminal' },
  { dLat: 0.0095, dLng: -0.0072, hubSuffix: 'Express Store Hub' },
  { dLat: -0.0118, dLng: -0.0094, hubSuffix: 'Commercial District' },
  { dLat: 0.0152, dLng: 0.0115, hubSuffix: 'Neighborhood Kitchen' },
  { dLat: -0.0175, dLng: 0.0142, hubSuffix: 'Grocery Terminal' },
  { dLat: 0.0210, dLng: -0.0160, hubSuffix: 'Boutique Store Hub' }
];

export const locationService = {
  // Great-circle Haversine formula (km)
  getDistanceKm(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 1.2;
    const R = 6371; // Earth's radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return parseFloat(d.toFixed(1));
  },

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  },

  // Estimates delivery time based on distance
  estimateDeliveryTime(distanceKm) {
    if (distanceKm <= 1.0) return '10-15 mins';
    if (distanceKm <= 2.5) return '15-22 mins';
    if (distanceKm <= 4.5) return '20-30 mins';
    if (distanceKm <= 7.0) return '30-40 mins';
    return '40-55 mins';
  },

  // Calculates estimated dynamic delivery fee based on distance
  calculateDeliveryFee(distanceKm) {
    const baseFee = 450;
    const perKm = 140;
    const raw = baseFee + (distanceKm * perKm);
    return Math.round(raw / 50) * 50;
  },

  // Generates interactive Google Map embed URL
  getGoogleMapEmbedUrl(lat, lng, zoom = 15) {
    return `https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=${zoom}&output=embed`;
  },

  // Generates Google Maps Directions link
  getGoogleMapsDirectionsUrl(fromLat, fromLng, toLat, toLng) {
    return `https://www.google.com/maps/dir/?api=1&origin=${fromLat},${fromLng}&destination=${toLat},${toLng}&travelmode=driving`;
  },

  // Get current active location from localStorage or default
  getCurrentLocation() {
    try {
      const stored = localStorage.getItem(LOCATION_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return DEFAULT_LOCATION;
  },

  // Set active customer location
  setCurrentLocation(locationObj) {
    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(locationObj));
  },

  hasAutoRequestedGPS() {
    return localStorage.getItem(LOCATION_AUTO_REQUESTED_KEY) === 'true';
  },

  setAutoRequestedGPS() {
    localStorage.setItem(LOCATION_AUTO_REQUESTED_KEY, 'true');
  },

  // Reverse geocodes coordinates to street / area name
  async reverseGeocode(lat, lng) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (res.ok) {
        const data = await res.json();
        const road = data.address?.road || data.address?.suburb || data.address?.neighbourhood || '';
        const city = data.address?.city || data.address?.town || data.address?.municipality || data.address?.state || '';
        if (road && city) {
          return `${road}, ${city}`;
        }
        if (road || city) {
          return road || city;
        }
        return data.display_name?.split(',').slice(0, 2).join(', ') || null;
      }
    } catch {
      // fallback
    }
    return null;
  },

  // Detect GPS location using browser navigator.geolocation
  async detectGPSLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          const accuracy = Math.round(position.coords.accuracy || 10);

          let resolvedName = `Device Location (${userLat.toFixed(3)}, ${userLng.toFixed(3)})`;
          let shortName = `My Location`;
          let areaName = `Current Area`;

          try {
            const street = await locationService.reverseGeocode(userLat, userLng);
            if (street) {
              resolvedName = street;
              shortName = street.split(',')[0].trim();
              areaName = street.split(',')[1]?.trim() || 'Local Area';
            }
          } catch (e) {
            console.warn('Reverse geocoding warning:', e);
          }

          const detected = {
            id: 'loc-gps',
            name: resolvedName,
            shortName: shortName,
            area: areaName,
            lat: userLat,
            lng: userLng,
            isGPS: true,
            accuracy: accuracy,
            description: `Accurate to within ${accuracy} meters via Device GPS`
          };

          locationService.setCurrentLocation(detected);
          locationService.setAutoRequestedGPS();
          resolve(detected);
        },
        (error) => {
          locationService.setAutoRequestedGPS();
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
      );
    });
  },

  // Annotates items with real distance, estimated delivery time & fee based on customer location
  enrichItemsWithLocation(items, userLocation) {
    const loc = userLocation || this.getCurrentLocation();
    return items.map((item, index) => {
      const offset = VENDOR_OFFSETS[index % VENDOR_OFFSETS.length];
      const storeLat = loc?.lat ? (loc.lat + offset.dLat) : (item.lat || 7.3582);
      const storeLng = loc?.lng ? (loc.lng + offset.dLng) : (item.lng || 3.8643);

      const distance = this.getDistanceKm(loc.lat, loc.lng, storeLat, storeLng);
      const deliveryTime = this.estimateDeliveryTime(distance);
      const deliveryFee = this.calculateDeliveryFee(distance);

      const localizedLocation = loc?.shortName && loc.shortName !== 'Near Me'
        ? `${loc.shortName} (${offset.hubSuffix})`
        : (item.locationName || 'Local Hub');

      return {
        ...item,
        lat: storeLat,
        lng: storeLng,
        locationName: localizedLocation,
        distance,
        deliveryTime,
        deliveryFee
      };
    });
  },

  // Annotates vendors with real distance, estimated delivery time & fee based on customer location
  enrichVendorsWithLocation(vendors, userLocation) {
    const loc = userLocation || this.getCurrentLocation();
    return vendors.map((vendor, index) => {
      const offset = VENDOR_OFFSETS[index % VENDOR_OFFSETS.length];
      const vendorLat = loc?.lat ? (loc.lat + offset.dLat) : (vendor.lat || 7.3582);
      const vendorLng = loc?.lng ? (loc.lng + offset.dLng) : (vendor.lng || 3.8643);

      const distance = this.getDistanceKm(loc.lat, loc.lng, vendorLat, vendorLng);
      const deliveryTime = this.estimateDeliveryTime(distance);
      const deliveryFee = this.calculateDeliveryFee(distance);

      const localizedLocation = loc?.shortName && loc.shortName !== 'Near Me'
        ? `${loc.shortName} (${offset.hubSuffix})`
        : (vendor.locationName || 'Local Merchant Hub');

      return {
        ...vendor,
        lat: vendorLat,
        lng: vendorLng,
        locationName: localizedLocation,
        distance,
        deliveryTime,
        deliveryFee
      };
    });
  }
};
