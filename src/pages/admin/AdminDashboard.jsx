import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TrendingUp, ShoppingBag, Package, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { getDashboardStats, ORDER_SYNC_EVENT } from '../../services/api';

const statStyles = {
  revenue: { iconBg: 'bg-slate-900', icon: TrendingUp },
  orders: { iconBg: 'bg-slate-700', icon: ShoppingBag },
  products: { iconBg: 'bg-slate-600', icon: Package },
  pending: { iconBg: 'bg-amber-500', icon: AlertTriangle },
};

const AdminDashboard = () => {
  const queryClient = useQueryClient();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
    refetchInterval: 60000,
  });

  useEffect(() => {
    const refreshDashboard = () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    };

    window.addEventListener(ORDER_SYNC_EVENT, refreshDashboard);
    window.addEventListener('storage', refreshDashboard);

    return () => {
      window.removeEventListener(ORDER_SYNC_EVENT, refreshDashboard);
      window.removeEventListener('storage', refreshDashboard);
    };
  }, [queryClient]);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const COLORS = ['#0f172a', '#334155', '#64748b', '#94a3b8'];

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="h-8 bg-slate-200 rounded-lg w-48 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 h-36 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-slate-200 rounded-2xl h-96 animate-pulse" />
          <div className="bg-slate-200 rounded-2xl h-96 animate-pulse" />
        </div>
      </div>
    );
  }

  const statCards = [
    {
      key: 'revenue',
      title: 'Monthly Revenue',
      value: `රු${stats?.monthlyRevenue?.toLocaleString() || '0'}`,
      change: stats?.revenueGrowth || 0,
    },
    {
      key: 'orders',
      title: 'Monthly Orders',
      value: stats?.monthlyOrders || 0,
      subtitle: `${stats?.pendingOrders || 0} pending`,
    },
    {
      key: 'products',
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      subtitle: `${stats?.lowStockCount || 0} low stock`,
    },
    {
      key: 'pending',
      title: 'Pending Orders',
      value: stats?.pendingOrders || 0,
      subtitle: 'Needs attention',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">{currentDate}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const style = statStyles[card.key];
          const Icon = style.icon;

          return (
            <article
              key={card.key}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${style.iconBg}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                {card.change !== undefined && (
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    card.change >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {card.change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {Math.abs(card.change)}%
                  </div>
                )}
              </div>
              <p className="text-sm text-slate-500 mb-1">{card.title}</p>
              <p className="text-2xl font-semibold text-slate-900">{card.value}</p>
              {card.subtitle && <p className="text-xs text-slate-500 mt-1">{card.subtitle}</p>}
            </article>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Revenue (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats?.revenueByDay || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                stroke="#94a3b8"
                fontSize={12}
                tickFormatter={(date) => {
                  const d = new Date(date);
                  return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                }}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickFormatter={(value) => `රු${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)',
                }}
                formatter={(value) => [`රු${value.toLocaleString()}`, 'Revenue']}
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <Bar dataKey="revenue" fill="#0f172a" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Orders by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats?.ordersByCategory || []}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {(stats?.ordersByCategory || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </section>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Top Selling Products</h2>
          {stats?.topSellingProducts && stats.topSellingProducts.length > 0 ? (
            <div className="space-y-3">
              {stats.topSellingProducts.map((product, index) => (
                <div
                  key={product._id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200"
                >
                  <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-white">#{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-900 truncate">{product.name}</h3>
                    <p className="text-sm text-slate-500">{product.unitsSold} units sold</p>
                  </div>
                  <p className="font-semibold text-slate-900">රු{product.revenue?.toLocaleString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500">No sales data available</p>
            </div>
          )}
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Low Stock Alert</h2>
          {stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
            <div className="space-y-3">
              {stats.lowStockProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200"
                >
                  <h3 className="font-medium text-slate-900 truncate">{product.name}</h3>
                  {product.stockQuantity === 0 ? (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                      OUT OF STOCK
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                      {product.stockQuantity} left
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-emerald-600" />
              </div>
              <p className="text-emerald-700 font-medium">All products well stocked</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
