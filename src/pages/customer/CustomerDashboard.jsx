import { useState } from 'react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useCustomerStore } from '../../context/store';
import { Menu, X, LayoutDashboard, ShoppingBag, MapPin, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { customer, logout } = useCustomerAuth();
  const { orders } = useCustomerStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-24 bottom-0 w-64 bg-white border-r border-gray-200 transition-all duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } z-40 md:translate-x-0 md:static md:top-auto`}
      >
        <nav className="p-6 space-y-2">
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
      <div className="flex-1 md:ml-0">
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

        <div className="pt-4 md:pt-0 p-4 md:p-8">
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

              {/* Stats Cards */}
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

              {/* Recent Orders */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h2>
                {orders.length > 0 ? (
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((order) => (
                      <div
                        key={order._id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {order.orderNumber}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            රු{order.total?.toLocaleString()}
                          </p>
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            order.status === 'delivered'
                              ? 'bg-green-100 text-green-700'
                              : order.status === 'shipped'
                              ? 'bg-blue-100 text-blue-700'
                              : order.status === 'processing'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-8">
                    No orders yet. Start shopping now!
                  </p>
                )}
              </div>
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
                {orders.length > 0 ? (
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <div
                        key={order._id}
                        className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {order.orderNumber}
                            </p>
                            <p className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString()} • {order.items?.length} items
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">
                              රු{order.total?.toLocaleString()}
                            </p>
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full inline-block ${
                              order.status === 'delivered'
                                ? 'bg-green-100 text-green-700'
                                : order.status === 'shipped'
                                ? 'bg-blue-100 text-blue-700'
                                : order.status === 'processing'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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

          {/* Addresses Section */}
          {activeSection === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">My Addresses</h1>
                  <p className="text-gray-600 mt-1">Manage your delivery addresses</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                  Add Address
                </button>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <p className="text-gray-600 text-center py-12">
                  No addresses saved yet. Add your first address to get started!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
