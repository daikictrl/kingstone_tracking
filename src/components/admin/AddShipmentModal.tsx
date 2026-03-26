import React, { useState, FormEvent, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { geocodeLocation } from '../../lib/geocoding';
import { useToast } from './Toast';

interface AddShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddShipmentModal({ isOpen, onClose, onSuccess }: AddShipmentModalProps) {
  const [loading, setLoading] = useState(false);
  const [geoError, setGeoError] = useState('');
  const { showToast } = useToast();

  const [form, setForm] = useState({
    sender_name: '',
    receiver_name: '',
    weight: '',
    transport_type: 'Air',
    status: 'Pending',
    origin_city: '',
    origin_country: '',
    destination_city: '',
    destination_country: '',
    current_city: '',
    current_country: '',
  });

  useEffect(() => {
    if (!isOpen) {
      setForm({
        sender_name: '', receiver_name: '', weight: '', transport_type: 'Air',
        status: 'Pending', origin_city: '', origin_country: '', destination_city: '',
        destination_country: '', current_city: '', current_country: '',
      });
      setGeoError('');
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'current_city' || e.target.name === 'current_country') {
      setGeoError('');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGeoError('');

    try {
      // Step 1: Generate tracking ID
      const { data: trackingData, error: trackingError } = await supabase.rpc('generate_tracking_id');
      if (trackingError) throw trackingError;

      // Step 2: Geocode current location
      const coords = await geocodeLocation(form.current_city, form.current_country);
      if (!coords) {
        setGeoError('Could not find coordinates for that location. Please check the city and country.');
        setLoading(false);
        return;
      }

      // Step 3: Insert shipment
      const { error: insertError } = await supabase.from('shipments').insert({
        tracking_id: trackingData,
        sender_name: form.sender_name,
        receiver_name: form.receiver_name,
        weight: form.weight ? parseFloat(form.weight) : null,
        transport_type: form.transport_type,
        status: form.status,
        origin_city: form.origin_city,
        origin_country: form.origin_country,
        destination_city: form.destination_city,
        destination_country: form.destination_country,
        current_city: form.current_city,
        current_country: form.current_country,
        latitude: coords.lat,
        longitude: coords.lng,
      });

      if (insertError) throw insertError;

      showToast(`Shipment ${trackingData} created successfully!`, 'success');
      onSuccess();
      onClose();
    } catch (error: any) {
      showToast(error.message || 'Failed to create shipment', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-[#0A1F44]">Add New Shipment</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Sender / Receiver */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sender Name</label>
              <input name="sender_name" value={form.sender_name} onChange={handleChange} required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none text-sm transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Receiver Name</label>
              <input name="receiver_name" value={form.receiver_name} onChange={handleChange} required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none text-sm transition-colors" />
            </div>
          </div>

          {/* Weight / Transport / Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Weight (kg)</label>
              <input name="weight" type="number" step="0.01" min="0" value={form.weight} onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none text-sm transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Transport Type</label>
              <select name="transport_type" value={form.transport_type} onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none text-sm transition-colors bg-white">
                <option value="Air">Air</option>
                <option value="Sea">Sea</option>
                <option value="Road">Road</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
              <select name="status" value={form.status} onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none text-sm transition-colors bg-white">
                <option value="Pending">Pending</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
                <option value="Delayed">Delayed</option>
              </select>
            </div>
          </div>

          {/* Origin */}
          <div>
            <p className="text-sm font-bold text-[#0A1F44] mb-2 uppercase tracking-wider">Origin</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">City</label>
                <input name="origin_city" value={form.origin_city} onChange={handleChange} required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none text-sm transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Country</label>
                <input name="origin_country" value={form.origin_country} onChange={handleChange} required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none text-sm transition-colors" />
              </div>
            </div>
          </div>

          {/* Destination */}
          <div>
            <p className="text-sm font-bold text-[#0A1F44] mb-2 uppercase tracking-wider">Destination</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">City</label>
                <input name="destination_city" value={form.destination_city} onChange={handleChange} required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none text-sm transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Country</label>
                <input name="destination_country" value={form.destination_country} onChange={handleChange} required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none text-sm transition-colors" />
              </div>
            </div>
          </div>

          {/* Current Location */}
          <div>
            <p className="text-sm font-bold text-[#0A1F44] mb-2 uppercase tracking-wider">Current Location</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">City</label>
                <input name="current_city" value={form.current_city} onChange={handleChange} required
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none text-sm transition-colors ${geoError ? 'border-red-400' : 'border-gray-300'}`} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Country</label>
                <input name="current_country" value={form.current_country} onChange={handleChange} required
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none text-sm transition-colors ${geoError ? 'border-red-400' : 'border-gray-300'}`} />
              </div>
            </div>
            {geoError && (
              <p className="text-red-500 text-sm mt-2 font-medium">{geoError}</p>
            )}
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF6B35] hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-[#FF6B35]/20 disabled:opacity-70 disabled:cursor-not-allowed text-sm tracking-wide"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Shipment...
                </span>
              ) : (
                'Create Shipment'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
