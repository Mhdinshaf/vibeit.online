import { useState, useEffect, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight, Eye, Edit2, X, Check, Loader2, AlertCircle, Phone, ShoppingBag, Trophy } from 'lucide-react';
import toast from 'react-hot-toast';
import { getPromoConfig, getHighestEarnedTier, getTierBadgeColor, deriveCustomersFromOrders, PROMO_CONFIG_EVENT } from '../../utils/promotions';

const CUSTOMERS_PER_PAGE = 10;
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TierBadge = ({ deliveredOrders, config }) => {
  const tier = getHighestEarnedTier(deliveredOrders, config);
  if (!tier) return <span className="text-xs text-slate-400">—</span>;
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getTierBadgeColor(tier.id)}`}>
      {tier.promoCode} • {tier.description}
    </span>
  );
};

const CustomerOrdersPanel = ({ customer }) => {
  const orders = customer.orders || [];
  if (orders.length === 0) return <p className="text-sm text-slate-500">No orders found.</p>;
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-slate-700 mb-3">Recent Orders ({orders.length})</p>
      {orders.slice(0, 5).map(o => (
        <div key={o._id} className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm">
          <div>
            <p className="font-semibold text-slate-900">{o.orderNumber || o._id}</p>
            <p className="text-slate-500 text-xs">{new Date(o.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            <p className="font-medium text-slate-900">රු{o.total?.toLocaleString()}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              o.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
              o.status === 'Pending' ? 'bg-slate-100 text-slate-700' :
              'bg-blue-100 text-blue-700'
            }`}>{o.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', phone: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [promoConfig, setPromoConfig] = useState(getPromoConfig());

  useEffect(() => {
    const handler = () => setPromoConfig(getPromoConfig());
    window.addEventListener(PROMO_CONFIG_EVENT, handler);
    return () => window.removeEventListener(PROMO_CONFIG_EVENT, handler);
  }, []);

  const loadCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/customers`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('vibeit_token')}` },
      });
      if (!res.ok) throw new Error('not ok');
      const data = await res.json();
      const list = data.customers || data.data || data;
      setCustomers(Array.isArray(list) ? list : []);
      setIsApiConnected(true);
    } catch {
      setCustomers(deriveCustomersFromOrders());
      setIsApiConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadCustomers(); }, [loadCustomers]);
  useEffect(() => { setCurrentPage(1); }, [search]);

  const filtered = customers.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) || (c.phone || '').includes(q);
  });

  const totalPages = Math.ceil(filtered.length / CUSTOMERS_PER_PAGE);
  const paged = filtered.slice((currentPage - 1) * CUSTOMERS_PER_PAGE, currentPage * CUSTOMERS_PER_PAGE);

  const startEdit = (c) => {
    setEditingId(c._id);
    setEditForm({ firstName: c.firstName, lastName: c.lastName, phone: c.phone || '' });
  };

  const saveEdit = async (id) => {
    setIsSaving(true);
    try {
      if (isApiConnected) {
        const res = await fetch(`${API_BASE}/admin/customers/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('vibeit_token')}` },
          body: JSON.stringify(editForm),
        });
        if (!res.ok) throw new Error('Failed');
      }
      setCustomers(prev => prev.map(c => c._id === id ? { ...c, ...editForm } : c));
      toast.success('Customer updated');
      setEditingId(null);
    } catch {
      toast.error('Failed to update customer');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Customers</h1>
          <p className="text-slate-500 mt-1">{customers.length} total customers</p>
        </div>
        {!isApiConnected && (
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            Demo mode — derived from local orders
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email or phone..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-500 bg-slate-50 text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : paged.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p>No customers found.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">Customer</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">Phone</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700 text-center">Orders</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700 text-center">Delivered</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">Earned Tier</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">Joined</th>
                    <th className="py-4 px-6" />
                  </tr>
                </thead>
                <tbody>
                  {paged.map(c => (
                    <>
                      <tr key={c._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-6">
                          {editingId === c._id ? (
                            <div className="flex gap-2">
                              <input value={editForm.firstName} onChange={e => setEditForm(p => ({ ...p, firstName: e.target.value }))}
                                className="border border-slate-300 rounded-lg px-2 py-1 text-sm w-24" placeholder="First" />
                              <input value={editForm.lastName} onChange={e => setEditForm(p => ({ ...p, lastName: e.target.value }))}
                                className="border border-slate-300 rounded-lg px-2 py-1 text-sm w-24" placeholder="Last" />
                            </div>
                          ) : (
                            <div>
                              <p className="font-semibold text-slate-900">{c.firstName} {c.lastName}</p>
                              <p className="text-slate-500 text-xs">{c.email}</p>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          {editingId === c._id ? (
                            <input value={editForm.phone} onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))}
                              className="border border-slate-300 rounded-lg px-2 py-1 text-sm w-32" />
                          ) : (
                            <span className="text-slate-600">{c.phone || '—'}</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-center font-medium text-slate-900">{c.totalOrders}</td>
                        <td className="py-4 px-6 text-center font-medium text-emerald-700">{c.deliveredOrders}</td>
                        <td className="py-4 px-6"><TierBadge deliveredOrders={c.deliveredOrders} config={promoConfig} /></td>
                        <td className="py-4 px-6 text-slate-500 text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-1">
                            {editingId === c._id ? (
                              <>
                                <button onClick={() => saveEdit(c._id)} disabled={isSaving}
                                  className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg">
                                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                </button>
                                <button onClick={() => setEditingId(null)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg">
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button onClick={() => setExpandedId(expandedId === c._id ? null : c._id)}
                                  className={`p-1.5 rounded-lg transition-colors ${expandedId === c._id ? 'bg-blue-100 text-blue-700' : 'text-slate-400 hover:bg-slate-100'}`} title="View orders">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button onClick={() => startEdit(c)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg" title="Edit">
                                  <Edit2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                      {expandedId === c._id && (
                        <tr key={`${c._id}-exp`} className="bg-slate-50 border-b border-slate-200">
                          <td colSpan={7} className="px-8 py-4">
                            <CustomerOrdersPanel customer={c} />
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-slate-200 gap-4">
                <p className="text-sm text-slate-600">
                  Showing <span className="font-medium">{(currentPage - 1) * CUSTOMERS_PER_PAGE + 1}</span>–
                  <span className="font-medium">{Math.min(currentPage * CUSTOMERS_PER_PAGE, filtered.length)}</span> of{' '}
                  <span className="font-medium">{filtered.length}</span>
                </p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {[...Array(totalPages)].map((_, i) => {
                    const pg = i + 1;
                    if (totalPages <= 5 || pg === 1 || pg === totalPages || Math.abs(pg - currentPage) <= 1) {
                      return (
                        <button key={pg} onClick={() => setCurrentPage(pg)}
                          className={`w-9 h-9 rounded-lg text-sm font-medium ${pg === currentPage ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`}>
                          {pg}
                        </button>
                      );
                    }
                    if (Math.abs(pg - currentPage) === 2) return <span key={pg} className="text-slate-400">…</span>;
                    return null;
                  })}
                  <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminCustomers;
