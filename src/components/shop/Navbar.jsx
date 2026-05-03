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

  // Track customer authentication state
  useEffect(() => {
    // No logging needed for production
  }, [customer]);

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
    { to: '/', label: 'HOME' },
    { to: '/shop', label: 'SHOP' },
    { to: '/about', label: 'ABOUT' },
    { to: '/contact', label: 'CONTACT' },
  ];

  return (
    <>
      <a 
        href="#main-content" 
        className="absolute -top-10 left-4 z-[9999] text-white px-4 py-2 rounded focus:top-4 transition-all duration-300 font-semibold"
        style={{ backgroundColor: '#1E466B' }}
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-50 border-b" 
        style={{ borderColor: '#67BAF4', backgroundColor: '#fff' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 sm:h-[4.5rem] flex items-center justify-between gap-3">
            <NavLink to="/" className="flex items-center gap-3 min-w-0 shrink-0 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden ring-1 shadow-sm flex items-center justify-center"
                style={{ backgroundColor: '#1E466B', borderColor: '#67BAF4' }}>
                <img
                  src={logo}
                  alt="VIBEIT logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="leading-none">
                <span className="block text-lg sm:text-xl font-semibold tracking-tight" 
                  style={{ color: '#0D0D0D' }}>VIBEIT</span>
                <span className="block text-[10px] sm:text-[11px] mt-1 tracking-[0.2em]"
                  style={{ color: '#1E466B' }}>PREMIUM STORE</span>
              </div>
            </NavLink>

            <nav className="hidden md:flex items-center gap-1 rounded-full border px-2 py-1 shadow-sm"
              style={{ borderColor: '#67BAF4', backgroundColor: '#fff' }}>
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-4 lg:px-5 py-2 text-sm font-medium rounded-full transition-colors duration-300 ${
                      isActive
                        ? 'text-white'
                        : 'hover:text-white'
                    }`
                  }
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? '#1E466B' : 'transparent',
                    color: isActive ? '#fff' : '#0D0D0D'
                  })}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-1 sm:gap-2">
              <form
                onSubmit={handleSearch}
                className={`flex items-center overflow-hidden rounded-xl border transition-all duration-300 ${
                  searchOpen
                    ? 'w-40 xs:w-48 sm:w-56 px-2 sm:px-3 py-1.5 opacity-100'
                    : 'w-0 border-transparent px-0 py-0 opacity-0 pointer-events-none'
                }`}
                style={{
                  backgroundColor: '#FAFAFA',
                  borderColor: searchOpen ? '#67BAF4' : 'transparent'
                }}
              >
                <Search className="w-4 h-4 shrink-0" style={{ color: '#1E466B' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full min-w-0 bg-transparent border-none outline-none px-2 text-sm placeholder-opacity-70"
                  style={{
                    color: '#0D0D0D',
                    backgroundColor: '#FAFAFA'
                  }}
                  autoFocus={searchOpen}
                />
              </form>

              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={`p-2.5 rounded-xl transition-all duration-300 ${
                  searchOpen 
                    ? 'text-white'
                    : ''
                }`}
                style={{
                  backgroundColor: searchOpen ? '#1E466B' : 'transparent',
                  color: searchOpen ? '#fff' : '#0D0D0D'
                }}
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <NavLink
                to="/cart"
                className="relative p-2.5 rounded-xl transition-all duration-300"
                style={{
                  color: '#0D0D0D'
                }}
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 text-xs font-semibold rounded-full text-white flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: '#1E466B' }}>
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
                className="inline-flex p-2.5 rounded-xl transition-colors"
                style={{ color: '#1E466B' }}
                aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                title={theme === 'dark' ? 'Light theme' : 'Dark theme'}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {customer ? (
                <div className="hidden md:block relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-white transition-colors"
                    style={{ backgroundColor: '#1E466B' }}
                    aria-label="Customer Profile"
                  >
                    <div className="w-6 h-6 rounded-full text-white text-xs font-semibold flex items-center justify-center"
                      style={{ backgroundColor: '#67BAF4' }}>
                      {customer.firstName?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">{customer.firstName}</span>
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 border rounded-xl shadow-lg py-1 z-50 overflow-hidden"
                      style={{ 
                        backgroundColor: '#fff',
                        borderColor: '#67BAF4'
                      }}>
                      <div className="px-4 py-3 border-b"
                        style={{ borderColor: '#67BAF4' }}>
                        <p className="text-sm font-semibold" style={{ color: '#0D0D0D' }}>{customer.firstName} {customer.lastName}</p>
                        <p className="text-xs" style={{ color: '#1E466B' }}>{customer.email}</p>
                      </div>
                      <NavLink
                        to="/customer/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 transition-colors border-b"
                        style={{ 
                          color: '#0D0D0D',
                          borderColor: '#67BAF4'
                        }}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Dashboard</span>
                      </NavLink>
                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 transition-colors"
                        style={{ color: '#d32f2f' }}
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
                  className="hidden md:flex items-center gap-2 px-4 py-2.5 text-white rounded-xl transition-colors text-sm font-medium"
                  style={{ backgroundColor: '#1E466B' }}
                  aria-label="Customer Login"
                >
                  <User className="w-4 h-4" />
                  Login
                </button>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 md:hidden rounded-xl transition-colors"
                style={{ color: '#0D0D0D' }}
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
          className="absolute inset-0 backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(13, 13, 13, 0.45)' }}
          aria-label="Close mobile menu overlay"
        />
        <aside
          className={`absolute right-0 top-16 h-[calc(100vh-4rem)] w-[86vw] max-w-sm border-l shadow-xl transition-transform duration-300 overflow-y-auto ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ 
            backgroundColor: '#fff',
            borderColor: '#67BAF4'
          }}
        >
          <div className="px-4 py-3 border-b flex items-center justify-between md:hidden"
            style={{ borderColor: '#67BAF4' }}>
            <span className="text-sm font-semibold tracking-wide" style={{ color: '#0D0D0D' }}>MENU</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg"
              style={{ color: '#0D0D0D' }}
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
                    isActive ? 'text-white' : ''
                  }`
                }
                style={({ isActive }) => ({
                  backgroundColor: isActive ? '#1E466B' : 'transparent',
                  color: isActive ? '#fff' : '#0D0D0D'
                })}
              >
                {link.label}
              </NavLink>
            ))}

            <div className="pt-3 mt-3 border-t"
              style={{ borderColor: '#67BAF4' }}>
              <button
                onClick={() => {
                  setTheme(theme === 'dark' ? 'light' : 'dark');
                  try {
                    localStorage.setItem('vibeit-theme-manual', 'true');
                  } catch {
                    // ignore localStorage write errors
                  }
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                style={{ color: '#0D0D0D' }}
                aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
              </button>

              {customer ? (
                <>
                  <div className="px-4 pb-2 text-sm"
                    style={{ color: '#1E466B' }}>
                    {customer.firstName} {customer.lastName}
                  </div>
                  <NavLink
                    to="/customer/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                    style={{ color: '#0D0D0D' }}
                  >
                    <Settings className="w-4 h-4" />
                    Dashboard
                  </NavLink>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                    style={{ color: '#d32f2f' }}
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
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white text-sm font-medium transition-colors"
                  style={{ backgroundColor: '#1E466B' }}
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
