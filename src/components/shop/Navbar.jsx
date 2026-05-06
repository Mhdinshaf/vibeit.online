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
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const { customer, logout } = useCustomerAuth();

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



  return (
    <>
      <a 
        href="#main-content" 
        className="absolute -top-10 left-4 z-[9999] text-white bg-blue-600 px-4 py-2 rounded-md font-bold focus:top-4 transition-all duration-300 shadow-sm"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 sm:h-[4.5rem] flex items-center justify-between gap-3">
            <NavLink to="/" className="flex items-center gap-3 min-w-0 shrink-0 group">
              <div className="w-10 h-10 overflow-hidden flex items-center justify-center">
                <img
                  src={logo}
                  alt="VIBEIT logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="leading-none hidden sm:block">
                <span className="block text-xl font-bold tracking-tight text-blue-600">
                  VIBEIT
                </span>
                <span className="block text-[10px] mt-0.5 tracking-[0.1em] font-bold text-slate-500">
                  STORE
                </span>
              </div>
            </NavLink>

            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `text-sm font-bold transition-colors duration-200 ${
                      isActive
                        ? 'text-blue-600'
                        : 'text-slate-600 hover:text-blue-600'
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
                className={`flex items-center overflow-hidden rounded-md border transition-all duration-300 bg-slate-50 ${
                  searchOpen
                    ? 'w-48 sm:w-64 px-3 py-2 opacity-100 border-blue-500'
                    : 'w-0 border-transparent px-0 py-0 opacity-0 pointer-events-none'
                }`}
              >
                <Search className="w-4 h-4 shrink-0 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full min-w-0 bg-transparent border-none outline-none px-2 text-sm text-slate-900 placeholder-slate-400 font-medium"
                  autoFocus={searchOpen}
                />
              </form>

              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 transition-colors text-slate-600 hover:text-blue-600"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <NavLink
                to="/cart"
                className="relative p-2 transition-colors text-slate-600 hover:text-blue-600"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] text-[10px] font-bold rounded-full text-white bg-blue-600 flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </NavLink>

              {customer ? (
                <div className="hidden md:block relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-slate-700 hover:text-blue-600 transition-colors"
                    aria-label="Customer Profile"
                  >
                    <User className="w-5 h-5" />
                    <span className="text-sm font-bold">{customer.firstName}</span>
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 border rounded-md shadow-lg py-1 z-50 overflow-hidden bg-white border-slate-200 transition-all duration-300">
                      <div className="px-4 py-3 border-b border-slate-100 transition-colors duration-300">
                        <p className="text-sm font-bold text-slate-900">{customer.firstName} {customer.lastName}</p>
                        <p className="text-xs text-blue-600 font-medium">{customer.email}</p>
                      </div>
                      <NavLink
                        to="/customer/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 transition-colors border-b border-slate-100 text-slate-700 font-semibold hover:bg-slate-50"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Dashboard</span>
                      </NavLink>
                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 transition-colors text-red-600 font-semibold hover:bg-slate-50"
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
                  className="hidden md:flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors text-sm font-bold uppercase tracking-wider"
                  aria-label="Customer Login"
                >
                  <User className="w-4 h-4" />
                  Sign In
                </button>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 md:hidden rounded-md transition-colors text-slate-600 hover:bg-slate-100"
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
        className={`fixed inset-0 z-[60] md:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          aria-label="Close mobile menu overlay"
        />
        <aside
          className={`absolute right-0 top-0 h-full w-[86vw] max-w-sm border-l border-slate-200 shadow-2xl transition-transform duration-300 overflow-y-auto bg-white ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="px-4 py-4 border-b border-slate-100 flex items-center justify-between md:hidden transition-colors duration-300">
            <span className="text-sm font-bold tracking-wider text-slate-900 uppercase">MENU</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-md text-slate-900 hover:bg-slate-100"
              aria-label="Close mobile menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="p-4 space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-md text-sm font-bold transition-colors uppercase tracking-wider ${
                    isActive ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <div className="pt-4 mt-4 border-t border-slate-100 transition-colors duration-300">

              {customer ? (
                <div className="space-y-1">
                  <div className="px-4 py-3 mb-2 bg-slate-50 rounded-md border border-slate-100">
                    <p className="text-sm font-bold text-slate-900">{customer.firstName} {customer.lastName}</p>
                    <p className="text-xs text-blue-600 font-medium">{customer.email}</p>
                  </div>
                  <NavLink
                    to="/customer/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-bold transition-colors text-slate-700 hover:bg-slate-50"
                  >
                    <Settings className="w-4 h-4" />
                    Dashboard
                  </NavLink>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-bold transition-colors text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/auth/customer/login');
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-md text-sm font-bold transition-colors bg-blue-600 text-white hover:bg-blue-700 uppercase tracking-wider"
                >
                  <User className="w-4 h-4" />
                  Sign In / Register
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
