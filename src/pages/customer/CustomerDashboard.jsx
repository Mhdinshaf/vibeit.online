import { useState, useEffect } from 'react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useCustomerStore } from '../../context/store';
import { Menu, X, LayoutDashboard, ShoppingBag, User, LogOut, Loader2, AlertCircle, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getOrders, getProductById } from '../../services/api';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { customer, logout } = useCustomerAuth();
  const { orders, setOrders } = useCustomerStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [orderError, setOrderError] = useState(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [resolvedItemNames, setResolvedItemNames] = useState({});

  // Load orders when dashboard mounts
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoadingOrders(true);
        setOrderError(null);
        const response = await getOrders({ page: 1, limit: 500 });
        if (response?.orders) {
          setOrders(response.orders);
        }
      } catch (error) {
        console.error('Failed to load orders:', error);
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
  const displayedOrders = normalizedQuery
    ? orders.filter((order) =>
        [order.orderNumber, order._id]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalizedQuery))
      )
    : orders;

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
    if (normalizedStatus === 'delivered') return 'bg-green-100 text-green-700';
    if (normalizedStatus === 'shipped') return 'bg-blue-100 text-blue-700';
    if (normalizedStatus === 'processing') return 'bg-orange-100 text-orange-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-gray-50 md:flex">
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-24 bottom-0 w-64 bg-white border-r border-gray-200 transition-all duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } z-40 md:sticky md:top-24 md:bottom-auto md:h-[calc(100vh-6rem)] md:translate-x-0 md:shrink-0`}
      >
        <nav className="p-6 space-y-2 h-full overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeSection === item.id
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}

          <hr className="my-4" />

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-all duration-300"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Top Bar */}
        <div className="fixed top-20 left-0 right-0 bg-white border-b border-gray-200 px-4 md:px-8 py-4 z-30 md:hidden">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        <div className="pt-28 md:pt-8 p-4 md:p-8 pb-8">
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome back, {customer?.firstName}! 👋
                </h1>
                <p className="text-gray-600">
                  Here's your dashboard overview
                </p>
              </div>

              {/* Error Alert */}
              {orderError && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-700">{orderError}</p>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {isLoadingOrders && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
                    <p className="text-gray-600">Loading your orders...</p>
                  </div>
                </div>
              )}

              {/* Stats Cards */}
              {!isLoadingOrders && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {orders.length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Active Orders</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {orders.filter((o) => ['pending', 'confirmed', 'processing', 'shipped'].includes(o.status)).length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Delivered</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {orders.filter((o) => o.status === 'delivered').length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>
              </div>

                </>
              )}
            </div>
          )}

          {/* Orders Section */}
          {activeSection === 'orders' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                <p className="text-gray-600 mt-1">View and track all your orders</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <label htmlFor="order-search" className="block text-sm font-semibold text-gray-700 mb-2">
                  Search by Order ID
                </label>
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="order-search"
                    type="text"
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    placeholder="Enter Order ID (e.g., VIB-1001)"
                    className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {normalizedQuery && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 md:p-5">
                  {searchedOrder ? (
                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                          <p className="text-sm text-blue-700 font-medium">Order found</p>
                          <p className="text-lg font-bold text-blue-900">{searchedOrder.orderNumber || searchedOrder._id}</p>
                          <p className="text-sm text-blue-800">
                            {new Date(searchedOrder.createdAt).toLocaleDateString()} • {getOrderItemsCount(searchedOrder)} items
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="text-sm font-semibold text-blue-900">රු{searchedOrder.total?.toLocaleString() || 0}</p>
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusBadgeClass(searchedOrder.status)}`}>
                            {searchedOrder.status}
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-blue-800 mb-2">Items</p>
                        {getOrderItems(searchedOrder).length > 0 ? (
                          <div className="space-y-2">
                            {getOrderItems(searchedOrder).map((item, index) => (
                              <div
                                key={`${searchedOrder._id || searchedOrder.orderNumber}-item-${index}`}
                                className="flex items-center justify-between bg-white border border-blue-100 rounded-lg p-3"
                              >
                                <div>
                                  <p className="text-sm font-semibold text-gray-900">
                                    {getOrderItemDisplayName(item, index)}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    Qty: {item?.quantity || 0} {item?.size ? `• Size: ${item.size}` : ''}
                                  </p>
                                </div>
                                <p className="text-sm font-semibold text-gray-900">
                                  රු{Number((item?.price || 0) * (item?.quantity || 0)).toLocaleString()}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-600">No item details available for this order.</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-red-700">
                      No order found for “{orderSearchQuery}”.
                    </p>
                  )}
                </div>
              )}

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                {orders.length > 0 ? (
                  displayedOrders.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200 text-left">
                            <th className="py-3 pr-4 font-semibold text-gray-700">Order ID</th>
                            <th className="py-3 pr-4 font-semibold text-gray-700">Date</th>
                            <th className="py-3 pr-4 font-semibold text-gray-700">Items</th>
                            <th className="py-3 pr-4 font-semibold text-gray-700">Amount</th>
                            <th className="py-3 pr-4 font-semibold text-gray-700">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {displayedOrders.map((order) => (
                            <tr key={order._id} className="border-b border-gray-100 last:border-b-0">
                              <td className="py-3 pr-4 font-semibold text-gray-900">{order.orderNumber || order._id}</td>
                              <td className="py-3 pr-4 text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                              <td className="py-3 pr-4 text-gray-600">{getOrderItemsCount(order)}</td>
                              <td className="py-3 pr-4 font-medium text-gray-900">රු{order.total?.toLocaleString() || 0}</td>
                              <td className="py-3 pr-4">
                                <span className={`text-xs font-semibold px-3 py-1 rounded-full inline-block ${getStatusBadgeClass(order.status)}`}>
                                  {order.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-600 text-center py-12">
                      No orders found for this Order ID.
                    </p>
                  )
                ) : (
                  <p className="text-gray-600 text-center py-12">
                    No orders yet. Ready to shop? Browse our store now!
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Profile Section */}
          {activeSection === 'profile' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-600 mt-1">Manage your personal information</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm max-w-2xl">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      First Name
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {customer?.firstName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Last Name
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {customer?.lastName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Email
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {customer?.email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Phone
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {customer?.phone}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
