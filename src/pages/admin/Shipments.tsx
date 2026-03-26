import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Filter, Edit, MapPin, Trash2, Plus, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/admin/Toast';
import AddShipmentModal from '../../components/admin/AddShipmentModal';
import EditShipmentModal from '../../components/admin/EditShipmentModal';
import UpdateLocationModal from '../../components/admin/UpdateLocationModal';

interface Shipment {
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
}

const PAGE_SIZE = 10;

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    Pending: 'bg-gray-100 text-gray-700 border-gray-200',
    'In Transit': 'bg-orange-50 text-orange-700 border-orange-200',
    Delivered: 'bg-green-50 text-green-700 border-green-200',
    Delayed: 'bg-red-50 text-red-700 border-red-200',
  };
  return styles[status] || styles.Pending;
};

export default function Shipments() {
  const location = useLocation();
  const { showToast } = useToast();

  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editShipment, setEditShipment] = useState<Shipment | null>(null);
  const [updateLocationShipment, setUpdateLocationShipment] = useState<Shipment | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Shipment | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Check if navigated from sidebar "Add Shipment"
  useEffect(() => {
    if (location.state?.openAddModal) {
      setShowAddModal(true);
      // Clear the state so it doesn't re-trigger
      window.history.replaceState({}, '');
    }
  }, [location.state]);

  const fetchShipments = useCallback(async () => {
    setLoading(true);
    try {
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from('shipments')
        .select('*', { count: 'exact' });

      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }

      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      setShipments(data || []);
      setTotalCount(count ?? 0);
    } catch (error: any) {
      showToast(error.message || 'Failed to load shipments', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, showToast]);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  // Client-side search filter
  const filteredShipments = shipments.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.tracking_id.toLowerCase().includes(q) ||
      (s.sender_name || '').toLowerCase().includes(q) ||
      (s.receiver_name || '').toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from('shipments').delete().eq('id', deleteConfirm.id);
      if (error) throw error;
      showToast('Shipment deleted successfully', 'success');
      setDeleteConfirm(null);
      fetchShipments();
    } catch (error: any) {
      showToast(error.message || 'Failed to delete shipment', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by tracking ID, sender or receiver..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none text-sm transition-colors"
          />
        </div>

        {/* Status filter */}
        <div className="relative">
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(0);
            }}
            className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none text-sm transition-colors bg-white appearance-none min-w-[160px]"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
            <option value="Delayed">Delayed</option>
          </select>
        </div>

        {/* Add button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6B35] hover:bg-orange-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-[#FF6B35]/20 text-sm tracking-wide flex-shrink-0"
        >
          <Plus className="h-5 w-5" />
          Add Shipment
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-4 font-bold text-[#0A1F44] text-xs uppercase tracking-wider">Tracking ID</th>
                <th className="text-left px-5 py-4 font-bold text-[#0A1F44] text-xs uppercase tracking-wider">Sender</th>
                <th className="text-left px-5 py-4 font-bold text-[#0A1F44] text-xs uppercase tracking-wider hidden md:table-cell">Receiver</th>
                <th className="text-left px-5 py-4 font-bold text-[#0A1F44] text-xs uppercase tracking-wider hidden lg:table-cell">Transport</th>
                <th className="text-left px-5 py-4 font-bold text-[#0A1F44] text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-4 font-bold text-[#0A1F44] text-xs uppercase tracking-wider hidden lg:table-cell">Location</th>
                <th className="text-left px-5 py-4 font-bold text-[#0A1F44] text-xs uppercase tracking-wider hidden xl:table-cell">Created</th>
                <th className="text-right px-5 py-4 font-bold text-[#0A1F44] text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <>
                  {[...Array(5)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(8)].map((_, j) => (
                        <td key={j} className="px-5 py-4">
                          <div className="h-4 bg-gray-100 rounded animate-pulse w-20"></div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              ) : filteredShipments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">No shipments found</p>
                      <p className="text-gray-400 text-xs">Try adjusting your search or filter</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredShipments.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-mono font-bold text-[#0A1F44] bg-gray-50 px-2.5 py-1 rounded-lg text-xs">{s.tracking_id}</span>
                    </td>
                    <td className="px-5 py-4 text-gray-700 font-medium">{s.sender_name}</td>
                    <td className="px-5 py-4 text-gray-700 hidden md:table-cell">{s.receiver_name}</td>
                    <td className="px-5 py-4 text-gray-600 hidden lg:table-cell">{s.transport_type}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${statusBadge(s.status)}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-600 hidden lg:table-cell">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-[#FF6B35]" />
                        {s.current_city}, {s.current_country}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500 hidden xl:table-cell text-xs">
                      {new Date(s.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditShipment(s)}
                          title="Edit Shipment"
                          className="p-2 text-gray-500 hover:text-[#0A1F44] hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setUpdateLocationShipment(s)}
                          title="Update Location"
                          className="p-2 text-gray-500 hover:text-[#FF6B35] hover:bg-orange-50 rounded-lg transition-colors"
                        >
                          <MapPin className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(s)}
                          title="Delete Shipment"
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 bg-gray-50/50">
            <p className="text-sm text-gray-500">
              Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, totalCount)} of {totalCount}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium text-gray-700 px-2">
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddShipmentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchShipments}
      />

      <EditShipmentModal
        isOpen={!!editShipment}
        shipment={editShipment}
        onClose={() => setEditShipment(null)}
        onSuccess={fetchShipments}
      />

      <UpdateLocationModal
        isOpen={!!updateLocationShipment}
        shipment={updateLocationShipment}
        onClose={() => setUpdateLocationShipment(null)}
        onSuccess={fetchShipments}
      />

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
                <Trash2 className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-[#0A1F44] mb-2">Delete Shipment</h3>
              <p className="text-sm text-gray-500 mb-1">
                Are you sure you want to delete this shipment?
              </p>
              <p className="text-sm text-gray-500 mb-6">
                This cannot be undone.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-sm transition-colors disabled:opacity-70"
                >
                  {deleting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Deleting...
                    </span>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
