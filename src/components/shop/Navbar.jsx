import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, LogOut, Settings, Sun, Moon } from 'lucide-react';
import { useCartStore } from '../../context/store';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import logo from '../../assets/favicon.jpeg';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const { customer, logout } = useCustomerAuth();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem('vibeit-theme', theme);
    } catch {
      // ignore localStorage write errors
    }
  }, [theme]);

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

      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 sm:h-[4.5rem] flex items-center justify-between gap-3">
            <NavLink to="/" className="flex items-center gap-3 min-w-0 shrink-0 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm flex items-center justify-center">
                <img
                  src={logo}
                  alt="VIBEIT logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="leading-none">
                <span className="block text-lg sm:text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">VIBEIT</span>
                <span className="block text-[10px] sm:text-[11px] mt-1 tracking-[0.2em] text-slate-500 dark:text-slate-400">PREMIUM STORE</span>
              </div>
            </NavLink>

            <nav className="hidden md:flex items-center gap-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 shadow-sm">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-4 lg:px-5 py-2 text-sm font-medium rounded-full transition-colors duration-300 ${
                      isActive
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
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
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <NavLink
                to="/cart"
                className="relative p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-300 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 text-xs font-semibold rounded-full bg-slate-900 text-white flex items-center justify-center shadow-sm">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </NavLink>

              <button
                onClick={() => {
                  setTheme(theme === 'dark' ? 'light' : 'dark');
                  try {
                    localStorage.setItem('vibeit-theme-manual', 'true');
                  } catch {
                    // ignore localStorage write errors
                  }
                }}
                className="inline-flex p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-700 dark:text-slate-200"
                aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                title={theme === 'dark' ? 'Light theme' : 'Dark theme'}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {customer ? (
                <div className="hidden md:block relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    aria-label="Customer Profile"
                  >
                    <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-semibold flex items-center justify-center">
                      {customer.firstName?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">{customer.firstName}</span>
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-1 z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{customer.firstName} {customer.lastName}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{customer.email}</p>
                      </div>
                      <NavLink
                        to="/customer/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-700"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Dashboard</span>
                      </NavLink>
                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 transition-colors"
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
                className="p-2.5 md:hidden hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-700 dark:text-slate-200"
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
          <div className="border-t border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products..."
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-slate-900 dark:focus:border-slate-500 transition-colors text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
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
          className={`absolute right-0 top-0 h-full w-[86vw] max-w-sm bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 shadow-xl transition-transform duration-300 ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="h-16 px-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <span className="text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-200">MENU</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
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
                    isActive ? 'bg-slate-900 text-white' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-700">
              <button
                onClick={() => {
                  setTheme(theme === 'dark' ? 'light' : 'dark');
                  try {
                    localStorage.setItem('vibeit-theme-manual', 'true');
                  } catch {
                    // ignore localStorage write errors
                  }
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
              </button>

              {customer ? (
                <>
                  <div className="px-4 pb-2 text-sm text-slate-500 dark:text-slate-400">
                    {customer.firstName} {customer.lastName}
                  </div>
                  <NavLink
                    to="/customer/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Dashboard
                  </NavLink>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 transition-colors"
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
