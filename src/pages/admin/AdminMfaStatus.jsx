import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Search, ShieldCheck, XCircle } from 'lucide-react';
import { getAdminMfaStatus } from '../../services/api';

const SORT_OPTIONS = [
  { value: 'created_desc', label: 'Created At (Newest)' },
  { value: 'created_asc', label: 'Created At (Oldest)' },
  { value: 'name_asc', label: 'Name (A–Z)' },
  { value: 'name_desc', label: 'Name (Z–A)' },
  { value: 'email_asc', label: 'Email (A–Z)' },
  { value: 'email_desc', label: 'Email (Z–A)' },
];

const getName = (item) => {
  if (!item) return '—';
  const name = item.name || item.fullName;
  if (name) return name;
  const first = item.firstName || item.first_name || '';
  const last = item.lastName || item.last_name || '';
  const joined = `${first} ${last}`.trim();
  return joined || '—';
};

const getEmail = (item) => item?.email || item?.userEmail || '—';

const getCreatedAt = (item) =>
  item?.createdAt || item?.created_at || item?.created || item?.joinedAt || null;

const getRole = (item) => item?.role || item?.adminRole || item?.userRole || '—';

const getMfaEnabled = (item) => {
  const raw =
    item?.mfaEnabled ??
    item?.isMfaEnabled ??
    item?.mfa?.enabled ??
    item?.mfa?.isEnabled ??
    item?.mfa?.active ??
    item?.mfaStatus ??
    item?.mfa_status ??
    item?.mfa;
  if (typeof raw === 'boolean') return raw;
  if (typeof raw === 'string') {
    return ['enabled', 'true', 'yes', 'active', 'on'].includes(raw.toLowerCase());
  }
  return Boolean(raw);
};

const parseDateValue = (value) => {
  if (!value) return 0;
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? 0 : date.valueOf();
};

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return '—';
  return date.toLocaleString();
};

const normalizePayload = (payload) => {
  const data = payload?.data ?? payload ?? {};
  const customers = Array.isArray(data.customers)
    ? data.customers
    : Array.isArray(data.customer)
      ? data.customer
      : [];
  const admins = Array.isArray(data.admins)
    ? data.admins
    : Array.isArray(data.admin)
      ? data.admin
      : [];
  return { summary: data.summary ?? data.counts ?? null, customers, admins };
};

const resolveSummary = (summary, customers, admins) => {
  const fallbackSummary = (list) => {
    const enabled = list.filter(getMfaEnabled).length;
    const total = list.length;
    return { enabled, disabled: total - enabled, total };
  };

  const resolveGroup = (key) => {
    const group = summary?.[key];
    if (!group || typeof group !== 'object') return null;
    const enabled = Number(
      group.enabled ??
        group.mfaEnabled ??
        group.enabledCount ??
        group.countEnabled ??
        group.true ??
        group.on
    );
    const disabled = Number(
      group.disabled ??
        group.mfaDisabled ??
        group.disabledCount ??
        group.countDisabled ??
        group.false ??
        group.off
    );
    const total = Number(group.total ?? group.count ?? group.totalUsers ?? group.totalCount);
    if (Number.isNaN(enabled) && Number.isNaN(disabled) && Number.isNaN(total)) return null;
    const safeEnabled = Number.isNaN(enabled) ? 0 : enabled;
    const safeDisabled = Number.isNaN(disabled) ? 0 : disabled;
    const safeTotal = Number.isNaN(total) ? safeEnabled + safeDisabled : total;
    return { enabled: safeEnabled, disabled: safeDisabled, total: safeTotal };
  };

  return {
    customers: resolveGroup('customers') || fallbackSummary(customers),
    admins: resolveGroup('admins') || fallbackSummary(admins),
  };
};

