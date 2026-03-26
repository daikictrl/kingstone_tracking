import { useEffect, useState } from 'react';
import { Package, Truck, CheckCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Stats {
  total: number;
  inTransit: number;
  delivered: number;
  delayed: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ total: 0, inTransit: 0, delivered: 0, delayed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const { count: total } = await supabase
        .from('shipments')
        .select('*', { count: 'exact', head: true });

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
