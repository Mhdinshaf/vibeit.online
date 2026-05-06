import { useState, useEffect } from 'react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useCustomerStore } from '../../context/store';
import { Menu, X, LayoutDashboard, ShoppingBag, User, LogOut, Loader2, AlertCircle, Search, ChevronLeft, ChevronRight, Gift, Lock, Copy, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getCustomerOrders, getProductById } from '../../services/api';
import { getPromoConfig, getEarnedPromos, getNextMilestone, PROMO_CONFIG_EVENT } from '../../utils/promotions';

const RewardsCard = ({ deliveredOrderCount, promoConfig }) => {
  const [copied, setCopied] = useState(null);
  const promos = getEarnedPromos(deliveredOrderCount, promoConfig);
  const nextMilestone = getNextMilestone(deliveredOrderCount, promoConfig);
  const prevMilestone = [...promos].reverse().find(p => p.earned);
  const progressFrom = prevMilestone ? prevMilestone.minOrders : 0;
  const progressTo = nextMilestone ? nextMilestone.minOrders : (prevMilestone ? prevMilestone.minOrders : 5);
  const progressPct = nextMilestone
    ? Math.min(100, ((deliveredOrderCount - progressFrom) / (progressTo - progressFrom)) * 100)
    : 100;

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    toast.success(`Copied ${code} to clipboard!`);
    setTimeout(() => setCopied(null), 2500);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-sm">
          <Gift className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Your Rewards</h2>
          <p className="text-sm text-slate-500">{deliveredOrderCount} delivered orders</p>
        </div>
      </div>

      {promoConfig.freeDeliveryEnabled && (
        <div className="mb-5 flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emerald-800">🎉 Free Delivery Active!</p>
            <p className="text-xs text-emerald-600">Admin has enabled free delivery for all orders right now.</p>
          </div>
        </div>
      )}

      {nextMilestone && (
        <div className="mb-5">
          <div className="flex justify-between text-xs text-slate-500 mb-2">
            <span>{deliveredOrderCount} orders</span>
            <span>{progressTo} orders to unlock <strong>{nextMilestone.promoCode}</strong></span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5">
            <div className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
              style={{ width: `${progressPct}%` }} />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {nextMilestone.minOrders - deliveredOrderCount} more deliveries to unlock <strong>{nextMilestone.description}</strong>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {promos.map(promo => (
          <div key={promo.id}
            className={`rounded-xl border p-4 transition-all ${promo.earned
              ? 'border-blue-200 bg-blue-50'
              : 'border-slate-200 bg-slate-50 opacity-60'}`}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className={`text-sm font-semibold ${promo.earned ? 'text-slate-900' : 'text-slate-500'}`}>
                  {promo.label}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{promo.description}</p>
                <p className="text-xs text-slate-400 mt-1">{promo.minOrders}+ delivered orders</p>
              </div>
              {promo.earned ? (
                <button onClick={() => copyCode(promo.promoCode)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
                  {copied === promo.promoCode ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied === promo.promoCode ? 'Copied!' : promo.promoCode}
                </button>
              ) : (
                <div className="flex items-center gap-1 text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { customer, logout, updateProfile } = useCustomerAuth();
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

  useEffect(() => {
    if (customer) {
      setProfileForm({
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        phone: customer.phone || '',
      });
    }
  }, [customer]);

  useEffect(() => {
    const handler = () => setPromoConfig(getPromoConfig());
    window.addEventListener(PROMO_CONFIG_EVENT, handler);
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
      console.error('Profile update failed:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoadingOrders(true);
        setOrderError(null);
        // Use getCustomerOrders to fetch only this customer's orders
        const response = await getCustomerOrders({ page: 1, limit: 500 });
        const orders = response?.orders || [];
        setOrders(orders);
      } catch (error) {
        console.error('❌ CustomerDashboard: Failed to load orders:', error);
        setOrderError('Failed to load orders. Please try again later.');
      } finally {
        setIsLoadingOrders(false);
      }
    };

    if (customer) {
      loadOrders();
    }
  }, [customer, setOrders]);

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

  return (
    <div className="bg-slate-50 min-h-screen lg:flex overflow-x-clip">
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-[5.5rem] left-4 z-30 p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm text-slate-700"
        aria-label="Open customer menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm"
          aria-label="Close customer menu overlay"
        />
      </div>

      <aside
        className={`fixed lg:sticky top-0 lg:top-24 left-0 h-screen lg:h-[calc(100vh-6rem)] w-72 bg-white border-r border-slate-200 z-50 lg:z-20 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-16 lg:hidden px-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">Account Menu</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-700"
            aria-label="Close customer menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-5 space-y-2 h-full overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                  isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}

          <hr className="my-4 border-slate-200" />

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 pt-20 lg:pt-8 pb-8">
        {activeSection === 'overview' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                Welcome back, {customer?.firstName}
              </h1>
              <p className="text-slate-600 mt-1">Here is your account overview.</p>
            </div>

            {orderError && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-red-700">{orderError}</p>
              </div>
            )}

            {isLoadingOrders && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-600">Loading your orders...</p>
                </div>
              </div>
            )}

            {!isLoadingOrders && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  <article className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-600 text-sm font-medium">Total Orders</p>
                        <p className="text-3xl font-semibold text-slate-900 mt-2">{orders.length}</p>
                      </div>
                      <div className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </article>

                  <article className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-600 text-sm font-medium">Active Orders</p>
                        <p className="text-3xl font-semibold text-slate-900 mt-2">
                          {orders.filter((o) => ['pending', 'confirmed', 'processing', 'shipped'].includes(o.status)).length}
                        </p>
                      </div>
                      <div className="w-11 h-11 bg-amber-500 rounded-xl flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </article>

                  <article className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sm:col-span-2 xl:col-span-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-600 text-sm font-medium">Delivered</p>
                        <p className="text-3xl font-semibold text-slate-900 mt-2">
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
                <RewardsCard deliveredOrderCount={deliveredOrderCount} promoConfig={promoConfig} />
              </>
            )}
          </div>
        )}

        {activeSection === 'orders' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">My Orders</h1>
              <p className="text-slate-600 mt-1">View and track all your orders.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <label htmlFor="order-search" className="block text-sm font-semibold text-slate-700 mb-2">
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
                  className="w-full border border-slate-200 bg-slate-50 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-slate-900 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {normalizedQuery && (
              <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 md:p-5">
                {searchedOrder ? (
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <p className="text-sm text-slate-700 font-medium">Order found</p>
                        <p className="text-lg font-semibold text-slate-900">{searchedOrder.orderNumber || searchedOrder._id}</p>
                        <p className="text-sm text-slate-700">
                          {new Date(searchedOrder.createdAt).toLocaleDateString()} • {getOrderItemsCount(searchedOrder)} items
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-sm font-semibold text-slate-900">රු{searchedOrder.total?.toLocaleString() || 0}</p>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusBadgeClass(searchedOrder.status)}`}>
                          {searchedOrder.status}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800 mb-2">Items</p>
                      {getOrderItems(searchedOrder).length > 0 ? (
                        <div className="space-y-2">
                          {getOrderItems(searchedOrder).map((item, index) => (
                            <div
                              key={`${searchedOrder._id || searchedOrder.orderNumber}-item-${index}`}
                              className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-3"
                            >
                              <div>
                                <p className="text-sm font-semibold text-slate-900">
                                  {getOrderItemDisplayName(item, index)}
                                </p>
                                <p className="text-xs text-slate-600">
                                  Qty: {item?.quantity || 0} {item?.size ? `• Size: ${item.size}` : ''}
                                </p>
                              </div>
                              <p className="text-sm font-semibold text-slate-900">
                                රු{Number((item?.price || 0) * (item?.quantity || 0)).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-600">No item details available for this order.</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm font-medium text-red-700">No order found for “{orderSearchQuery}”.</p>
                )}
              </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              {orders.length > 0 ? (
                displayedOrders.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-left">
                          <th className="py-3 pr-4 font-semibold text-slate-700">Order ID</th>
                          <th className="py-3 pr-4 font-semibold text-slate-700">Date</th>
                          <th className="py-3 pr-4 font-semibold text-slate-700">Items</th>
                          <th className="py-3 pr-4 font-semibold text-slate-700">Amount</th>
                          <th className="py-3 pr-4 font-semibold text-slate-700">Status</th>
                          <th className="py-3 pl-4 font-semibold text-slate-700"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayedOrders.map((order) => (
                          <tr key={order._id} className="border-b border-slate-100 last:border-b-0">
                            <td className="py-3 pr-4 font-semibold text-slate-900">{order.orderNumber || order._id}</td>
                            <td className="py-3 pr-4 text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td className="py-3 pr-4 text-slate-600">{getOrderItemsCount(order)}</td>
                            <td className="py-3 pr-4 font-medium text-slate-900">රු{order.total?.toLocaleString() || 0}</td>
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
                                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg whitespace-nowrap"
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
                    <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 pt-4 mt-4 gap-4">
                      <p className="text-sm text-slate-700 text-center sm:text-left">
                        Showing <span className="font-medium">{(currentPage - 1) * ordersPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * ordersPerPage, filteredOrders.length)}</span> of{' '}
                        <span className="font-medium">{filteredOrders.length}</span> results
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                                      ? 'bg-slate-900 text-white'
                                      : 'text-slate-700 hover:bg-slate-100'
                                  }`}
                                >
                                  {i + 1}
                                </button>
                              );
                            }
                            if (i + 1 === currentPage - 2 || i + 1 === currentPage + 2) {
                              return <span key={i} className="px-1 text-slate-400">...</span>;
                            }
                            return null;
                          })}
                        </div>

                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-slate-600 text-center py-12">No orders found for this Order ID.</p>
                )
              ) : (
                <p className="text-slate-600 text-center py-12">No orders yet. Ready to shop? Browse our store now.</p>
              )}
            </div>
          </div>
        )}

        {activeSection === 'profile' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">My Profile</h1>
              <p className="text-slate-600 mt-1">Manage your personal information.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm max-w-3xl">
              {isEditingProfile ? (
                <form onSubmit={handleProfileUpdate}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">First Name</label>
                      <input
                        type="text"
                        required
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Last Name</label>
                      <input
                        type="text"
                        required
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Email</label>
                      <input
                        type="email"
                        disabled
                        value={customer?.email || ''}
                        className="w-full border border-slate-200 bg-slate-50 text-slate-500 rounded-xl py-2 px-3 cursor-not-allowed"
                      />
                      <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Phone</label>
                      <input
                        type="tel"
                        required
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-200 flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
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
                      className="px-6 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">First Name</label>
                      <p className="text-lg font-semibold text-slate-900">{customer?.firstName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Last Name</label>
                      <p className="text-lg font-semibold text-slate-900">{customer?.lastName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Email</label>
                      <p className="text-lg font-semibold text-slate-900 break-all">{customer?.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Phone</label>
                      <p className="text-lg font-semibold text-slate-900">{customer?.phone}</p>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-200">
                    <button 
                      onClick={() => setIsEditingProfile(true)}
                      className="px-6 py-2.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-700 transition-colors"
                    >
                      Edit Profile
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerDashboard;