const applySort = (items, sort) => {
  const sorted = [...items];
  sorted.sort((a, b) => {
    switch (sort) {
      case 'created_asc':
        return parseDateValue(getCreatedAt(a)) - parseDateValue(getCreatedAt(b));
      case 'name_asc':
        return getName(a).localeCompare(getName(b));
      case 'name_desc':
        return getName(b).localeCompare(getName(a));
      case 'email_asc':
        return getEmail(a).localeCompare(getEmail(b));
      case 'email_desc':
        return getEmail(b).localeCompare(getEmail(a));
      case 'created_desc':
      default:
        return parseDateValue(getCreatedAt(b)) - parseDateValue(getCreatedAt(a));
    }
  });
  return sorted;
};

const MfaBadge = ({ enabled }) => (
  <span
    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
      enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
    }`}
  >
    {enabled ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
    {enabled ? 'Enabled' : 'Disabled'}
  </span>
);

const SummaryCard = ({ title, enabled, disabled, total }) => (
  <article className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
    <div className="flex items-start justify-between mb-4">
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="text-2xl font-semibold text-slate-900 mt-1">{total}</p>
      </div>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-slate-900">
        <ShieldCheck className="w-5 h-5 text-white" />
      </div>
    </div>
    <div className="flex items-center gap-3 text-sm">
      <span className="text-emerald-700 font-semibold">{enabled} enabled</span>
      <span className="text-slate-400">•</span>
      <span className="text-slate-600 font-semibold">{disabled} disabled</span>
    </div>
  </article>
);

const AdminMfaStatus = () => {
  const queryClient = useQueryClient();
  const [customerSearch, setCustomerSearch] = useState('');
  const [adminSearch, setAdminSearch] = useState('');
  const [customerFilter, setCustomerFilter] = useState('all');
  const [adminFilter, setAdminFilter] = useState('all');
  const [customerSort, setCustomerSort] = useState('created_desc');
  const [adminSort, setAdminSort] = useState('created_desc');
  const [adminRole, setAdminRole] = useState('all');

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin-mfa-status'],
    queryFn: getAdminMfaStatus,
  });

  const { summary, customers, admins } = useMemo(() => normalizePayload(data), [data]);
  const resolvedSummary = useMemo(
    () => resolveSummary(summary, customers, admins),
    [summary, customers, admins]
  );

  const adminRoles = useMemo(() => {
    const roles = new Set();
    admins.forEach((admin) => {
      const role = getRole(admin);
      if (role && role !== '—') roles.add(role);
    });
    return Array.from(roles);
  }, [admins]);

  const filteredCustomers = useMemo(() => {
    const query = customerSearch.trim().toLowerCase();
    const filtered = customers.filter((customer) => {
      if (customerFilter === 'enabled' && !getMfaEnabled(customer)) return false;
      if (customerFilter === 'disabled' && getMfaEnabled(customer)) return false;
      if (!query) return true;
      return (
        getName(customer).toLowerCase().includes(query) ||
        getEmail(customer).toLowerCase().includes(query)
      );
    });
    return applySort(filtered, customerSort);
  }, [customers, customerFilter, customerSearch, customerSort]);

  const filteredAdmins = useMemo(() => {
    const query = adminSearch.trim().toLowerCase();
    const filtered = admins.filter((admin) => {
      if (adminFilter === 'enabled' && !getMfaEnabled(admin)) return false;
      if (adminFilter === 'disabled' && getMfaEnabled(admin)) return false;
      if (adminRole !== 'all' && getRole(admin) !== adminRole) return false;
      if (!query) return true;
      return (
        getName(admin).toLowerCase().includes(query) ||
        getEmail(admin).toLowerCase().includes(query)
      );
    });
    return applySort(filtered, adminSort);
  }, [admins, adminFilter, adminRole, adminSearch, adminSort]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-slate-200 rounded-lg w-56 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 h-32 animate-pulse" />
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 h-80 animate-pulse" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-2xl border border-red-200 p-8 text-center">
        <p className="text-red-600 font-semibold mb-2">Error loading MFA status</p>
        <p className="text-gray-600 text-sm mb-4">{error?.message || 'Failed to fetch MFA data'}</p>
        <button
          onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-mfa-status'] })}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">MFA Status</h1>
          <p className="text-slate-500 mt-1">Monitor MFA coverage across customers and admins.</p>
        </div>
        <button
          onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-mfa-status'] })}
          className="px-4 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SummaryCard
          title="Customers"
          enabled={resolvedSummary.customers.enabled}
          disabled={resolvedSummary.customers.disabled}
          total={resolvedSummary.customers.total}
        />
        <SummaryCard
          title="Admins"
          enabled={resolvedSummary.admins.enabled}
          disabled={resolvedSummary.admins.disabled}
          total={resolvedSummary.admins.total}
        />
      </div>

      <section className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Customers</h2>
            <p className="text-sm text-slate-500">Total: {customers.length}</p>
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex items-center gap-2">
              {['all', 'enabled', 'disabled'].map((item) => (
                <button
                  key={item}
                  onClick={() => setCustomerFilter(item)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    customerFilter === item
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {item === 'all' ? 'All' : item === 'enabled' ? 'MFA Enabled' : 'MFA Disabled'}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={customerSearch}
                onChange={(event) => setCustomerSearch(event.target.value)}
                placeholder="Search name or email"
                className="w-full lg:w-56 pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:border-slate-500"
              />
            </div>
            <select
              value={customerSort}
              onChange={(event) => setCustomerSort(event.target.value)}
              className="px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <p>No customers match these filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">Name</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">Email</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">MFA Enabled</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer, index) => (
                    <tr
                      key={customer._id || customer.id || customer.email || index}
                      className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
                    >
                      <td className="py-4 px-6 font-semibold text-slate-900">{getName(customer)}</td>
                      <td className="py-4 px-6 text-slate-600">{getEmail(customer)}</td>
                      <td className="py-4 px-6">
                        <MfaBadge enabled={getMfaEnabled(customer)} />
                      </td>
                      <td className="py-4 px-6 text-slate-500 text-xs">
                        {formatDate(getCreatedAt(customer))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Admins</h2>
            <p className="text-sm text-slate-500">Total: {admins.length}</p>
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex items-center gap-2">
              {['all', 'enabled', 'disabled'].map((item) => (
                <button
                  key={item}
                  onClick={() => setAdminFilter(item)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    adminFilter === item
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {item === 'all' ? 'All' : item === 'enabled' ? 'MFA Enabled' : 'MFA Disabled'}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={adminSearch}
                onChange={(event) => setAdminSearch(event.target.value)}
                placeholder="Search name or email"
                className="w-full lg:w-56 pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:outline-none focus:border-slate-500"
              />
            </div>
            {adminRoles.length > 0 && (
              <select
                value={adminRole}
                onChange={(event) => setAdminRole(event.target.value)}
                className="px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white"
              >
                <option value="all">All roles</option>
                {adminRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            )}
            <select
              value={adminSort}
              onChange={(event) => setAdminSort(event.target.value)}
              className="px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {filteredAdmins.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <p>No admins match these filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">Name</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">Email</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">Role</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">MFA Enabled</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmins.map((admin, index) => (
                    <tr
                      key={admin._id || admin.id || admin.email || index}
                      className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
                    >
                      <td className="py-4 px-6 font-semibold text-slate-900">{getName(admin)}</td>
                      <td className="py-4 px-6 text-slate-600">{getEmail(admin)}</td>
                      <td className="py-4 px-6 text-slate-600">{getRole(admin)}</td>
                      <td className="py-4 px-6">
                        <MfaBadge enabled={getMfaEnabled(admin)} />
                      </td>
                      <td className="py-4 px-6 text-slate-500 text-xs">
                        {formatDate(getCreatedAt(admin))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminMfaStatus;
