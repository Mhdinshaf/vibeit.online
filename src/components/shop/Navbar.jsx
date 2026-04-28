import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, LogOut, Settings } from 'lucide-react';
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

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      return;
    }

    document.body.style.overflow = '';
  }, [mobileMenuOpen]);

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
      <a 
        href="#main-content" 
        className="absolute -top-10 left-4 z-[9999] bg-blue-600 text-white px-4 py-2 rounded focus:top-4 transition-all duration-300 font-semibold"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 sm:h-[4.5rem] flex items-center justify-between gap-3">
            <NavLink to="/" className="flex items-center gap-3 min-w-0 shrink-0 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden bg-slate-900 ring-1 ring-slate-200 shadow-sm flex items-center justify-center">
                <img
                  src={logo}
                  alt="VIBEIT logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="leading-none">
                <span className="block text-lg sm:text-xl font-semibold tracking-tight text-slate-900">VIBEIT</span>
                <span className="block text-[10px] sm:text-[11px] mt-1 tracking-[0.2em] text-slate-500">PREMIUM STORE</span>
              </div>
            </NavLink>

            <nav className="hidden md:flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1 shadow-sm">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-4 lg:px-5 py-2 text-sm font-medium rounded-full transition-colors duration-300 ${
                      isActive
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={`p-2.5 rounded-xl transition-all duration-300 ${
                  searchOpen 
                    ? 'bg-slate-900 text-white' 
                    : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <NavLink
                to="/cart"
                className="relative p-2.5 hover:bg-slate-100 rounded-xl transition-all duration-300 text-slate-600 hover:text-slate-900"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 text-xs font-semibold rounded-full bg-slate-900 text-white flex items-center justify-center shadow-sm">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </NavLink>

              {customer ? (
                <div className="hidden md:block relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors"
                    aria-label="Customer Profile"
                  >
                    <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-semibold flex items-center justify-center">
                      {customer.firstName?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">{customer.firstName}</span>
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-900">{customer.firstName} {customer.lastName}</p>
                        <p className="text-xs text-slate-500 truncate">{customer.email}</p>
                      </div>
                      <NavLink
                        to="/customer/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Dashboard</span>
                      </NavLink>
                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors"
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
                  className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-700 transition-colors text-sm font-medium"
                  aria-label="Customer Login"
                >
                  <User className="w-4 h-4" />
                  Login
                </button>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 md:hidden hover:bg-slate-100 rounded-xl transition-colors text-slate-700"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-slate-200/80 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products..."
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 transition-colors"
                    autoFocus
                  />
                </div>
                <button type="submit" className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-700 transition-colors">
                  Search
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm"
          aria-label="Close mobile menu overlay"
        />
        <aside
          className={`absolute right-0 top-0 h-full w-[86vw] max-w-sm bg-white border-l border-slate-200 shadow-xl transition-transform duration-300 ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="h-16 px-4 border-b border-slate-100 flex items-center justify-between">
            <span className="text-sm font-semibold tracking-wide text-slate-700">MENU</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-700"
              aria-label="Close mobile menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="p-4 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <div className="pt-3 mt-3 border-t border-slate-100">
              {customer ? (
                <>
                  <div className="px-4 pb-2 text-sm text-slate-500">
                    {customer.firstName} {customer.lastName}
                  </div>
                  <NavLink
                    to="/customer/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Dashboard
                  </NavLink>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/auth/customer/login');
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Customer Login
                </button>
              )}
            </div>
          </nav>
        </aside>
      </div>
    </>
  );
};

export default Navbar;
