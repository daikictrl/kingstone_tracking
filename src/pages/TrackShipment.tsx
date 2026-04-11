import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, Package, Truck, CheckCircle, Clock, Plane, Ship, AlertTriangle, Mail, Phone } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { geocodeLocation } from '../lib/geocoding';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface ShipmentResult {
  id: string;
  tracking_id: string;
  sender_name: string;
  sender_email: string | null;
  sender_phone: string | null;
  sender_address: string | null;
  receiver_name: string;
  receiver_email: string | null;
  receiver_phone: string | null;
  receiver_address: string | null;
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
  shipment_id?: string;
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
  
  // Map state & connection status
  const [mapError, setMapError] = useState(false);
  const [connectionState, setConnectionState] = useState<'live' | 'reconnecting' | 'disconnected'>('disconnected');
  const [initialFetchDone, setInitialFetchDone] = useState(false);
  
  // Realtime / Polling tracking refs
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const connectionStateRef = useRef<'live' | 'reconnecting' | 'disconnected'>('disconnected');

  // Map refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const currentMarkerRef = useRef<L.Marker | null>(null);
  const originMarkerRef = useRef<L.Marker | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);

  // Sync state to ref to avoid stale closures in timeouts
  useEffect(() => {
    connectionStateRef.current = connectionState;
  }, [connectionState]);

  // Clean up map completely when resetting result
  const destroyMap = () => {
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
      currentMarkerRef.current = null;
      originMarkerRef.current = null;
      polylineRef.current = null;
    }
  };

  const fetchTrackingDetails = async (idToTrack: string) => {
    // Clear state before matching
    setConnectionState('disconnected');
    setError('');
    setResult(null);
    setHistory([]);
    setMapError(false);
    destroyMap();

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

  // Realtime Subscriptions & Polling Fallback
  useEffect(() => {
    // We only create subscription if there is a stable result ID
    if (!result?.id || !result?.tracking_id) return;

    let shipmentsSubscription: ReturnType<typeof supabase.channel> | null = null;
    let historySubscription: ReturnType<typeof supabase.channel> | null = null;
    
    // Scoped reference so we can stop polling correctly
    let localPollInterval: NodeJS.Timeout | null = null;

    const cleanup = () => {
      if (shipmentsSubscription) {
        supabase.removeChannel(shipmentsSubscription);
        shipmentsSubscription = null;
      }
      if (historySubscription) {
        supabase.removeChannel(historySubscription);
        historySubscription = null;
      }
      if (localPollInterval) {
        clearInterval(localPollInterval);
        localPollInterval = null;
      }
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };

    const activatePolling = () => {
      if (localPollInterval) return;
      setConnectionState('reconnecting');
      
      localPollInterval = setInterval(async () => {
        try {
          const { data: newData, error: fetchErr } = await supabase
            .from('shipments')
            .select('*')
            .eq('tracking_id', result.tracking_id)
            .maybeSingle();

          if (!fetchErr && newData) {
            setResult(prev => {
              if (!prev) return prev;
              const hasMoved = prev.latitude !== newData.latitude || prev.longitude !== newData.longitude;
              
              // Only fetch history if location changed
              if (hasMoved) {
                supabase
                  .from('shipment_history')
                  .select('*')
                  .eq('shipment_id', newData.id)
                  .order('timestamp', { ascending: true })
                  .then(historyRes => {
                    if (historyRes.data) setHistory(historyRes.data);
                  });
              }
              return { ...prev, ...newData }; // Merge updates
            });
          }
        } catch (e) {
          console.error("Polling fetch failed", e);
        }
      }, 10000);
      
      pollIntervalRef.current = localPollInterval;
    };

    const setupRealtime = () => {
      cleanup();
      
      shipmentsSubscription = supabase.channel(`shipment-updates-${result.tracking_id}`)
        .on(
          'postgres_changes', 
          { event: 'UPDATE', schema: 'public', table: 'shipments', filter: `tracking_id=eq.${result.tracking_id}` },
          (payload) => {
            if (!payload.new || !payload.new.tracking_id || payload.new.latitude == null || payload.new.longitude == null) return;
            // Update shipment data immediately
            setResult(prev => prev ? ({ ...prev, ...payload.new } as ShipmentResult) : null);
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            setConnectionState('live');
            if (localPollInterval) {
              clearInterval(localPollInterval);
              localPollInterval = null;
              pollIntervalRef.current = null;
              // Re-fetch once to ensure we didn't miss anything
              supabase.from('shipments').select('*').eq('tracking_id', result.tracking_id).maybeSingle().then(res => {
                  if (res.data) setResult(prev => prev ? ({ ...prev, ...res.data } as ShipmentResult) : null);
              });
            }
          } else if (status === 'CHANNEL_ERROR') {
            activatePolling();
          }
        });

      historySubscription = supabase.channel(`shipment-history-${result.id}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'shipment_history', filter: `shipment_id=eq.${result.id}` },
          (payload) => {
            if (!payload.new || payload.new.latitude == null || payload.new.longitude == null) return;
            const newHistory = payload.new as HistoryEntry;
            setHistory(prev => {
                // Prevent duplicate inserts
                if (prev.find(h => h.id === newHistory.id)) return prev;
                return [...prev, newHistory];
            });
          }
        )
        .subscribe();

      // Check if subscribed within 5 seconds, else activate polling
      setTimeout(() => {
        if (connectionStateRef.current !== 'live' && !localPollInterval) {
          activatePolling();
        }
      }, 5000);
    };

    setupRealtime();

    const handleBeforeUnload = () => cleanup();
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      cleanup();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result?.id, result?.tracking_id]); // Dependency specifically on IDs so it doesn't refire on internal state updates

  // On mount: fetch if urlId exists
  useEffect(() => {
    if (urlId && !initialFetchDone) {
      setInitialFetchDone(true);
      fetchTrackingDetails(urlId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlId, initialFetchDone]);

  // Leaflet map management – NEVER destroy the map on updates
  useEffect(() => {
    if (!result || !mapContainerRef.current) return;

    try {
      const lat = Number(result.latitude);
      const lng = Number(result.longitude);

      if (isNaN(lat) || isNaN(lng)) {
        setMapError(true);
        return;
      }
      setMapError(false);

      // Create map once
      if (!mapRef.current) {
        mapRef.current = L.map(mapContainerRef.current).setView([lat, lng], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(mapRef.current);
      }
      const map = mapRef.current;

      // Re-center map to current location (requirement)
      map.setView([lat, lng]);

      const markerIcon = L.divIcon({
        className: '',
        html: `<div style="width:32px;height:32px;background:#FF6B35;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      // Manage the moving current location marker
      if (!currentMarkerRef.current) {
        currentMarkerRef.current = L.marker([lat, lng], { icon: markerIcon }).addTo(map);
      } else {
        currentMarkerRef.current.setLatLng([lat, lng]);
      }
      // Always update popup text
      currentMarkerRef.current.bindPopup(`<strong>${result.current_city}, ${result.current_country}</strong><br/>Current Location`);

      // Draw or update polyline
      const coords: [number, number][] = [];

      // Origin point logic
      if (result.origin_lat != null && result.origin_lng != null) {
        const originIcon = L.divIcon({
          className: '',
          html: `<div style="width:16px;height:16px;background:#0A1F44;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.2);"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });

        coords.push([result.origin_lat, result.origin_lng]);
        
        if (!originMarkerRef.current) {
            originMarkerRef.current = L.marker([result.origin_lat, result.origin_lng], { icon: originIcon })
            .addTo(map)
            .bindPopup(`<strong>${result.origin_city}, ${result.origin_country}</strong><br/>Origin`);
        }
      }

      // Add all history points
      history.forEach(h => {
          if (h.latitude != null && h.longitude != null) {
              coords.push([h.latitude, h.longitude]);
          }
      });

      // Add current location as the end of the polyline
      coords.push([lat, lng]);

      if (coords.length >= 2) {
        if (!polylineRef.current) {
            polylineRef.current = L.polyline(coords, {
                color: '#FF6B35',
                weight: 3,
                opacity: 0.8,
                dashArray: '8, 8',
            }).addTo(map);
        } else {
            polylineRef.current.setLatLngs(coords);
        }
        
        // Fit bounds only if it's the first time drawing polyline or we recently fetched, 
        // but prompt asks to always rebuild polyline and just re-center marker.
        // Doing fitBounds every time might be jarring if user zoomed in, but let's do setView on marker and fitBounds if we just loaded.
        if (history.length === 0) {
           map.fitBounds(L.latLngBounds(coords.map(c => L.latLng(c[0], c[1]))).pad(0.2));
        }
      }

      setTimeout(() => map.invalidateSize(), 100);

    } catch (err) {
      console.error(err);
      setMapError(true);
    }
    // We intentionally do NOT return a map.remove() function here so it survives re-renders.
  }, [result, history]);

  // Clean map up unmount of component only
  useEffect(() => {
    return destroyMap;
  }, []);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrackingDetails(trackingNumber);
  };

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
                  <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold font-mono">{result.tracking_id}</div>
                      {/* Live Badge */}
                      {connectionState === 'live' && (
                        <span className="bg-green-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5 shadow-sm">
                           <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div> Live
                        </span>
                      )}
                      {connectionState === 'reconnecting' && (
                        <span className="bg-orange-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5 shadow-sm">
                           <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div> Reconnecting...
                        </span>
                      )}
                  </div>
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
                      {result.sender_email?.trim() && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <Mail className="h-4 w-4 text-brand-orange opacity-80 flex-shrink-0" />
                          <a href={`mailto:${result.sender_email}`} className="text-xs text-brand-orange hover:underline break-all">{result.sender_email}</a>
                        </div>
                      )}
                      {result.sender_phone?.trim() && (
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <Phone className="h-4 w-4 text-brand-orange opacity-80 flex-shrink-0" />
                          <a href={`tel:${result.sender_phone}`} className="text-xs text-gray-500 hover:underline">{result.sender_phone}</a>
                        </div>
                      )}
                      {result.sender_address?.trim() && (
                        <div className="flex items-start gap-1.5 mt-1.5">
                          <MapPin className="h-4 w-4 text-brand-orange opacity-80 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-gray-500 break-words whitespace-pre-line">{result.sender_address}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-brand-light p-2.5 rounded-full flex-shrink-0">
                      <Package className="h-5 w-5 text-brand-blue" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Receiver</p>
                      <p className="text-gray-900 font-semibold text-sm">{result.receiver_name}</p>
                      {result.receiver_email?.trim() && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <Mail className="h-4 w-4 text-brand-orange opacity-80 flex-shrink-0" />
                          <a href={`mailto:${result.receiver_email}`} className="text-xs text-brand-orange hover:underline break-all">{result.receiver_email}</a>
                        </div>
                      )}
                      {result.receiver_phone?.trim() && (
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <Phone className="h-4 w-4 text-brand-orange opacity-80 flex-shrink-0" />
                          <a href={`tel:${result.receiver_phone}`} className="text-xs text-gray-500 hover:underline">{result.receiver_phone}</a>
                        </div>
                      )}
                      {result.receiver_address?.trim() && (
                        <div className="flex items-start gap-1.5 mt-1.5">
                          <MapPin className="h-4 w-4 text-brand-orange opacity-80 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-gray-500 break-words whitespace-pre-line">{result.receiver_address}</p>
                        </div>
                      )}
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
                    <div className="bg-orange-50 p-2.5 rounded-full flex-shrink-0 transition-colors">
                      <MapPin className="h-5 w-5 text-brand-orange" />
                    </div>
                    <div className="transition-all">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Current Location</p>
                      <p className="text-gray-900 font-semibold text-sm transition-colors">{result.current_city}, {result.current_country}</p>
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
                    <div key={h.id} className="relative pl-8 transition-all">
                      <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 ${
                        index === history.length - 1 && history.length > 0
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
                  <div className="relative pl-8 transition-all">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 bg-brand-orange border-brand-orange animate-pulse"></div>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-1">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm transition-colors">
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
