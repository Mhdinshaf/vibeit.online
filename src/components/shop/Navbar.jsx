import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Sparkles, LogOut, Settings } from 'lucide-react';
import { useCartStore } from '../../context/store';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import logo from '../../assets/favicon.jpeg';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const { customer, logout } = useCustomerAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { to: '/shop', label: 'SHOP' },
    { to: '/about', label: 'ABOUT' },
    { to: '/contact', label: 'CONTACT' },
  ];

  return (
    <>
      {/* Skip to main content link (accessibility) */}
      <a 
        href="#main-content" 
        className="absolute -top-10 left-4 z-[9999] bg-blue-600 text-white px-4 py-2 rounded focus:top-4 transition-all duration-300 font-semibold"
      >
        Skip to main content
      </a>

      {/* Premium Announcement Bar */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white py-2.5 text-center text-sm font-medium">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>Free Gifts on Orders Above රු5000</span>
          <Sparkles className="w-4 h-4" />
        </div>
      </div>

      {/* Main Header - Glass Effect */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-3">
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl overflow-hidden shadow-lg shadow-blue-200 transition-all duration-300 group-hover:scale-105 group-hover:shadow-blue-300 bg-slate-900">
                <img
                  src={logo}
                  alt="VIBEIT logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-blue-900 tracking-tight">
                  VIBEIT
                </span>
                <span className="text-[10px] text-gray-500 -mt-1 tracking-wider">.lk</span>
              </div>
            </NavLink>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `relative px-5 py-2 font-semibold text-sm tracking-wide transition-all duration-300 rounded-full ${
                      isActive
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-2">
              {/* Search Icon */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={`p-2.5 rounded-xl transition-all duration-300 ${
                  searchOpen 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'hover:bg-gray-100 text-gray-600 hover:text-blue-600'
                }`}
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart Icon with Badge */}
              <NavLink
                to="/cart"
                className="relative p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-300 text-gray-600 hover:text-blue-600"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-bold min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center shadow-lg shadow-blue-200 animate-pulse">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </NavLink>

              {/* Customer Profile - Desktop */}
              {customer ? (
                <div className="hidden md:block relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-50 hover:from-blue-100 hover:to-blue-100 rounded-xl transition-all duration-300 text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-300"
                    aria-label="Customer Profile"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                      {customer.firstName?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold">{customer.firstName}</span>
                  </button>

                  {/* Profile Dropdown */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-50 overflow-hidden">
                      <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
                        <p className="text-sm font-semibold text-gray-900">{customer.firstName} {customer.lastName}</p>
                        <p className="text-xs text-gray-600">{customer.email}</p>
                      </div>
                      <NavLink
                        to="/customer/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all border-b border-gray-100"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Dashboard</span>
                      </NavLink>
                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate('/auth/customer/login')}
                  className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-300 font-semibold text-sm shadow-lg shadow-blue-200"
                  aria-label="Customer Login"
                >
                  <User className="w-4 h-4" />
                  Login
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 md:hidden hover:bg-gray-100 rounded-xl transition-all duration-300 text-gray-600"
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Premium Search Bar */}
        {searchOpen && (
          <div className="border-t border-gray-100 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <form onSubmit={handleSearch} className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products..."
                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-all duration-300"
                    autoFocus
                  />
                </div>
                <button type="submit" className="btn-primary !py-3 !px-6">
                  Search
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <nav className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-600 border-l-4 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              
              {/* Customer Auth - Mobile */}
              {customer ? (
                <>
                  <div className="border-t border-gray-200 my-2 pt-2">
                    <div className="px-4 py-2 text-sm text-gray-600 font-medium">
                      {customer.firstName} {customer.lastName}
                    </div>
                    <NavLink
                      to="/customer/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-all duration-300"
                    >
                      <Settings className="w-4 h-4" />
                      Dashboard
                    </NavLink>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/auth/customer/login');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300"
                >
                  <User className="w-4 h-4" />
                  Customer Login
                </button>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
