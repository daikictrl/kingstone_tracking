import React, { useState, FormEvent, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from './Toast';

interface Shipment {
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
}

interface EditShipmentModalProps {
  isOpen: boolean;
  shipment: Shipment | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditShipmentModal({ isOpen, shipment, onClose, onSuccess }: EditShipmentModalProps) {
  const [loading, setLoading] = useState(false);
  const [emailErrors, setEmailErrors] = useState({ sender_email: '', receiver_email: '' });
  const { showToast } = useToast();

  const [form, setForm] = useState({
    sender_name: '',
    sender_email: '',
    sender_phone: '',
    sender_address: '',
    receiver_name: '',
    receiver_email: '',
    receiver_phone: '',
    receiver_address: '',
    weight: '',
    transport_type: 'Air',
    status: 'Pending',
    origin_city: '',
    origin_country: '',
    destination_city: '',
    destination_country: '',
  });

  useEffect(() => {
    if (shipment && isOpen) {
      setForm({
        sender_name: shipment.sender_name || '',
        sender_email: shipment.sender_email || '',
        sender_phone: shipment.sender_phone || '',
        sender_address: shipment.sender_address || '',
        receiver_name: shipment.receiver_name || '',
        receiver_email: shipment.receiver_email || '',
        receiver_phone: shipment.receiver_phone || '',
        receiver_address: shipment.receiver_address || '',
        weight: shipment.weight?.toString() || '',
        transport_type: shipment.transport_type || 'Air',
        status: shipment.status || 'Pending',
        origin_city: shipment.origin_city || '',
        origin_country: shipment.origin_country || '',
        destination_city: shipment.destination_city || '',
        destination_country: shipment.destination_country || '',
      });
      setEmailErrors({ sender_email: '', receiver_email: '' });
    }
  }, [shipment, isOpen]);

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleEmailBlur = (field: 'sender_email' | 'receiver_email') => {
    const val = form[field].trim();
    if (val && !isValidEmail(val)) {
      setEmailErrors(prev => ({ ...prev, [field]: 'Please enter a valid email address.' }));
    } else {
      setEmailErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!shipment) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from('shipments')
        .update({
          sender_name: form.sender_name,
          sender_email: form.sender_email.trim() || null,
          sender_phone: form.sender_phone.trim() || null,
          sender_address: form.sender_address.trim() || null,
          receiver_name: form.receiver_name,
          receiver_email: form.receiver_email.trim() || null,
          receiver_phone: form.receiver_phone.trim() || null,
          receiver_address: form.receiver_address.trim() || null,
          weight: form.weight ? parseFloat(form.weight) : null,
          transport_type: form.transport_type,
          status: form.status,
          origin_city: form.origin_city,
          origin_country: form.origin_country,
          destination_city: form.destination_city,
          destination_country: form.destination_country,
        })
        .eq('id', shipment.id);

      if (error) throw error;

      showToast('Shipment updated successfully!', 'success');
      onSuccess();
      onClose();
    } catch (error: any) {
      showToast(error.message || 'Failed to update shipment', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !shipment) return null;

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
          <h2 className="text-xl font-bold text-[#0A1F44]">Edit Shipment</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Read-only fields */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tracking ID</span>
              <span className="text-sm font-mono font-bold text-[#0A1F44] bg-white px-3 py-1 rounded-lg">{shipment.tracking_id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Current Location</span>
              <span className="text-sm text-gray-700">{shipment.current_city}, {shipment.current_country}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Created</span>
              <span className="text-sm text-gray-700">{new Date(shipment.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Sender Group */}
          <div>
            <p className="text-sm font-bold text-[#0A1F44] mb-2 uppercase tracking-wider">Sender</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sender Name</label>
                <input name="sender_name" value={form.sender_name} onChange={handleChange} required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none text-sm transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sender Email <span className="text-gray-400 font-normal">(optional)</span></label>
                <input name="sender_email" type="email" value={form.sender_email} onChange={handleChange}
                  onBlur={() => handleEmailBlur('sender_email')}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none text-sm transition-colors ${emailErrors.sender_email ? 'border-red-400' : 'border-gray-300'}`} />
                {emailErrors.sender_email && <p className="text-red-500 text-xs mt-1">{emailErrors.sender_email}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sender Phone <span className="text-gray-400 font-normal">(optional)</span></label>
                <input name="sender_phone" type="tel" value={form.sender_phone} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none text-sm transition-colors" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sender Address <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea name="sender_address" value={form.sender_address} onChange={handleChange} rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none text-sm transition-colors resize-none" />
              </div>
            </div>
          </div>

          {/* Receiver Group */}
          <div>
            <p className="text-sm font-bold text-[#0A1F44] mb-2 uppercase tracking-wider">Receiver</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Receiver Name</label>
                <input name="receiver_name" value={form.receiver_name} onChange={handleChange} required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none text-sm transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Receiver Email <span className="text-gray-400 font-normal">(optional)</span></label>
                <input name="receiver_email" type="email" value={form.receiver_email} onChange={handleChange}
                  onBlur={() => handleEmailBlur('receiver_email')}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none text-sm transition-colors ${emailErrors.receiver_email ? 'border-red-400' : 'border-gray-300'}`} />
                {emailErrors.receiver_email && <p className="text-red-500 text-xs mt-1">{emailErrors.receiver_email}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Receiver Phone <span className="text-gray-400 font-normal">(optional)</span></label>
                <input name="receiver_phone" type="tel" value={form.receiver_phone} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none text-sm transition-colors" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Receiver Address <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea name="receiver_address" value={form.receiver_address} onChange={handleChange} rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none text-sm transition-colors resize-none" />
              </div>
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

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0A1F44] hover:bg-blue-900 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed text-sm tracking-wide"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
