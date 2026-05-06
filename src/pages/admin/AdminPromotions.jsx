import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Edit2, Check, X, Truck, Gift, Trophy, ChevronDown, Loader2, ToggleLeft, ToggleRight, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getPromoConfig, savePromoConfig, getEarnedPromos,
  getTierBadgeColor, getHighestEarnedTier, deriveCustomersFromOrders, PROMO_CONFIG_EVENT,
} from '../../utils/promotions';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const generateId = () => `tier_${Date.now()}`;

const MilestoneView = ({ tiers, selectedMonth, selectedYear }) => {
  const customers = deriveCustomersFromOrders();
  const config = getPromoConfig();

  // Filter orders by selected month/year
  const filtered = customers.map(c => {
    const monthOrders = (c.orders || []).filter(o => {
      const d = new Date(o.createdAt);
      return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
    });
    const delivered = monthOrders.filter(o => ['Delivered', 'delivered'].includes(o.status)).length;
    return { ...c, monthOrders: monthOrders.length, monthDelivered: delivered };
  }).filter(c => c.monthOrders > 0);

  if (filtered.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
        <p className="font-medium">No order activity for this month</p>
        <p className="text-sm mt-1">Orders will appear here once customers place orders this month.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="border-b border-slate-200 bg-slate-50">
          <tr>
            <th className="text-left py-3 px-4 font-semibold text-slate-700">Customer</th>
            <th className="text-center py-3 px-4 font-semibold text-slate-700">Orders (month)</th>
            <th className="text-center py-3 px-4 font-semibold text-slate-700">Delivered</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-700">Tier Earned</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-700">Promo Code</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(c => {
            const tier = getHighestEarnedTier(c.deliveredOrders, config);
            return (
              <tr key={c._id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50">
                <td className="py-3 px-4">
                  <p className="font-semibold text-slate-900">{c.firstName} {c.lastName}</p>
                  <p className="text-xs text-slate-500">{c.email}</p>
                </td>
                <td className="py-3 px-4 text-center font-medium text-slate-900">{c.monthOrders}</td>
                <td className="py-3 px-4 text-center font-medium text-emerald-700">{c.monthDelivered}</td>
                <td className="py-3 px-4">
                  {tier ? (
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getTierBadgeColor(tier.id)}`}>
                      {tier.label}
                    </span>
                  ) : <span className="text-slate-400 text-xs">None yet</span>}
                </td>
                <td className="py-3 px-4">
                  {tier ? (
                    <code className="bg-slate-100 text-slate-800 px-2 py-1 rounded font-mono text-xs font-bold">{tier.promoCode}</code>
                  ) : <span className="text-slate-400 text-xs">—</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const AdminPromotions = () => {
  const [config, setConfig] = useState(getPromoConfig());
  const [editingTierId, setEditingTierId] = useState(null);
  const [editTierForm, setEditTierForm] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  useEffect(() => {
    const handler = () => setConfig(getPromoConfig());
    window.addEventListener(PROMO_CONFIG_EVENT, handler);
    return () => window.removeEventListener(PROMO_CONFIG_EVENT, handler);
  }, []);

  const persist = (updated) => {
    setConfig(updated);
    savePromoConfig(updated);
    toast.success('Promotions saved');
  };

  const toggleFreeDelivery = () => {
    persist({ ...config, freeDeliveryEnabled: !config.freeDeliveryEnabled });
  };

  const startEditTier = (tier) => {
    setEditingTierId(tier.id);
    setEditTierForm({ ...tier });
  };

  const saveEditTier = () => {
    const updated = {
      ...config,
      promoTiers: config.promoTiers.map(t => t.id === editingTierId ? { ...editTierForm } : t),
    };
    persist(updated);
    setEditingTierId(null);
  };

  const deleteTier = (id) => {
    persist({ ...config, promoTiers: config.promoTiers.filter(t => t.id !== id) });
  };

  const addTier = () => {
    const newTier = {
      id: generateId(), minOrders: 5, label: 'New Reward',
      promoCode: 'NEWCODE', discountType: 'percent', discountValue: 5, description: '5% off your order',
    };
    const updated = { ...config, promoTiers: [...config.promoTiers, newTier] };
    persist(updated);
    startEditTier(newTier);
  };

  const years = [];
  for (let y = 2025; y <= now.getFullYear(); y++) years.push(y);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Promotions</h1>
        <p className="text-slate-500 mt-1">Manage loyalty rewards and free delivery settings.</p>
      </div>

      {/* Free Delivery Toggle */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.freeDeliveryEnabled ? 'bg-emerald-500' : 'bg-slate-200'}`}>
              <Truck className={`w-6 h-6 ${config.freeDeliveryEnabled ? 'text-white' : 'text-slate-400'}`} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Global Free Delivery</h2>
              <p className="text-sm text-slate-500">
                {config.freeDeliveryEnabled
                  ? '🟢 Active — All customers get free delivery right now'
                  : 'Off — Customers pay standard delivery fees'}
              </p>
            </div>
          </div>
          <button onClick={toggleFreeDelivery}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              config.freeDeliveryEnabled
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}>
            {config.freeDeliveryEnabled ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
            {config.freeDeliveryEnabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </div>

      {/* Promo Tiers */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Gift className="w-5 h-5 text-slate-700" />
            <h2 className="text-lg font-semibold text-slate-900">Loyalty Tiers</h2>
          </div>
          <button onClick={addTier}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-700 transition-colors">
            <Plus className="w-4 h-4" /> Add Tier
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Label</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Min Orders</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Promo Code</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Discount</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-700">Description</th>
                <th className="py-4 px-6" />
              </tr>
            </thead>
            <tbody>
              {config.promoTiers.map(tier => (
                <tr key={tier.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50">
                  {editingTierId === tier.id ? (
                    <>
                      <td className="py-3 px-6"><input value={editTierForm.label} onChange={e => setEditTierForm(p => ({ ...p, label: e.target.value }))} className="border border-slate-300 rounded-lg px-2 py-1 text-sm w-36" /></td>
                      <td className="py-3 px-6"><input type="number" min="1" value={editTierForm.minOrders} onChange={e => setEditTierForm(p => ({ ...p, minOrders: Number(e.target.value) }))} className="border border-slate-300 rounded-lg px-2 py-1 text-sm w-20" /></td>
                      <td className="py-3 px-6"><input value={editTierForm.promoCode} onChange={e => setEditTierForm(p => ({ ...p, promoCode: e.target.value.toUpperCase() }))} className="border border-slate-300 rounded-lg px-2 py-1 text-sm w-28 font-mono" /></td>
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-2">
                          <select value={editTierForm.discountType} onChange={e => setEditTierForm(p => ({ ...p, discountType: e.target.value }))} className="border border-slate-300 rounded-lg px-2 py-1 text-sm">
                            <option value="percent">%</option>
                            <option value="freeDelivery">Free Delivery</option>
                          </select>
                          {editTierForm.discountType === 'percent' && (
                            <input type="number" min="1" max="100" value={editTierForm.discountValue} onChange={e => setEditTierForm(p => ({ ...p, discountValue: Number(e.target.value) }))} className="border border-slate-300 rounded-lg px-2 py-1 text-sm w-16" />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-6"><input value={editTierForm.description} onChange={e => setEditTierForm(p => ({ ...p, description: e.target.value }))} className="border border-slate-300 rounded-lg px-2 py-1 text-sm w-40" /></td>
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-1">
                          <button onClick={saveEditTier} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg"><Check className="w-4 h-4" /></button>
                          <button onClick={() => setEditingTierId(null)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg"><X className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-4 px-6 font-semibold text-slate-900">{tier.label}</td>
                      <td className="py-4 px-6"><span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-lg text-xs font-semibold">{tier.minOrders}+ orders</span></td>
                      <td className="py-4 px-6"><code className="bg-slate-900 text-white px-2.5 py-1 rounded font-mono text-xs font-bold">{tier.promoCode}</code></td>
                      <td className="py-4 px-6 font-medium text-slate-900">
                        {tier.discountType === 'freeDelivery' ? <span className="text-emerald-600">Free Delivery</span> : `${tier.discountValue}% off`}
                      </td>
                      <td className="py-4 px-6 text-slate-500">{tier.description}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => startEditTier(tier)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => deleteTier(tier.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Milestone View */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-5 border-b border-slate-200 gap-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-slate-900">Customer Milestone View</h2>
          </div>
          <div className="flex items-center gap-2">
            <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))}
              className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-slate-500">
              {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
            </select>
            <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}
              className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-slate-500">
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
        <div className="p-6">
          <MilestoneView tiers={config.promoTiers} selectedMonth={selectedMonth} selectedYear={selectedYear} />
        </div>
      </div>
    </div>
  );
};

export default AdminPromotions;
