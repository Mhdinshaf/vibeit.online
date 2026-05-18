import { useState, useEffect, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight, Eye, Edit2, X, Check, Loader2, AlertCircle, ShoppingBag, Package, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import { getPromoConfig, getHighestEarnedTier, getTierBadgeColor, deriveCustomersFromOrders, PROMO_CONFIG_EVENT } from '../../utils/promotions';

const CUSTOMERS_PER_PAGE = 15;
const ORDERS_PER_PAGE = 5;
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── Tier Badge ───────────────────────────────────────────────────────────────
const TierBadge = ({ deliveredOrders, config }) => {
  const tier = getHighestEarnedTier(deliveredOrders, config);
  if (!tier) return <span className="text-xs text-slate-400">—</span>;
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getTierBadgeColor(tier.id)}`}>
      {tier.promoCode} • {tier.description}
    </span>
  );
};

// ─── Status badge colour map ──────────────────────────────────────────────────
const statusClass = (s) => {
  const map = {
    Delivered:  'bg-emerald-100 text-emerald-700',
    Pending:    'bg-slate-100 text-slate-600',
    Confirmed:  'bg-blue-100 text-blue-700',
    Processing: 'bg-indigo-100 text-indigo-700',
    Shipped:    'bg-cyan-100 text-cyan-700',
    Cancelled:  'bg-red-100 text-red-700',
  };
  return map[s] || 'bg-slate-100 text-slate-600';
};

// ─── Orders Panel — fetches from API when the eye button opens it ─────────────
const CustomerOrdersPanel = ({ customerId, isApiConnected }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (isApiConnected) {
          const res = await fetch(`${API_BASE}/admin/customers/${encodeURIComponent(customerId)}/orders`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('vibeit_token')}` },
          });
          if (!res.ok) throw new Error(`Server returned ${res.status}`);
          const data = await res.json();
          if (!cancelled) setOrders(data.orders || []);
        } else {
          // Demo mode — derive from localStorage
          const all = JSON.parse(localStorage.getItem('vibeit_orders_db') || '[]');
          if (!cancelled) setOrders(all.filter(o => o.customerId === customerId));
        }
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchOrders();
    return () => { cancelled = true; };
  }, [customerId, isApiConnected]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-4 text-slate-400 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading orders…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 py-3 text-red-500 text-sm">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        Failed to load orders: {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex items-center gap-2 py-3 text-slate-400 text-sm">
        <Package className="w-4 h-4" />
        No orders found for this customer.
      </div>
    );
  }

  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
  const paged = orders.slice((page - 1) * ORDERS_PER_PAGE, page * ORDERS_PER_PAGE);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-slate-700">
          All Orders <span className="text-slate-400 font-normal">({orders.length})</span>
        </p>
        {totalPages > 1 && (
          <p className="text-xs text-slate-400">Page {page} of {totalPages}</p>
        )}
      </div>

      {paged.map(o => (
        <div key={o._id || o.orderNumber}
          className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm hover:border-slate-300 transition-colors">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-slate-900">{o.orderNumber || o._id}</p>
              {o.promoCode && (
                <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                  <Tag className="w-3 h-3" />{o.promoCode}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400 flex-wrap">
              <span>{new Date(o.createdAt).toLocaleDateString()}</span>
              {o.paymentMethod && <span>• {o.paymentMethod}</span>}
              {o.discount > 0 && (
                <span className="text-emerald-600">• Rs {o.discount.toLocaleString()} off</span>
              )}
            </div>
          </div>
          <div className="text-right flex-shrink-0 ml-4">
            <p className="font-semibold text-slate-900">
              Rs {(o.total || o.totalAmount || 0).toLocaleString()}
            </p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${statusClass(o.status || o.orderStatus)}`}>
              {o.status || o.orderStatus}
            </span>
          </div>
        </div>
      ))}

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-slate-500">
            Showing {(page - 1) * ORDERS_PER_PAGE + 1}–{Math.min(page * ORDERS_PER_PAGE, orders.length)} of {orders.length}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-40 transition-colors">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i + 1} onClick={() => setPage(i + 1)}
                className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                  page === i + 1 ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-40 transition-colors">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main AdminCustomers Page ─────────────────────────────────────────────────
const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);   // total from API
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');         // raw typed value
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', phone: '', isReseller: false });
  const [isSaving, setIsSaving] = useState(false);
  const [promoConfig, setPromoConfig] = useState(getPromoConfig());

  useEffect(() => {
    const handler = () => setPromoConfig(getPromoConfig());
    window.addEventListener(PROMO_CONFIG_EVENT, handler);
    return () => window.removeEventListener(PROMO_CONFIG_EVENT, handler);
  }, []);

  // Debounce search input → triggers API call after 400 ms
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const loadCustomers = useCallback(async (page = 1, q = '') => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: CUSTOMERS_PER_PAGE });
      if (q) params.set('search', q);
      const res = await fetch(`${API_BASE}/admin/customers?${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('vibeit_token')}` },
      });
      if (!res.ok) throw new Error('not ok');
      const data = await res.json();
      const list = data.customers || data.data || [];
      setCustomers(Array.isArray(list) ? list : []);
      setTotalCustomers(data.total ?? list.length);
      setTotalPages(data.pages ?? Math.ceil((data.total ?? list.length) / CUSTOMERS_PER_PAGE));
      setIsApiConnected(true);
    } catch {
      // Demo fallback — derive from localStorage, client-side filter + paginate
      const all = deriveCustomersFromOrders();
      const filtered = q
        ? all.filter(c => `${c.firstName} ${c.lastName} ${c.email}`.toLowerCase().includes(q.toLowerCase()))
        : all;
      const start = (page - 1) * CUSTOMERS_PER_PAGE;
      setCustomers(filtered.slice(start, start + CUSTOMERS_PER_PAGE));
      setTotalCustomers(filtered.length);
      setTotalPages(Math.ceil(filtered.length / CUSTOMERS_PER_PAGE));
      setIsApiConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Re-fetch whenever page or debounced search changes
  useEffect(() => { loadCustomers(currentPage, search); }, [loadCustomers, currentPage, search]);


  // NOTE: customers[] is already the current page from the server
  const paged = customers;

  const startEdit = (c) => {
    setEditingId(c._id);
    setEditForm({
      firstName: c.firstName,
      lastName: c.lastName,
      phone: c.phone || '',
      isReseller: Boolean(c.isReseller || c.reseller),
    });
  };

  const saveEdit = async (id) => {
    setIsSaving(true);
    try {
      if (isApiConnected) {
        const res = await fetch(`${API_BASE}/admin/customers/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('vibeit_token')}`,
          },
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

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Customers</h1>
          <p className="text-slate-500 mt-1">{totalCustomers} total customers</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => loadCustomers(currentPage, search)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors"
            title="Refresh list">
            <Loader2 className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-500' : 'text-slate-400'}`} />
            Refresh
          </button>
          {!isApiConnected && (
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              Demo mode — derived from local orders
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Search by name, email or phone..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-500 bg-slate-50 text-sm"
          />
        </div>
      </div>

      {/* Table */}
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
                    <th className="text-center py-4 px-6 font-semibold text-slate-700">Orders</th>
                    <th className="text-center py-4 px-6 font-semibold text-slate-700">Delivered</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">Earned Tier</th>
                    <th className="text-center py-4 px-6 font-semibold text-slate-700">Reseller</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">Joined</th>
                    <th className="py-4 px-6" />
                  </tr>
                </thead>
                <tbody>
                  {paged.map(c => (
                    <>
                      <tr key={c._id}
                        className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${expandedId === c._id ? 'bg-blue-50/30' : ''}`}>
                        {/* Name / Email */}
                        <td className="py-4 px-6">
                          {editingId === c._id ? (
                            <div className="flex gap-2">
                              <input value={editForm.firstName}
                                onChange={e => setEditForm(p => ({ ...p, firstName: e.target.value }))}
                                className="border border-slate-300 rounded-lg px-2 py-1 text-sm w-24" placeholder="First" />
                              <input value={editForm.lastName}
                                onChange={e => setEditForm(p => ({ ...p, lastName: e.target.value }))}
                                className="border border-slate-300 rounded-lg px-2 py-1 text-sm w-24" placeholder="Last" />
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-slate-900">{c.firstName} {c.lastName}</p>
                                {c.isRegistered === false && (
                                  <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium">Guest</span>
                                )}
                              </div>
                              <p className="text-slate-500 text-xs">{c.email}</p>
                            </div>
                          )}
                        </td>
                        {/* Phone */}
                        <td className="py-4 px-6">
                          {editingId === c._id ? (
                            <input value={editForm.phone}
                              onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))}
                              className="border border-slate-300 rounded-lg px-2 py-1 text-sm w-32" />
                          ) : (
                            <span className="text-slate-600">{c.phone || '—'}</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-center font-medium text-slate-900">{c.totalOrders ?? 0}</td>
                        <td className="py-4 px-6 text-center font-medium text-emerald-700">{c.deliveredOrders ?? 0}</td>
                        <td className="py-4 px-6">
                          <TierBadge deliveredOrders={c.deliveredOrders ?? 0} config={promoConfig} />
                        </td>
                        <td className="py-4 px-6 text-center">
                          {editingId === c._id ? (
                            <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
                              <input
                                type="checkbox"
                                checked={editForm.isReseller}
                                onChange={(e) => setEditForm(p => ({ ...p, isReseller: e.target.checked }))}
                                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                              />
                              Reseller
                            </label>
                          ) : (
                            c.isReseller ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                                Reseller
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400">—</span>
                            )
                          )}
                        </td>
                        <td className="py-4 px-6 text-slate-500 text-xs">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </td>
                        {/* Actions */}
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-1">
                            {editingId === c._id ? (
                              <>
                                <button onClick={() => saveEdit(c._id)} disabled={isSaving}
                                  className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg">
                                  {isSaving
                                    ? <Loader2 className="w-4 h-4 animate-spin" />
                                    : <Check className="w-4 h-4" />}
                                </button>
                                <button onClick={() => setEditingId(null)}
                                  className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg">
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button onClick={() => toggleExpand(c._id)}
                                  className={`p-1.5 rounded-lg transition-colors ${
                                    expandedId === c._id
                                      ? 'bg-blue-100 text-blue-700'
                                      : 'text-slate-400 hover:bg-slate-100'
                                  }`}
                                  title="View orders">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button onClick={() => startEdit(c)}
                                  className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg" title="Edit">
                                  <Edit2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expanded orders row */}
                      {expandedId === c._id && (
                        <tr key={`${c._id}-orders`} className="bg-slate-50 border-b border-slate-200">
                          <td colSpan={8} className="px-8 py-5">
                            <CustomerOrdersPanel
                              customerId={c._id}
                              isApiConnected={isApiConnected}
                            />
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Customer-level pagination — always visible */}
            <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-slate-200 gap-4">
              <p className="text-sm text-slate-500">
                Showing{' '}
                <span className="font-semibold text-slate-700">
                  {totalCustomers === 0 ? 0 : (currentPage - 1) * CUSTOMERS_PER_PAGE + 1}
                </span>
                {' '}–{' '}
                <span className="font-semibold text-slate-700">
                  {Math.min(currentPage * CUSTOMERS_PER_PAGE, totalCustomers)}
                </span>
                {' '}of{' '}
                <span className="font-semibold text-slate-700">{totalCustomers}</span>
                {' '}customers
              </p>
              {totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {[...Array(totalPages)].map((_, i) => {
                    const pg = i + 1;
                    if (totalPages <= 7 || pg === 1 || pg === totalPages || Math.abs(pg - currentPage) <= 1) {
                      return (
                        <button key={pg} onClick={() => setCurrentPage(pg)}
                          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                            pg === currentPage
                              ? 'bg-slate-900 text-white shadow-sm'
                              : 'text-slate-600 hover:bg-slate-100 border border-slate-200'
                          }`}>
                          {pg}
                        </button>
                      );
                    }
                    if (Math.abs(pg - currentPage) === 2) {
                      return <span key={pg} className="text-slate-400 px-1">…</span>;
                    }
                    return null;
                  })}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminCustomers;
