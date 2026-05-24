import { useState, useEffect, useCallback } from 'react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useCustomerStore } from '../../context/store';
import { Menu, X, LayoutDashboard, ShoppingBag, User, LogOut, Loader2, AlertCircle, Search, ChevronLeft, ChevronRight, Gift, Lock, Copy, CheckCircle, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getCustomerOrders, getProductById, ORDER_SYNC_EVENT } from '../../services/api';
import { customerAuthService } from '../../services/customerAuthService';
import { getPromoConfig, getEarnedPromos, getNextMilestone, isResellerCustomer, PROMO_CONFIG_EVENT, loadPromoConfigFromServer } from '../../utils/promotions';

const RewardsCard = ({ deliveredOrderCount, promoConfig, orders = [], customerEmail, customer }) => {
  const [copied, setCopied] = useState(null);
  const promos = getEarnedPromos(deliveredOrderCount, promoConfig, customer);
  const resellerCustomer = isResellerCustomer(customer);
  // For resellers: promos already contains ONLY resellerOnly tiers (filtered by getEarnedPromos)
  // For normal customers: promos contains ONLY non-resellerOnly tiers
  const resellerPromos = resellerCustomer ? promos : [];
  const visiblePromos = resellerCustomer ? [] : promos;
  const nextMilestone = resellerCustomer ? null : getNextMilestone(deliveredOrderCount, promoConfig, customer);
  const prevMilestone = [...visiblePromos].reverse().find(p => p.earned);
  const progressFrom = prevMilestone ? prevMilestone.minOrders : 0;
  const progressTo = nextMilestone ? nextMilestone.minOrders : (prevMilestone ? prevMilestone.minOrders : 5);
  const progressPct = nextMilestone
    ? Math.min(100, ((deliveredOrderCount - progressFrom) / (progressTo - progressFrom)) * 100)
    : 100;


  const normalizedCustomerEmail = customerEmail?.toLowerCase();
  const normalizeStatus = (status) => String(status || '').toLowerCase();
  const isCancelled = (status) => ['cancelled', 'canceled'].includes(normalizeStatus(status));
  const safeUpper = (value) => String(value || '').toUpperCase();
  const localOrders = (() => {
    try {
      return JSON.parse(localStorage.getItem('vibeit_orders_db') || '[]');
    } catch {
      return [];
    }
  })();

  // Build a set of promo codes this customer has already used in non-cancelled orders
  const usedPromoCodes = new Set([
    ...orders
      .filter(o => o.promoCode && !isCancelled(o.status))
      .map(o => safeUpper(o.promoCode)),
    ...localOrders
      .filter(o =>
        o.promoCode &&
        !isCancelled(o.status) &&
        (!normalizedCustomerEmail || o.shippingAddress?.email?.toLowerCase() === normalizedCustomerEmail)
      )
      .map(o => safeUpper(o.promoCode)),
  ]);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    toast.success(`Copied ${code} to clipboard!`);
    setTimeout(() => setCopied(null), 2500);
  };

  return (
    <div className="premium-card p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-sm">
          <Gift className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Your Rewards</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {resellerCustomer ? 'Reseller approved' : `${deliveredOrderCount} delivered orders`}
          </p>
        </div>
      </div>

      {promoConfig.freeDeliveryEnabled && (
        <div className="mb-5 flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-xl px-4 py-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">🎉 Free Delivery Active!</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">Admin has enabled free delivery for all orders right now.</p>
          </div>
        </div>
      )}

      {resellerCustomer && resellerPromos.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Reseller Promotions</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Available only for approved reseller customers</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              Approved
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {resellerPromos.map((promo) => {
              const isUsed = false;
              return (
                <div
                  key={promo.id}
                  className={`rounded-xl border p-4 transition-all ${
                    isUsed ? 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50' : 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{promo.label}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{promo.description}</p>
                      <p className="text-xs text-slate-400 mt-1">Reseller only promotion</p>
                    </div>
                    {isUsed ? (
                      <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                        Used
                      </span>
                    ) : (
                      <button
                        onClick={() => copyCode(promo.promoCode)}
                        className="btn-primary flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold whitespace-nowrap"
                      >
                        {copied === promo.promoCode ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied === promo.promoCode ? 'Copied!' : promo.promoCode}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Progress bar — only for normal customers working toward a milestone */}
      {!resellerCustomer && nextMilestone && (
        <div className="mb-5">
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span>{deliveredOrderCount} orders</span>
            <span>{progressTo} orders to unlock <strong className="dark:text-white">{nextMilestone.promoCode}</strong></span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5">
            <div className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
              style={{ width: `${progressPct}%` }} />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {nextMilestone.minOrders - deliveredOrderCount} more deliveries to unlock <strong className="dark:text-white">{nextMilestone.description}</strong>
          </p>
        </div>
      )}

      {!resellerCustomer && (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {visiblePromos.map(promo => {
          const isUsed = usedPromoCodes.has(promo.promoCode.toUpperCase());
          return (
            <div key={promo.id}
              className={`rounded-xl border p-4 transition-all ${
                !promo.earned
                  ? 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 opacity-60'
                  : isUsed
                    ? 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'
                    : 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30'
              }`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-semibold ${promo.earned ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                      {promo.label}
                    </p>
                    {promo.earned && isUsed && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                        Used
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{promo.description}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    {promo.resellerOnly ? 'Reseller only promotion' : `${promo.minOrders}+ delivered orders`}
                  </p>
                </div>
                {promo.earned ? (
                  isUsed ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs font-semibold rounded-lg cursor-not-allowed whitespace-nowrap">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Used ✓
                    </div>
                  ) : (
                    <button onClick={() => copyCode(promo.promoCode)}
                      className="btn-primary flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold whitespace-nowrap">
                      {copied === promo.promoCode ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied === promo.promoCode ? 'Copied!' : promo.promoCode}
                    </button>
                  )
                ) : (
                  <div className="flex items-center gap-1 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
};

const normalizeMfaStatus = (payload, fallbackCustomer) => {
  const source = payload || fallbackCustomer || {};
  const enabledRaw =
    source?.enabled ??
    source?.mfaEnabled ??
    source?.mfa?.enabled ??
    fallbackCustomer?.mfaEnabled ??
    fallbackCustomer?.mfa?.enabled;
  const methodRaw =
    source?.method ??
    source?.mfaMethod ??
    source?.mfa?.method ??
    fallbackCustomer?.mfa?.method ??
    '';
  return {
    enabled: Boolean(enabledRaw),
    method: methodRaw || '',
  };
};

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { customer, logout, updateProfile, refreshCustomer } = useCustomerAuth();
  const { orders, setOrders } = useCustomerStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [orderError, setOrderError] = useState(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [resolvedItemNames, setResolvedItemNames] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  const [promoConfig, setPromoConfig] = useState(getPromoConfig());
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaMethod, setMfaMethod] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [totpSetup, setTotpSetup] = useState(null);
  const [isStartingTotp, setIsStartingTotp] = useState(false);
  const [isVerifyingTotp, setIsVerifyingTotp] = useState(false);
  const [hasLoadedMfa, setHasLoadedMfa] = useState(false);

  const readLocalOrders = useCallback(() => {
    try {
      const cached = JSON.parse(localStorage.getItem('vibeit_orders_db') || '[]');
      if (!Array.isArray(cached)) return [];
      const customerEmail = customer?.email?.toLowerCase();
      if (!customerEmail) return cached;
      return cached.filter(
        (order) => order?.shippingAddress?.email?.toLowerCase() === customerEmail
      );
    } catch {
      return [];
    }
  }, [customer?.email]);

  const mergeOrders = useCallback((remoteOrders = []) => {
    const merged = new Map();
    const localOrders = readLocalOrders();

    for (const localOrder of localOrders) {
      const key = localOrder?.orderNumber || localOrder?._id;
      if (key) {
        merged.set(String(key), localOrder);
      }
    }

    for (const remoteOrder of remoteOrders) {
      const key = remoteOrder?.orderNumber || remoteOrder?._id;
      if (key) {
        merged.set(String(key), remoteOrder);
      }
    }

    return Array.from(merged.values()).sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );
  }, [readLocalOrders]);

  useEffect(() => {
    if (customer) {
      setProfileForm({
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        phone: customer.phone || '',
      });
    }
  }, [customer]);

  const applyMfaStatus = useCallback((payload, fallbackCustomer) => {
    const normalized = normalizeMfaStatus(payload, fallbackCustomer);
    setMfaEnabled(normalized.enabled);
    if (normalized.method) {
      setMfaMethod(normalized.method);
    }
    return normalized;
  }, []);

  useEffect(() => {
    if (!customer) return;
    applyMfaStatus(null, customer);
  }, [customer, applyMfaStatus]);

  useEffect(() => {
    if (!customer || hasLoadedMfa) return;
    const loadMfaStatus = async () => {
      try {
        const response = await customerAuthService.getMfaStatus();
        applyMfaStatus(response, customer);
      } catch {
        // Silent - surface errors on explicit actions
      } finally {
        setHasLoadedMfa(true);
      }
    };
    loadMfaStatus();
  }, [customer, hasLoadedMfa, applyMfaStatus]);

  useEffect(() => {
    const handler = () => setPromoConfig(getPromoConfig());
    window.addEventListener(PROMO_CONFIG_EVENT, handler);
    loadPromoConfigFromServer().then(setPromoConfig).catch(() => {});
    return () => window.removeEventListener(PROMO_CONFIG_EVENT, handler);
  }, []);

  const deliveredOrderCount = orders.filter(o => ['Delivered', 'delivered'].includes(o.status)).length;

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setIsSavingProfile(true);
      await updateProfile(profileForm);
      toast.success('Profile updated successfully');
      setIsEditingProfile(false);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleStartTotpSetup = async () => {
    try {
      setIsStartingTotp(true);
      const response = await customerAuthService.startTotpSetup();
      setTotpSetup({
        qrCode:
          response?.qrCodeDataUrl ||
          response?.qrCode ||
          response?.qrCodeUrl ||
          response?.qr ||
          '',
        otpauthUrl: response?.otpauthUrl || response?.otpAuthUrl || response?.uri || '',
        secret: response?.secret || response?.sharedSecret || '',
      });
      toast.success('Scan the QR code to set up your authenticator app.');
    } catch (error) {
      toast.error(error?.message || error?.response?.data?.message || 'Failed to start MFA setup');
    } finally {
      setIsStartingTotp(false);
    }
  };

  const handleVerifyTotpSetup = async (e) => {
    e.preventDefault();
    const code = totpCode.trim();
    if (code.length !== 6) {
      toast.error('Enter the 6-digit code from your authenticator.');
      return;
    }
    try {
      setIsVerifyingTotp(true);
      const response = await customerAuthService.verifyTotpSetup(code);
      applyMfaStatus(response, customer);
      await refreshCustomer();
      setTotpCode('');
      setTotpSetup(null);
      toast.success('MFA enabled successfully.');
    } catch (error) {
      toast.error(error?.message || error?.response?.data?.message || 'Verification failed');
    } finally {
      setIsVerifyingTotp(false);
    }
  };

  const loadOrders = useCallback(async () => {
    if (!customer) return;
    try {
      setIsLoadingOrders(true);
      setOrderError(null);
      // Use getCustomerOrders to fetch only this customer's orders
      const response = await getCustomerOrders({ page: 1, limit: 500 });
      const remoteOrders = response?.orders || [];
      setOrders(mergeOrders(remoteOrders));
    } catch {
      setOrderError('Failed to load orders. Please try again later.');
      setOrders(mergeOrders([]));
    } finally {
      setIsLoadingOrders(false);
    }
  }, [customer, mergeOrders, setOrders]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    if (!customer) return;
    const refreshOrders = () => {
      loadOrders();
    };

    window.addEventListener(ORDER_SYNC_EVENT, refreshOrders);
    window.addEventListener('storage', refreshOrders);

    return () => {
      window.removeEventListener(ORDER_SYNC_EVENT, refreshOrders);
      window.removeEventListener('storage', refreshOrders);
    };
  }, [customer, loadOrders]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const normalizedQuery = orderSearchQuery
    .trim()
    .toLowerCase()
    .replace('order id', '')
    .replace('#', '')
    .trim();

  const getOrderItemsCount = (order) => {
    if (Array.isArray(order?.items)) return order.items.length;
    if (Array.isArray(order?.orderItems)) return order.orderItems.length;
    return 0;
  };

  const getOrderItems = (order) => {
    if (Array.isArray(order?.items) && order.items.length > 0) return order.items;
    if (Array.isArray(order?.orderItems)) return order.orderItems;
    return [];
  };

  const getOrderItemProductId = (item) =>
    item?.productId ||
    item?.product?._id ||
    item?.product?.id ||
    (typeof item?.product === 'string' ? item.product : '');

  const getOrderItemDisplayName = (item, index) =>
    item?.product?.name ||
    item?.name ||
    item?.productName ||
    item?.title ||
    resolvedItemNames[getOrderItemProductId(item)] ||
    item?.productId ||
    item?.product?._id ||
    item?.product?.id ||
    (typeof item?.product === 'string' ? item.product : '') ||
    `Product ${index + 1}`;

  const normalizeStatus = (status) => String(status || '').toLowerCase();

  const searchedOrder = normalizedQuery
    ? orders.find((order) =>
        [order.orderNumber, order._id]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalizedQuery))
      )
    : null;

  const filteredOrders = normalizedQuery
    ? orders.filter((order) =>
        [order.orderNumber, order._id]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalizedQuery))
      )
    : orders;

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [normalizedQuery]);

  const displayedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  useEffect(() => {
    const resolveMissingProductNames = async () => {
      if (!searchedOrder) return;

      const items = getOrderItems(searchedOrder);
      const missingProductIds = [...new Set(
        items
          .filter((item) => !(item?.product?.name || item?.name || item?.productName || item?.title))
          .map((item) => getOrderItemProductId(item))
          .filter(Boolean)
          .filter((id) => !resolvedItemNames[id])
      )];

      if (missingProductIds.length === 0) return;

      const entries = await Promise.all(
        missingProductIds.map(async (productId) => {
          try {
            const product = await getProductById(productId);
            const productName = product?.name || product?.data?.name || product?.product?.name || '';
            return productName ? [productId, productName] : null;
          } catch {
            return null;
          }
        })
      );

      const newNames = Object.fromEntries(entries.filter(Boolean));
      if (Object.keys(newNames).length > 0) {
        setResolvedItemNames((prev) => ({ ...prev, ...newNames }));
      }
    };

    resolveMissingProductNames();
  }, [searchedOrder, resolvedItemNames]);

  const getStatusBadgeClass = (status) => {
    const normalizedStatus = normalizeStatus(status);
    if (normalizedStatus === 'delivered') return 'bg-emerald-100 text-emerald-700';
    if (normalizedStatus === 'shipped') return 'bg-blue-600 text-white';
    if (normalizedStatus === 'processing') return 'bg-amber-100 text-amber-700';
    return 'bg-slate-100 text-slate-700';
  };

  // Customer initials for avatar
  const initials = `${customer?.firstName?.[0] || ''}${customer?.lastName?.[0] || ''}`.toUpperCase() || '?';

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen lg:flex overflow-x-clip">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-[5.5rem] left-4 z-30 p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-slate-700 dark:text-slate-300"
        aria-label="Open customer menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute inset-0 bg-slate-900/45 dark:bg-slate-900/80 backdrop-blur-sm"
          aria-label="Close customer menu overlay"
        />
      </div>

      {/* ── Sidebar ── */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-24 left-0 h-screen lg:h-[calc(100vh-6rem)] w-72 flex flex-col bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 z-50 lg:z-20 shadow-sm transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile close header */}
        <div className="h-14 lg:hidden px-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Account Menu</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
            aria-label="Close customer menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Desktop: Blue gradient customer card ── */}
        <div className="hidden lg:block bg-gradient-to-br from-blue-600 to-blue-700 px-5 py-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-base">{initials}</span>
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold text-sm truncate">
                {customer?.firstName} {customer?.lastName}
              </p>
              <p className="text-blue-200 text-xs truncate">{customer?.email}</p>
            </div>
          </div>
          {/* Mini stats */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="bg-white/10 rounded-xl px-3 py-2 text-center">
              <p className="text-white font-bold text-lg leading-none">{orders.length}</p>
              <p className="text-blue-200 text-xs mt-0.5">Orders</p>
            </div>
            <div className="bg-white/10 rounded-xl px-3 py-2 text-center">
              <p className="text-white font-bold text-lg leading-none">{deliveredOrderCount}</p>
              <p className="text-blue-200 text-xs mt-0.5">Delivered</p>
            </div>
          </div>
        </div>

        {/* ── Nav items ── */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3 mb-3 hidden lg:block">Menu</p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                {item.label}
                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-70" />}
              </button>
            );
          })}

          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              Sign Out
            </button>
          </div>
        </nav>
      </aside>

      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 pt-20 lg:pt-8 pb-8">
        {activeSection === 'overview' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                Welcome back, {customer?.firstName}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">Here is your account overview.</p>
            </div>

            {orderError && (
              <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-red-700 dark:text-red-400">{orderError}</p>
              </div>
            )}

            {isLoadingOrders && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-slate-700 dark:text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600 dark:text-slate-400">Loading your orders...</p>
                </div>
              </div>
            )}

            {!isLoadingOrders && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  <article className="premium-card p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Total Orders</p>
                        <p className="text-3xl font-semibold text-slate-900 dark:text-white mt-2">{orders.length}</p>
                      </div>
                      <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </article>

                  <article className="premium-card p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Active Orders</p>
                        <p className="text-3xl font-semibold text-slate-900 dark:text-white mt-2">
                          {orders.filter((o) => ['pending', 'confirmed', 'processing', 'shipped'].includes(o.status)).length}
                        </p>
                      </div>
                      <div className="w-11 h-11 bg-amber-500 rounded-xl flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </article>

                  <article className="premium-card p-6 shadow-sm sm:col-span-2 xl:col-span-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Delivered</p>
                        <p className="text-3xl font-semibold text-slate-900 dark:text-white mt-2">
                          {deliveredOrderCount}
                        </p>
                      </div>
                      <div className="w-11 h-11 bg-emerald-600 rounded-xl flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </article>
                </div>

                {/* Rewards Card */}
                <RewardsCard
                  deliveredOrderCount={deliveredOrderCount}
                  promoConfig={promoConfig}
                  orders={orders}
                  customerEmail={customer?.email}
                  customer={customer}
                />
              </>
            )}
          </div>
        )}

        {activeSection === 'orders' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">My Orders</h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">View and track all your orders.</p>
            </div>

            <div className="premium-card p-6 shadow-sm">
              <label htmlFor="order-search" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Search by Order ID
              </label>
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="order-search"
                  type="text"
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  placeholder="Enter Order ID (e.g., VIB-1001)"
                  className="form-input pl-10 pr-4 py-2.5 w-full"
                />
              </div>
            </div>

            {normalizedQuery && (
              <div className="bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 md:p-5">
                {searchedOrder ? (
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <p className="text-sm text-slate-700 dark:text-slate-400 font-medium">Order found</p>
                        <p className="text-lg font-semibold text-slate-900 dark:text-white">{searchedOrder.orderNumber || searchedOrder._id}</p>
                        <p className="text-sm text-slate-700 dark:text-slate-400">
                          {new Date(searchedOrder.createdAt).toLocaleDateString()} • {getOrderItemsCount(searchedOrder)} items
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">රු{searchedOrder.total?.toLocaleString() || 0}</p>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusBadgeClass(searchedOrder.status)}`}>
                          {searchedOrder.status}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">Items</p>
                      {getOrderItems(searchedOrder).length > 0 ? (
                        <div className="space-y-2">
                          {getOrderItems(searchedOrder).map((item, index) => (
                            <div
                              key={`${searchedOrder._id || searchedOrder.orderNumber}-item-${index}`}
                              className="flex items-center justify-between premium-card p-3"
                            >
                              <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                  {getOrderItemDisplayName(item, index)}
                                </p>
                                <p className="text-xs text-slate-600 dark:text-slate-400">
                                  Qty: {item?.quantity || 0} {item?.size ? `• Size: ${item.size}` : ''}
                                </p>
                              </div>
                              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                රු{Number((item?.price || 0) * (item?.quantity || 0)).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-600 dark:text-slate-400">No item details available for this order.</p>
                      )}
                    </div>

                    {searchedOrder?.notes && (
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">Order Notes</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{searchedOrder.notes}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm font-medium text-red-700 dark:text-red-400">No order found for “{orderSearchQuery}”.</p>
                )}
              </div>
            )}

            <div className="premium-card p-6 shadow-sm">
              {orders.length > 0 ? (
                displayedOrders.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700 text-left">
                          <th className="py-3 pr-4 font-semibold text-slate-700 dark:text-slate-300">Order ID</th>
                          <th className="py-3 pr-4 font-semibold text-slate-700 dark:text-slate-300">Date</th>
                          <th className="py-3 pr-4 font-semibold text-slate-700 dark:text-slate-300">Items</th>
                          <th className="py-3 pr-4 font-semibold text-slate-700 dark:text-slate-300">Amount</th>
                          <th className="py-3 pr-4 font-semibold text-slate-700 dark:text-slate-300">Status</th>
                          <th className="py-3 pl-4 font-semibold text-slate-700 dark:text-slate-300"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayedOrders.map((order) => (
                          <tr key={order._id} className="border-b border-slate-100 dark:border-slate-800 last:border-b-0">
                            <td className="py-3 pr-4 font-semibold text-slate-900 dark:text-white">{order.orderNumber || order._id}</td>
                            <td className="py-3 pr-4 text-slate-600 dark:text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td className="py-3 pr-4 text-slate-600 dark:text-slate-400">{getOrderItemsCount(order)}</td>
                            <td className="py-3 pr-4 font-medium text-slate-900 dark:text-white">රු{order.total?.toLocaleString() || 0}</td>
                            <td className="py-3 pr-4">
                              <span className={`text-xs font-semibold px-3 py-1 rounded-full inline-block ${getStatusBadgeClass(order.status)}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="py-3 pl-4 text-right">
                              <button
                                onClick={() => {
                                  setOrderSearchQuery(order.orderNumber || order._id);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 px-3 py-1.5 rounded-lg whitespace-nowrap"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-4 mt-4 gap-4">
                      <p className="text-sm text-slate-700 dark:text-slate-400 text-center sm:text-left">
                        Showing <span className="font-medium">{(currentPage - 1) * ordersPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * ordersPerPage, filteredOrders.length)}</span> of{' '}
                        <span className="font-medium">{filteredOrders.length}</span> results
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        
                        <div className="flex items-center gap-1">
                          {[...Array(totalPages)].map((_, i) => {
                            if (
                              totalPages <= 5 || 
                              i === 0 || 
                              i === totalPages - 1 || 
                              (i + 1 >= currentPage - 1 && i + 1 <= currentPage + 1)
                            ) {
                              return (
                                <button
                                  key={i + 1}
                                  onClick={() => setCurrentPage(i + 1)}
                                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                                    currentPage === i + 1
                                      ? 'bg-blue-600 text-white'
                                      : 'text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                  }`}
                                >
                                  {i + 1}
                                </button>
                              );
                            }
                            if (i + 1 === currentPage - 2 || i + 1 === currentPage + 2) {
                              return <span key={i} className="px-1 text-slate-400 dark:text-slate-500">...</span>;
                            }
                            return null;
                          })}
                        </div>

                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-slate-600 dark:text-slate-400 text-center py-12">No orders found for this Order ID.</p>
                )
              ) : (
                <p className="text-slate-600 dark:text-slate-400 text-center py-12">No orders yet. Ready to shop? Browse our store now.</p>
              )}
            </div>
          </div>
        )}

        {activeSection === 'profile' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">My Profile</h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your personal information.</p>
            </div>

            <div className="premium-card p-6 sm:p-8 shadow-sm max-w-3xl">
              {isEditingProfile ? (
                <form onSubmit={handleProfileUpdate}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">First Name</label>
                      <input
                        type="text"
                        required
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                        className="form-input w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Last Name</label>
                      <input
                        type="text"
                        required
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                        className="form-input w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Email</label>
                      <input
                        type="email"
                        disabled
                        value={customer?.email || ''}
                        className="form-input w-full bg-slate-50 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
                      />
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Email cannot be changed</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Phone</label>
                      <input
                        type="tel"
                        required
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="form-input w-full"
                      />
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      className="btn-primary px-6 py-2.5 flex items-center gap-2"
                    >
                      {isSavingProfile && <Loader2 className="w-4 h-4 animate-spin" />}
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingProfile(false);
                        setProfileForm({
                          firstName: customer?.firstName || '',
                          lastName: customer?.lastName || '',
                          phone: customer?.phone || '',
                        });
                      }}
                      disabled={isSavingProfile}
                      className="btn-outline px-6 py-2.5"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">First Name</label>
                      <p className="text-lg font-semibold text-slate-900 dark:text-white">{customer?.firstName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Last Name</label>
                      <p className="text-lg font-semibold text-slate-900 dark:text-white">{customer?.lastName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Email</label>
                      <p className="text-lg font-semibold text-slate-900 dark:text-white break-all">{customer?.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Phone</label>
                      <p className="text-lg font-semibold text-slate-900 dark:text-white">{customer?.phone}</p>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <button 
                      onClick={() => setIsEditingProfile(true)}
                      className="btn-primary px-6 py-2.5"
                    >
                      Edit Profile
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="premium-card p-6 sm:p-8 shadow-sm max-w-3xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Account Security</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Protect your account with MFA.</p>
                </div>
                {mfaEnabled ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                    <CheckCircle className="w-3.5 h-3.5" />
                    MFA Enabled
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    <Lock className="w-3.5 h-3.5" />
                    MFA Disabled
                  </span>
                )}
              </div>
              {mfaEnabled && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Method: {mfaMethod || 'Authenticator app'}
                </p>
              )}

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Authenticator app (TOTP)</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Scan a QR code to enable MFA.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleStartTotpSetup}
                    disabled={isStartingTotp || mfaEnabled}
                    className="mt-4 w-full btn-primary px-4 py-2.5 text-sm"
                  >
                    {isStartingTotp
                      ? 'Starting setup…'
                      : mfaEnabled
                        ? 'MFA Already Enabled'
                        : totpSetup
                          ? 'Restart setup'
                          : 'Start setup'}
                  </button>
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-slate-800/20">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Verify setup</p>
                  {mfaEnabled ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400">MFA is active for this account.</p>
                  ) : totpSetup ? (
                    <form onSubmit={handleVerifyTotpSetup} className="space-y-3">
                      {totpSetup.qrCode ? (
                        <div className="flex justify-center">
                          <img
                            src={totpSetup.qrCode}
                            alt="Authenticator QR code"
                            className="h-32 w-32 rounded-lg border border-slate-200 dark:border-slate-600 bg-white p-2"
                          />
                        </div>
                      ) : totpSetup.otpauthUrl ? (
                        <p className="text-xs text-slate-500 dark:text-slate-400 break-all">
                          {totpSetup.otpauthUrl}
                        </p>
                      ) : totpSetup.secret ? (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Secret: <span className="font-semibold">{totpSetup.secret}</span>
                        </p>
                      ) : null}
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={totpCode}
                        onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter 6-digit code"
                        className="form-input w-full text-sm py-2.5 px-3"
                      />
                      <button
                        type="submit"
                        disabled={isVerifyingTotp}
                        className="btn-primary w-full px-4 py-2.5 text-sm"
                      >
                        {isVerifyingTotp ? 'Verifying…' : 'Verify & Enable'}
                      </button>
                    </form>
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Start setup to get your QR code and enable MFA.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerDashboard;
