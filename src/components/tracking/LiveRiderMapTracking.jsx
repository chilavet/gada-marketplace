import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Navigation, MapPin, Bike, Compass, ExternalLink, RefreshCw,
  Clock, ShieldCheck, CheckCircle2, Store, Radio, Layers, Flag, Eye
} from 'lucide-react';
import { locationService } from '../../services/locationService';
import { playStatusNotificationChime } from '../../lib/soundNotifications';

export function LiveRiderMapTracking({
  orderId = 'GADA-8291',
  riderName = 'Babatunde Adeleke',
  riderPhone = '+234 907 268 8238',
  storeName = 'Festac Central Hub',
  destinationAddress = 'Plot 202 Festac Town, Lagos',
  city = 'Lagos',
  initialEta = 18,
  isOutForDelivery = true,
  onDelivered
}) {
  // Waypoint nodes along the road corridor
  const waypoints = useMemo(() => {
    if (city === 'Abuja') {
      return [
        { lat: 9.0765, lng: 7.4720, street: 'Departed Wuse II Merchant Hub', angle: 45, x: 12, y: 80 },
        { lat: 9.0785, lng: 7.4760, street: 'Navigating Aminu Kano Crescent', angle: 30, x: 35, y: 62 },
        { lat: 9.0805, lng: 7.4810, street: 'Crossing Ademola Adetokunbo Junction', angle: 60, x: 62, y: 44 },
        { lat: 9.0818, lng: 7.4845, street: 'Entering Destination Gate / Avenue', angle: 15, x: 82, y: 28 },
        { lat: 9.0820, lng: 7.4850, street: 'Arrived at Customer Doorstep', angle: 0, x: 92, y: 18 }
      ];
    }
    // Lagos Corridor (Festac Town / Amuwo Odofin)
    return [
      { lat: 6.4698, lng: 3.2842, street: 'Departed Festac Central Merchant Hub', angle: 95, x: 12, y: 82 },
      { lat: 6.4650, lng: 3.2880, street: 'En route via 2nd Avenue Commercial Way', angle: 110, x: 36, y: 64 },
      { lat: 6.4600, lng: 3.2925, street: 'Turning into 21 Road Express Junction', angle: 80, x: 58, y: 45 },
      { lat: 6.4565, lng: 3.2960, street: 'Approaching Estate Security Gate', angle: 45, x: 78, y: 30 },
      { lat: 6.4550, lng: 3.2980, street: 'Arrived at Customer Doorstep', angle: 0, x: 92, y: 18 }
    ];
  }, [city]);

  // Route progression percentage (0 to 100)
  const [progress, setProgress] = useState(25);
  const [speedKmh, setSpeedKmh] = useState(38);
  const [viewMode, setViewMode] = useState('radar'); // 'radar' (interactive vector road map) | 'google' (Google Maps embed)
  const [isRefreshing, setIsRefreshing] = useState(false);
  const deliveredTriggeredRef = useRef(false);

  // Live real-time vehicle movement ticker (ticks every 1.8 seconds)
  useEffect(() => {
    if (!isOutForDelivery) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (!deliveredTriggeredRef.current) {
            deliveredTriggeredRef.current = true;
            playStatusNotificationChime();
            if (onDelivered) onDelivered();
          }
          return 100;
        }

        // Advance smoothly between 2.5% to 5.5% per tick
        const step = Math.random() * 3 + 2.5;
        const next = Math.min(prev + step, 100);

        if (next >= 100 && !deliveredTriggeredRef.current) {
          deliveredTriggeredRef.current = true;
          playStatusNotificationChime();
          if (onDelivered) {
            setTimeout(() => onDelivered(), 800);
          }
        }
        return Number(next.toFixed(1));
      });

      // Realistic speed fluctuation
      setSpeedKmh((prev) => {
        if (progress >= 95) return 8; // Slow down as he approaches gate
        return Math.floor(Math.random() * 14) + 30;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [isOutForDelivery, progress, onDelivered]);

  // Compute live rider coordinates, current street, and vehicle angle
  const currentRiderState = useMemo(() => {
    const totalSegments = waypoints.length - 1;
    const progressFraction = Math.min(progress / 100, 1);
    const scaledIndex = progressFraction * totalSegments;
    const segmentIndex = Math.min(Math.floor(scaledIndex), totalSegments - 1);
    const segmentProgress = scaledIndex - segmentIndex;

    const currentWP = waypoints[segmentIndex];
    const nextWP = waypoints[Math.min(segmentIndex + 1, totalSegments)];

    // Interpolate lat/lng
    const lat = currentWP.lat + (nextWP.lat - currentWP.lat) * segmentProgress;
    const lng = currentWP.lng + (nextWP.lng - currentWP.lng) * segmentProgress;

    // Interpolate 2D SVG vector position
    const x = currentWP.x + (nextWP.x - currentWP.x) * segmentProgress;
    const y = currentWP.y + (nextWP.y - currentWP.y) * segmentProgress;

    return {
      lat: Number(lat.toFixed(6)),
      lng: Number(lng.toFixed(6)),
      x,
      y,
      street: progress >= 100 ? 'Delivered at Doorstep' : currentWP.street,
      angle: currentWP.angle
    };
  }, [waypoints, progress]);

  // Dynamic remaining metrics
  const totalDistanceKm = 3.2;
  const remainingKm = Math.max(0, (totalDistanceKm * (1 - progress / 100))).toFixed(1);
  const remainingMeters = Math.max(0, Math.round(totalDistanceKm * 1000 * (1 - progress / 100)));
  const dynamicEtaMins = Math.max(0, Math.round(initialEta * (1 - progress / 100)));

  // Google Maps embed URL with live rider coordinates pin
  const googleMapEmbedUrl = useMemo(() => {
    return locationService.getGoogleMapEmbedUrl(
      currentRiderState.lat,
      currentRiderState.lng,
      16
    );
  }, [currentRiderState.lat, currentRiderState.lng]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    playStatusNotificationChime();
    setTimeout(() => {
      setProgress((prev) => Math.min(prev + 5, 100));
      setIsRefreshing(false);
    }, 500);
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm space-y-0 animate-fade-in">
      {/* Top Banner: Status & ETA */}
      <div className="bg-gray-900 text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-9 w-9 rounded-full bg-amber-400 opacity-60" />
            <div className="relative w-9 h-9 rounded-full bg-amber-500 text-gray-950 flex items-center justify-center shadow">
              <Bike size={20} className="animate-bounce" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                Live Courier Radar
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono border border-emerald-500/30">
                ● LIVE GPS 4G
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
              {progress >= 100 ? (
                <span className="text-emerald-400 font-extrabold">🎉 Courier Arrived at Destination!</span>
              ) : (
                <span>{riderName} is en route</span>
              )}
            </h3>
          </div>
        </div>

        {/* Dynamic Telemetry Stats & Mode Toggle */}
        <div className="flex items-center gap-2.5">
          <div className="bg-gray-800/90 border border-gray-700 rounded-2xl px-3.5 py-2 text-right">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Arrival Window</span>
            <span className="text-sm sm:text-base font-extrabold text-amber-400">
              {progress >= 100 ? (
                <span className="text-emerald-400">Delivered</span>
              ) : remainingMeters < 100 ? (
                <span>Arriving at Gate!</span>
              ) : (
                <span>~{dynamicEtaMins} mins ({remainingKm} km)</span>
              )}
            </span>
          </div>

          {/* Toggle between Vector Map and Google Maps Embed */}
          <button
            type="button"
            onClick={() => setViewMode((m) => (m === 'radar' ? 'google' : 'radar'))}
            className="p-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 transition flex items-center gap-1 text-xs font-bold"
            title="Switch map view"
          >
            <Layers size={15} className="text-amber-400" />
            <span className="hidden sm:inline">{viewMode === 'radar' ? 'Satellite Map' : 'Radar Map'}</span>
          </button>

          <button
            type="button"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 transition"
            title="Fast-forward GPS telemetry"
          >
            <RefreshCw size={15} className={isRefreshing ? 'animate-spin text-amber-400' : ''} />
          </button>
        </div>
      </div>

      {/* Main Map Viewport */}
      <div className="relative w-full h-[340px] sm:h-[400px] bg-slate-900 overflow-hidden">
        {viewMode === 'google' ? (
          /* Google Maps Embed Mode */
          <iframe
            key={`${currentRiderState.lat}-${currentRiderState.lng}`}
            title="Live Courier GPS Location"
            src={googleMapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 'none', filter: 'contrast(1.05)' }}
            loading="lazy"
          />
        ) : (
          /* Interactive High-Precision Vector Road Map */
          <div className="relative w-full h-full bg-[#111827] select-none">
            {/* Dark Mode City Grid Blueprint Background */}
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="city-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
                </pattern>
                <linearGradient id="route-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="50%" stopColor="#FBBF24" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>

              <rect width="100%" height="100%" fill="url(#city-grid)" />

              {/* City Avenues & Street Lines */}
              <path d="M 0 120 Q 300 150 900 100" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="14" />
              <path d="M 80 0 Q 150 250 220 500" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="16" />
              <path d="M 500 0 Q 550 250 620 500" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="14" />
              <path d="M 0 320 Q 450 280 900 350" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="18" />

              {/* Actual Traveled & Active Delivery Route Polyline */}
              <polyline
                points={waypoints.map((w) => `${w.x}%,${w.y}%`).join(' ')}
                fill="none"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <polyline
                points={waypoints.map((w) => `${w.x}%,${w.y}%`).join(' ')}
                fill="none"
                stroke="url(#route-gradient)"
                strokeWidth="5"
                strokeDasharray="6,4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-[pulse_3s_ease-in-out_infinite]"
              />
            </svg>

            {/* Waypoint 1: Store Hub Marker */}
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
              style={{ left: `${waypoints[0].x}%`, top: `${waypoints[0].y}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-amber-500 text-gray-950 font-bold flex items-center justify-center shadow-lg border-2 border-white">
                <Store size={15} />
              </div>
              <span className="mt-1 px-2 py-0.5 bg-gray-900/90 text-white text-[10px] font-bold rounded shadow backdrop-blur whitespace-nowrap">
                {storeName}
              </span>
            </div>

            {/* Waypoint 5: Customer Destination Marker */}
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
              style={{ left: `${waypoints[waypoints.length - 1].x}%`, top: `${waypoints[waypoints.length - 1].y}%` }}
            >
              <div className="relative">
                <span className="animate-ping absolute -top-1 -left-1 w-9 h-9 rounded-full bg-emerald-400 opacity-60" />
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center shadow-lg border-2 border-white relative">
                  <MapPin size={16} />
                </div>
              </div>
              <span className="mt-1 px-2 py-0.5 bg-emerald-950/90 text-emerald-300 text-[10px] font-bold rounded shadow backdrop-blur whitespace-nowrap border border-emerald-500/30">
                Doorstep ({destinationAddress.split(',')[0]})
              </span>
            </div>

            {/* LIVE MOVING RIDER BEACON */}
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-linear pointer-events-none z-20 flex flex-col items-center"
              style={{
                left: `${currentRiderState.x}%`,
                top: `${currentRiderState.y}%`
              }}
            >
              {/* Radar Pulsing Rings */}
              <div className="relative flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-14 w-14 rounded-full bg-amber-400 opacity-75" />
                <span className="animate-pulse absolute inline-flex h-10 w-10 rounded-full bg-amber-500 opacity-40" />

                <div
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-gray-950 font-black flex items-center justify-center shadow-2xl border-2 border-white transform transition-transform duration-500"
                  style={{ transform: `rotate(${currentRiderState.angle}deg)` }}
                >
                  <Bike size={20} className="text-gray-950" />
                </div>
              </div>

              {/* Rider Live Speech Bubble HUD */}
              <div className="mt-1 px-2.5 py-1 rounded-full bg-gray-900/95 text-white text-[11px] font-bold shadow-xl border border-amber-500/40 flex items-center gap-1.5 whitespace-nowrap">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>{riderName} ({speedKmh} km/h)</span>
              </div>
            </div>
          </div>
        )}

        {/* Floating Telemetry HUD Overlay (Active in both modes) */}
        <div className="absolute top-3 left-3 right-3 sm:right-auto flex flex-col gap-2 pointer-events-none z-30">
          {/* Signal & GPS Pill */}
          <div className="bg-gray-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-md flex items-center gap-2 border border-gray-700/80 w-fit pointer-events-auto">
            <Radio size={13} className="text-emerald-400 animate-pulse" />
            <span>4G Rider GPS:</span>
            <span className="font-mono text-amber-300 text-[11px]">
              {currentRiderState.lat.toFixed(4)}°N, {currentRiderState.lng.toFixed(4)}°E
            </span>
          </div>

          {/* Current Corridor Announcement */}
          <div className="bg-white/95 backdrop-blur-md text-gray-900 p-2.5 rounded-2xl text-xs shadow-md border border-gray-200/90 flex items-center gap-2.5 w-fit pointer-events-auto">
            <Compass size={14} className="text-amber-500 animate-spin [animation-duration:8s] shrink-0" />
            <span className="font-bold text-gray-800">{currentRiderState.street}</span>
          </div>
        </div>

        {/* Bottom Corner HUD */}
        <div className="absolute bottom-3 left-3 bg-gray-900/90 backdrop-blur-md text-white rounded-xl px-3 py-1.5 border border-gray-700 text-[11px] font-semibold flex items-center gap-2 shadow-sm pointer-events-auto z-30">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Live Telematics • TVS Neo Courier Bike</span>
        </div>

        {/* External Google Maps Button */}
        <a
          href={`https://www.google.com/maps/dir/?api=1&origin=${currentRiderState.lat},${currentRiderState.lng}&destination=${waypoints[waypoints.length - 1].lat},${waypoints[waypoints.length - 1].lng}&travelmode=driving`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-3 right-3 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-gray-950 text-xs font-extrabold rounded-xl shadow-lg flex items-center gap-1.5 transition border border-amber-400 pointer-events-auto z-30"
        >
          <span>Google Maps App</span>
          <ExternalLink size={13} />
        </a>
      </div>

      {/* Progress Bar & Telemetry Strip */}
      <div className="p-4 sm:p-5 bg-white border-t border-gray-100 space-y-3">
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-gray-700">
            <span className="flex items-center gap-1 text-gray-600">
              <Store size={14} className="text-amber-600" />
              <span>{storeName}</span>
            </span>
            <span className={progress >= 100 ? 'text-emerald-600 font-extrabold' : 'text-amber-600'}>
              {progress >= 100 ? '100% (Delivered)' : `${progress}% Completed (${remainingKm} km remaining)`}
            </span>
            <span className="flex items-center gap-1 text-gray-900">
              <MapPin size={14} className="text-emerald-600" />
              <span>{destinationAddress.split(',')[0]}</span>
            </span>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden border border-gray-200">
            <div
              className="bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Live Street Corridor:</span>
            <strong className="text-gray-900 font-bold">{currentRiderState.street}</strong>
          </div>
          <div className="text-[11px] text-gray-500 flex items-center gap-1">
            <CheckCircle2 size={13} className="text-emerald-600" />
            <span>Telemetry calibrated via Gadaride Logistics Driver App</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveRiderMapTracking;
