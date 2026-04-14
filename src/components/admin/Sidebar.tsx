import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, PlusCircle, LogOut, X, Globe, Plane, Settings, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/shipments', label: 'Shipments', icon: Package },
  { to: '/admin/shipments', label: 'Add Shipment', icon: PlusCircle, isAddAction: true },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#0A1F44] text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header / Logo */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center gap-3" onClick={onClose}>
            <div className="relative flex items-center justify-center h-10 w-10 text-white">
              <Globe className="h-8 w-8" strokeWidth={1.5} />
              <Plane className="h-4 w-4 absolute -top-1 -right-1 transform rotate-45 fill-current" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-wider block">Swift Global Logistics</span>
              <span className="text-[10px] text-gray-400 tracking-widest uppercase">Admin Panel</span>
            </div>
          </Link>
          <button onClick={onClose} className="lg:hidden p-1 hover:bg-white/10 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            if (item.isAddAction) {
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  state={{ openAddModal: true }}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200"
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {item.label}
                </Link>
              );
            }
            return (
              <Link
                key={item.label}
                to={item.to}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(item.to)
                    ? 'bg-[#FF6B35] text-white shadow-lg shadow-[#FF6B35]/20'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-white/10 flex flex-col gap-1">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200 w-full"
          >
            <ExternalLink className="h-5 w-5 flex-shrink-0" />
            View Public Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 w-full text-left"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

