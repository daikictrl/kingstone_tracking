import React, { useState, FormEvent, useEffect } from 'react';
import { X, MapPin } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { geocodeLocation } from '../../lib/geocoding';
import { useToast } from './Toast';

interface Shipment {
  id: string;
  tracking_id: string;
  current_city: string;
  current_country: string;
  latitude: number;
  longitude: number;
}

interface UpdateLocationModalProps {
  isOpen: boolean;
  shipment: Shipment | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UpdateLocationModal({ isOpen, shipment, onClose, onSuccess }: UpdateLocationModalProps) {
  const [loading, setLoading] = useState(false);
  const [geoError, setGeoError] = useState('');
  const { showToast } = useToast();

  const [form, setForm] = useState({
    new_city: '',
    new_country: '',
  });

  useEffect(() => {
    if (!isOpen) {
      setForm({ new_city: '', new_country: '' });
      setGeoError('');
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setGeoError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!shipment) return;
    setLoading(true);
    setGeoError('');

    try {
      // Step 1: Geocode new location
      const coords = await geocodeLocation(form.new_city, form.new_country);
      if (!coords) {
        setGeoError('Could not find coordinates for that location. Please check the city and country.');
        setLoading(false);
        return;
      }

      // Step 2: Archive current location to shipment_history
      const { error: historyError } = await supabase.from('shipment_history').insert({
        shipment_id: shipment.id,
        city: shipment.current_city,
        country: shipment.current_country,
        latitude: shipment.latitude,
        longitude: shipment.longitude,
      });

      if (historyError) throw historyError;

      // Step 3: Update shipment with new location
      const { error: updateError } = await supabase
        .from('shipments')
        .update({
          current_city: form.new_city,
          current_country: form.new_country,
          latitude: coords.lat,
          longitude: coords.lng,
        })
        .eq('id', shipment.id);

      if (updateError) throw updateError;

      showToast('Location updated successfully!', 'success');
      onSuccess();
      onClose();
    } catch (error: any) {
      showToast(error.message || 'Failed to update location', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !shipment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
      >
        {/* Header */}
        <div className="border-b border-gray-100 px-6 py-4 rounded-t-2xl flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#0A1F44]">Update Location</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Current location info */}
        <div className="px-6 pt-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Current Location</p>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#FF6B35]" />
              <span className="text-sm font-medium text-gray-800">
                {shipment.current_city}, {shipment.current_country}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Tracking: {shipment.tracking_id}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">New City</label>
            <input
              name="new_city"
              value={form.new_city}
              onChange={handleChange}
              required
              placeholder="Enter new city"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none text-sm transition-colors ${geoError ? 'border-red-400' : 'border-gray-300'}`}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Country</label>
            <input
              name="new_country"
              value={form.new_country}
              onChange={handleChange}
              required
              placeholder="Enter new country"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none text-sm transition-colors ${geoError ? 'border-red-400' : 'border-gray-300'}`}
            />
          </div>

          {geoError && (
            <p className="text-red-500 text-sm font-medium">{geoError}</p>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF6B35] hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-[#FF6B35]/20 disabled:opacity-70 disabled:cursor-not-allowed text-sm tracking-wide"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating Location...
                </span>
              ) : (
                'Update Location'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
