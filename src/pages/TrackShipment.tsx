import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, Package, Truck, CheckCircle, Clock, Plane, Ship, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { geocodeLocation } from '../lib/geocoding';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface ShipmentResult {
  id: string;
  tracking_id: string;
  sender_name: string;
  receiver_name: string;
  weight: number;
  transport_type: string;
  status: string;
  origin_city: string;
  origin_country: string;
  destination_city: string;
  destination_country: string;
  current_city: string;
  current_country: string;
  latitude: number;
  longitude: number;
  created_at: string;
  origin_lat?: number;
  origin_lng?: number;
}

interface HistoryEntry {
  id: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

const statusConfig: Record<string, { color: string; bg: string; border: string; icon: React.ElementType }> = {
  Pending: { color: 'text-gray-700', bg: 'bg-gray-100', border: 'border-gray-200', icon: Clock },
  'In Transit': { color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', icon: Truck },
  Delivered: { color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle },
  Delayed: { color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', icon: AlertTriangle },
};

const transportIcon: Record<string, React.ElementType> = {
  Air: Plane,
  Sea: Ship,
  Road: Truck,
};

export default function TrackShipment() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlId = searchParams.get('id') || '';

  const [trackingNumber, setTrackingNumber] = useState(urlId);
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<ShipmentResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [error, setError] = useState('');
  const [mapError, setMapError] = useState(false);
  const [initialFetchDone, setInitialFetchDone] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  const fetchTrackingDetails = async (idToTrack: string) => {
    setError('');
    setResult(null);
    setHistory([]);
    setMapError(false);

    if (!idToTrack.trim()) {
      setError('Please enter a valid tracking number.');
      return;
    }

    setIsSearching(true);
    setSearchParams({ id: idToTrack.trim().toUpperCase() });

    try {
      // Query shipment
      const { data: shipment, error: shipError } = await supabase
        .from('shipments')
        .select('*')
        .eq('tracking_id', idToTrack.trim().toUpperCase())
        .maybeSingle();

      if (shipError) throw shipError;

      if (!shipment) {
        setError('No shipment found with that tracking ID.');
        setIsSearching(false);
        return;
      }

      // Query history
      const { data: historyData, error: histError } = await supabase
        .from('shipment_history')
        .select('*')
        .eq('shipment_id', shipment.id)
        .order('timestamp', { ascending: true });

      if (histError) throw histError;

      // Geocode origin so we can draw the full polyline
      try {
        const originCoords = await geocodeLocation(shipment.origin_city, shipment.origin_country);
        if (originCoords) {
          shipment.origin_lat = originCoords.lat;
          shipment.origin_lng = originCoords.lng;
        }
      } catch (err) {
        console.warn('Failed to geocode origin:', err);
      }

      setResult(shipment);
      setHistory(historyData || []);
    } catch (err: any) {
      setError(err.message || 'Connection failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (urlId && !initialFetchDone) {
      setInitialFetchDone(true);
      fetchTrackingDetails(urlId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlId, initialFetchDone]);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrackingDetails(trackingNumber);
  };

  // Initialize/update Leaflet map
  useEffect(() => {
    if (!result || !mapContainerRef.current) return;

    // Cleanup existing map
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    try {
      const lat = Number(result.latitude);
      const lng = Number(result.longitude);

      if (isNaN(lat) || isNaN(lng)) {
        setMapError(true);
        return;
      }

      const map = L.map(mapContainerRef.current).setView([lat, lng], 5);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      // Custom marker icon
      const markerIcon = L.divIcon({
        className: '',
        html: `<div style="width:32px;height:32px;background:#FF6B35;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      // Current location marker
      L.marker([lat, lng], { icon: markerIcon })
        .addTo(map)
        .bindPopup(`<strong>${result.current_city}, ${result.current_country}</strong><br/>Current Location`)
        .openPopup();

      // Map path: strictly Origin to Current Location
      const coords: [number, number][] = [];

      if (result.origin_lat != null && result.origin_lng != null) {
        const originIcon = L.divIcon({
          className: '',
          html: `<div style="width:16px;height:16px;background:#0A1F44;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.2);"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });

        coords.push([result.origin_lat, result.origin_lng]);
        
        L.marker([result.origin_lat, result.origin_lng], { icon: originIcon })
          .addTo(map)
          .bindPopup(`<strong>${result.origin_city}, ${result.origin_country}</strong><br/>Origin`);
      }

      // Add current location to polyline
      coords.push([lat, lng]);

      if (coords.length >= 2) {
        L.polyline(coords, {
          color: '#FF6B35',
          weight: 3,
          opacity: 0.8,
          dashArray: '8, 8',
        }).addTo(map);

        // Fit bounds
        map.fitBounds(L.latLngBounds(coords.map(c => L.latLng(c[0], c[1]))).pad(0.2));
      }

      // Force map resize
      setTimeout(() => map.invalidateSize(), 100);
    } catch {
      setMapError(true);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [result, history]);

  const statusConf = result ? statusConfig[result.status] || statusConfig.Pending : statusConfig.Pending;
  const TransportIcon = result ? (transportIcon[result.transport_type] || Truck) : Truck;

  return (
    <div className="flex flex-col min-h-screen bg-brand-light">
      {/* Header */}
      <section className="relative h-[400px] flex items-center justify-center text-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80"
            alt="Modern logistics tracking"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#003380]/95 to-[#003380]/70 mix-blend-multiply"></div>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Track Your <span className="text-brand-orange">Shipment</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200">
            Enter your tracking number below to get real-time updates on your cargo's location and status.
          </p>
        </div>
      </section>

      {/* Tracking Form */}
      <section className="py-12 -mt-10 relative z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Package className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter Tracking Number (e.g., TRKX7A2F9Q)"
                  className="block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-colors text-lg"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="inline-flex justify-center items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-brand-orange hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSearching ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Searching...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Track
                  </span>
                )}
              </button>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                <span className="font-medium">{error}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results Section */}
      {result && (
        <section className="py-8 pb-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {/* Result Header */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              <div className="bg-brand-blue p-6 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wider mb-1">Tracking Number</h3>
                  <div className="text-2xl font-bold font-mono">{result.tracking_id}</div>
                </div>
                <div className={`${statusConf.bg} px-4 py-2 rounded-full border ${statusConf.border}`}>
                  <span className={`${statusConf.color} font-bold flex items-center gap-2 text-sm`}>
                    <statusConf.icon className="h-4 w-4" />
                    {result.status}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="bg-brand-light p-2.5 rounded-full flex-shrink-0">
                      <Package className="h-5 w-5 text-brand-blue" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Sender</p>
                      <p className="text-gray-900 font-semibold text-sm">{result.sender_name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-brand-light p-2.5 rounded-full flex-shrink-0">
                      <Package className="h-5 w-5 text-brand-blue" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Receiver</p>
                      <p className="text-gray-900 font-semibold text-sm">{result.receiver_name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-brand-light p-2.5 rounded-full flex-shrink-0">
                      <TransportIcon className="h-5 w-5 text-brand-blue" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Transport</p>
                      <p className="text-gray-900 font-semibold text-sm">{result.transport_type}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-brand-light p-2.5 rounded-full flex-shrink-0">
                      <MapPin className="h-5 w-5 text-brand-blue" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Origin</p>
                      <p className="text-gray-900 font-semibold text-sm">{result.origin_city}, {result.origin_country}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-brand-light p-2.5 rounded-full flex-shrink-0">
                      <MapPin className="h-5 w-5 text-brand-orange" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Destination</p>
                      <p className="text-gray-900 font-semibold text-sm">{result.destination_city}, {result.destination_country}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-orange-50 p-2.5 rounded-full flex-shrink-0">
                      <MapPin className="h-5 w-5 text-brand-orange" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Current Location</p>
                      <p className="text-gray-900 font-semibold text-sm">{result.current_city}, {result.current_country}</p>
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-lg font-bold text-brand-blue mb-4">Live Location</h3>
                  {mapError ? (
                    <div className="bg-gray-50 rounded-2xl p-6 text-center">
                      <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 font-medium">{result.current_city}, {result.current_country}</p>
                      <p className="text-gray-400 text-sm mt-1">
                        Coordinates: {result.latitude}, {result.longitude}
                      </p>
                    </div>
                  ) : (
                    <div
                      ref={mapContainerRef}
                      className="w-full h-[350px] sm:h-[400px] rounded-2xl border border-gray-200 overflow-hidden"
                    ></div>
                  )}
                </div>
              </div>
            </div>

            {/* History Timeline */}
            {history.length > 0 && (
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 md:p-8">
                <h3 className="text-lg font-bold text-brand-blue mb-6">Shipment History</h3>
                <div className="relative border-l-2 border-gray-200 ml-4 space-y-6">
                  {history.map((h, index) => (
                    <div key={h.id} className="relative pl-8">
                      <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 ${
                        index === history.length - 1
                          ? 'bg-brand-orange border-brand-orange'
                          : 'bg-[#0A1F44] border-[#0A1F44]'
                      }`}>
                        {index === history.length - 1 && (
                          <CheckCircle className="h-4 w-4 text-white absolute -top-[2px] -left-[2px]" />
                        )}
                      </div>
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-1">
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">
                            {h.city}, {h.country}
                          </h4>
                        </div>
                        <div className="text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full inline-block w-fit">
                          {new Date(h.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Current location as last entry */}
                  <div className="relative pl-8">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 bg-brand-orange border-brand-orange animate-pulse"></div>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-1">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {result.current_city}, {result.current_country}
                        </h4>
                        <p className="text-xs text-brand-orange font-bold">Current Location</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
