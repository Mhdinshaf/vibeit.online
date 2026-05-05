import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, LogOut, Settings, Sun, Moon } from 'lucide-react';
import { useCartStore } from '../../context/store';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useTheme } from '../../context/ThemeContext';
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
  const { theme, toggleTheme, isInitialized } = useTheme();

  // Track customer authentication state
  useEffect(() => {
    // No logging needed for production
  }, [customer]);

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
    { to: '/', label: 'HOME' },
    { to: '/shop', label: 'SHOP' },
    { to: '/about', label: 'ABOUT' },
    { to: '/contact', label: 'CONTACT' },
  ];

  if (!isInitialized) {
    return null;
  }

  return (
    <>
      <a 
        href="#main-content" 
        className="absolute -top-10 left-4 z-[9999] text-white bg-blue-600 px-4 py-2 rounded-lg font-semibold focus:top-4 transition-all duration-300 shadow-md"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-50 glass-effect transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 sm:h-[4.5rem] flex items-center justify-between gap-3">
            <NavLink to="/" className="flex items-center gap-3 min-w-0 shrink-0 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm flex items-center justify-center bg-slate-900 dark:bg-slate-800">
                <img
                  src={logo}
                  alt="VIBEIT logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="leading-none">
                <span className="block text-lg sm:text-xl font-semibold tracking-tight text-slate-900 dark:text-white" 
                >VIBEIT</span>
                <span className="block text-[10px] sm:text-[11px] mt-1 tracking-[0.2em] text-blue-600 dark:text-blue-400"
                >PREMIUM STORE</span>
              </div>
            </NavLink>

            <nav className="hidden md:flex items-center gap-1 rounded-full border px-2 py-1 shadow-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 transition-colors duration-300">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-4 lg:px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                      isActive
                        ? 'bg-slate-900 text-white dark:bg-blue-600 shadow-md'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-1 sm:gap-2">
              <form
                onSubmit={handleSearch}
                className={`flex items-center overflow-hidden rounded-xl border transition-all duration-300 bg-slate-50 dark:bg-slate-800/50 ${
                  searchOpen
                    ? 'w-40 xs:w-48 sm:w-56 px-2 sm:px-3 py-1.5 opacity-100 border-blue-500/50 dark:border-blue-400/50 ring-2 ring-blue-500/20 dark:ring-blue-400/20'
                    : 'w-0 border-transparent px-0 py-0 opacity-0 pointer-events-none'
                }`}
              >
                <Search className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full min-w-0 bg-transparent border-none outline-none px-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                  autoFocus={searchOpen}
                />
              </form>

              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={`p-2.5 rounded-xl transition-all duration-300 ${
                  searchOpen 
                    ? 'bg-slate-900 text-white dark:bg-blue-600 shadow-md' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <NavLink
                to="/cart"
                className="relative p-2.5 rounded-xl transition-all duration-300 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 text-xs font-semibold rounded-full text-white bg-blue-600 flex items-center justify-center shadow-sm">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </NavLink>

              <button
                onClick={toggleTheme}
                className="inline-flex p-2.5 rounded-xl transition-colors text-blue-600 dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                title={theme === 'dark' ? 'Light theme' : 'Dark theme'}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {customer ? (
                <div className="hidden md:block relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-white bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-sm hover:shadow-md"
                    aria-label="Customer Profile"
                  >
                    <div className="w-6 h-6 rounded-full text-white bg-blue-500/50 text-xs font-semibold flex items-center justify-center">
                      {customer.firstName?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">{customer.firstName}</span>
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 border rounded-xl shadow-xl py-1 z-50 overflow-hidden bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 transition-all duration-300">
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 transition-colors duration-300">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{customer.firstName} {customer.lastName}</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">{customer.email}</p>
                      </div>
                      <NavLink
                        to="/customer/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 transition-colors border-b border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Dashboard</span>
                      </NavLink>
                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 transition-colors text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-800"
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
                  className="hidden md:flex items-center gap-2 px-4 py-2.5 text-white bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-xl transition-all shadow-sm hover:shadow-md text-sm font-medium"
                  aria-label="Customer Login"
                >
                  <User className="w-4 h-4" />
                  Login
                </button>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 md:hidden rounded-xl transition-colors text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
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

      </header>

      <div
        className={`fixed inset-0 z-30 md:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="absolute inset-0 bg-slate-900/50 dark:bg-slate-950/70 backdrop-blur-sm"
          aria-label="Close mobile menu overlay"
        />
        <aside
          className={`absolute right-0 top-16 h-[calc(100vh-4rem)] w-[86vw] max-w-sm border-l border-slate-200 dark:border-slate-700 shadow-2xl transition-transform duration-300 overflow-y-auto bg-white dark:bg-slate-900 ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between md:hidden transition-colors duration-300">
            <span className="text-sm font-semibold tracking-wide text-slate-900 dark:text-white">MENU</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
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
                    isActive ? 'bg-slate-900 text-white dark:bg-blue-600' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 transition-colors duration-300">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
              </button>

              {customer ? (
                <>
                  <div className="px-4 pb-2 text-sm text-blue-600 dark:text-blue-400">
                    {customer.firstName} {customer.lastName}
                  </div>
                  <NavLink
                    to="/customer/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-slate-900 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Settings className="w-4 h-4" />
                    Dashboard
                  </NavLink>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800"
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
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-sm font-medium transition-colors shadow-sm hover:shadow-md"
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
