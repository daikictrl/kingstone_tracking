import { useEffect, useState } from 'react';
import { Package, Truck, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Stats {
  total: number;
  pending: number;
  inTransit: number;
  delivered: number;
  delayed: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, inTransit: 0, delivered: 0, delayed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    
    // Realtime global subscription for dashboard stats
    const channel = supabase.channel('admin-dashboard-stats')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'shipments' }, (payload) => {
         setStats(prev => {
           const newStats = { ...prev, total: prev.total + 1 };
           if (payload.new.status === 'Pending') newStats.pending += 1;
           if (payload.new.status === 'In Transit') newStats.inTransit += 1;
           if (payload.new.status === 'Delivered') newStats.delivered += 1;
           if (payload.new.status === 'Delayed') newStats.delayed += 1;
           return newStats;
         });
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'shipments' }, (payload) => {
         // When updating, we might not get the full "old" object unless Replica Identity Full is enabled.
         // Given this constraint in most standard Supabase setups, relying on a lightweight background sync
         // of the COUNT(*) aggregates guarantees data accuracy across all concurrent users modifying stats.
         fetchStats();
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'shipments' }, (payload) => {
         fetchStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const { count: total } = await supabase
        .from('shipments')
        .select('*', { count: 'exact', head: true });

      const { count: pending } = await supabase
        .from('shipments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Pending');

      const { count: inTransit } = await supabase
        .from('shipments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'In Transit');

      const { count: delivered } = await supabase
        .from('shipments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Delivered');

      const { count: delayed } = await supabase
        .from('shipments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Delayed');

      setStats({
        total: total ?? 0,
        pending: pending ?? 0,
        inTransit: inTransit ?? 0,
        delivered: delivered ?? 0,
        delayed: delayed ?? 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: 'Total Shipments',
      value: stats.total,
      icon: Package,
      bgColor: 'bg-[#0A1F44]',
      iconBg: 'bg-white/10',
      textColor: 'text-white',
      valueColor: 'text-white',
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: Clock,
      bgColor: 'bg-gradient-to-br from-gray-500 to-gray-600',
      iconBg: 'bg-white/20',
      textColor: 'text-white',
      valueColor: 'text-white',
    },
    {
      title: 'In Transit',
      value: stats.inTransit,
      icon: Truck,
      bgColor: 'bg-gradient-to-br from-orange-500 to-[#FF6B35]',
      iconBg: 'bg-white/20',
      textColor: 'text-white',
      valueColor: 'text-white',
    },
    {
      title: 'Delivered',
      value: stats.delivered,
      icon: CheckCircle,
      bgColor: 'bg-gradient-to-br from-emerald-500 to-green-600',
      iconBg: 'bg-white/20',
      textColor: 'text-white',
      valueColor: 'text-white',
    },
    {
      title: 'Delayed',
      value: stats.delayed,
      icon: AlertTriangle,
      bgColor: 'bg-gradient-to-br from-red-500 to-red-600',
      iconBg: 'bg-white/20',
      textColor: 'text-white',
      valueColor: 'text-white',
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`${card.bgColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden`}
          >
            {/* Decorative circle */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/5"></div>
            
            <div className="relative z-10">
              <div className={`${card.iconBg} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                <card.icon className={`h-6 w-6 ${card.textColor}`} />
              </div>
              <p className={`text-sm font-medium ${card.textColor} opacity-80 mb-1`}>{card.title}</p>
              {loading ? (
                <div className="w-12 h-8 bg-white/20 rounded animate-pulse"></div>
              ) : (
                <p className={`text-3xl font-bold ${card.valueColor}`}>{card.value}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
