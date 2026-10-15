// Google Maps and Location Service for Gada Marketplace & Logistics
// Accurate GPS coordinates, distance calculation (Haversine formula), and Google Map embedding.

export const ALL_LOCATIONS_OPTION = {
  id: 'loc-all',
  name: 'All Locations (Ibadan)',
  shortName: 'All Areas',
  area: 'City-wide',
  lat: 7.3980,
  lng: 3.8850,
  description: 'Showcase items across all stores and markets in Ibadan'
};

export const POPULAR_LOCATIONS = [
  ALL_LOCATIONS_OPTION,
  {
    id: 'loc-ringroad',
    name: 'Ring Road, Ibadan',
    shortName: 'Ring Road',
    area: 'Ibadan South West',
    lat: 7.3582,
    lng: 3.8643,
    description: 'Mobil, Palms Mall, Adeoyo Hospital axis'
  },
  {
    id: 'loc-bodija',
    name: 'Bodija Estate & Market',
    shortName: 'Bodija',
    area: 'Ibadan North',
    lat: 7.4350,
    lng: 3.9050,
    description: 'Bodija Market, Secretariat, Housing Estate'
  },
  {
    id: 'loc-dugbe',
    name: 'Dugbe Commercial Central',
    shortName: 'Dugbe',
    area: 'Central Ibadan',
    lat: 7.3872,
    lng: 3.8824,
    description: 'Cocoa House, Post Office, Mall axis'
  },
  {
    id: 'loc-ui',
    name: 'UI / Samonda / Agbowo',
    shortName: 'UI / Samonda',
    area: 'Ibadan North',
    lat: 7.4485,
    lng: 3.8992,
    description: 'University of Ibadan, The Polytechnic, Aerodrome'
  },
  {
    id: 'loc-jericho',
    name: 'Jericho GRA',
    shortName: 'Jericho',
    area: 'Ibadan North West',
    lat: 7.3980,
    lng: 3.8590,
    description: 'Jericho Nursing Home, Golf Club, Onireke'
  },
  {
    id: 'loc-oluyole',
    name: 'Oluyole Estate',
    shortName: 'Oluyole',
    area: 'Ibadan South West',
    lat: 7.3510,
    lng: 3.8540,
    description: 'Industrial Estate, 77 Hotel, Ring Road link'
  },
  {
    id: 'loc-challenge',
    name: 'Challenge / Molete',
    shortName: 'Challenge',
    area: 'Ibadan South',
    lat: 7.3450,
    lng: 3.8760,
    description: 'Toll Gate, Felele, Express link'
  },
  {
    id: 'loc-akobo',
    name: 'Akobo / Basorun',
    shortName: 'Akobo',
    area: 'Ibadan North East',
    lat: 7.4260,
    lng: 3.9310,
    description: 'General Gas, Oju Irin, Basorun Market'
  },
  {
    id: 'loc-iworoad',
    name: 'Iwo Road Interchange',
    shortName: 'Iwo Road',
    area: 'Ibadan East',
    lat: 7.4110,
    lng: 3.9390,
    description: 'Expressway interchange, bus terminals'
  },
  {
    id: 'loc-mokola',
    name: 'Mokola Roundabout',
    shortName: 'Mokola',
    area: 'Ibadan Central',
    lat: 7.4080,
    lng: 3.8860,
    description: 'Mokola flyover, cultural centre'
  }
];

const DEFAULT_LOCATION = POPULAR_LOCATIONS[1]; // Ring Road

const LOCATION_STORAGE_KEY = 'gada_customer_location';
const LOCATION_AUTO_REQUESTED_KEY = 'gada_gps_auto_requested';

export const locationService = {
  // Great-circle Haversine formula (km)
  getDistanceKm(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 1.5;
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
    return Math.round(raw / 50) * 50; // rounded to nearest 50 Naira
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
        const city = data.address?.city || data.address?.town || data.address?.state || 'Ibadan';
        if (road) {
          return `${road}, ${city}`;
        }
        return data.display_name.split(',').slice(0, 3).join(', ');
      }
    } catch {
      // fallback to closest hub if network reverse geocoding is unavailable
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
          const accuracy = Math.round(position.coords.accuracy);

          // Find closest known popular hub for friendly region label
          let closestHub = POPULAR_LOCATIONS[1];
          let minDistance = Infinity;

          POPULAR_LOCATIONS.forEach((hub) => {
            if (hub.id === 'loc-all') return;
            const dist = locationService.getDistanceKm(userLat, userLng, hub.lat, hub.lng);
            if (dist < minDistance) {
              minDistance = dist;
              closestHub = hub;
            }
          });

          // Attempt to get exact street name from reverse geocoder
          let resolvedName = `GPS Location near ${closestHub.name}`;
          try {
            const street = await locationService.reverseGeocode(userLat, userLng);
            if (street) {
              resolvedName = street;
            }
          } catch {
            // Keep fallback
          }

          const detected = {
            id: 'loc-gps',
            name: resolvedName,
            shortName: closestHub.shortName || 'GPS Location',
            area: closestHub.area || 'Current Location',
            lat: userLat,
            lng: userLng,
            isGPS: true,
            accuracy: accuracy,
            description: `Accurate to within ${accuracy} meters via Google Maps/GPS`
          };

          locationService.setCurrentLocation(detected);
          locationService.setAutoRequestedGPS();
          resolve(detected);
        },
        (error) => {
          locationService.setAutoRequestedGPS();
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
      );
    });
  },

  // Annotates items with real distance, estimated delivery time & fee based on customer location
  enrichItemsWithLocation(items, userLocation) {
    const loc = userLocation || this.getCurrentLocation();
    return items.map((item) => {
      const storeLat = item.lat || 7.3872;
      const storeLng = item.lng || 3.8824;
      const distance = this.getDistanceKm(loc.lat, loc.lng, storeLat, storeLng);
      const deliveryTime = this.estimateDeliveryTime(distance);
      const deliveryFee = this.calculateDeliveryFee(distance);

      return {
        ...item,
        distance,
        deliveryTime,
        deliveryFee
      };
    });
  },

  // Annotates vendors with real distance, estimated delivery time & fee based on customer location
  enrichVendorsWithLocation(vendors, userLocation) {
    const loc = userLocation || this.getCurrentLocation();
    return vendors.map((vendor) => {
      const vendorLat = vendor.lat || 7.3872;
      const vendorLng = vendor.lng || 3.8824;
      const distance = this.getDistanceKm(loc.lat, loc.lng, vendorLat, vendorLng);
      const deliveryTime = this.estimateDeliveryTime(distance);
      const deliveryFee = this.calculateDeliveryFee(distance);

      return {
        ...vendor,
        distance,
        deliveryTime,
        deliveryFee
      };
    });
  }
};
