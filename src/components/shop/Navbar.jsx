import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Sparkles, Lock } from 'lucide-react';
import { useCartStore } from '../../context/store';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

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
              <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-200 group-hover:shadow-blue-300 transition-all duration-300 group-hover:scale-105">
                VB
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

              {/* User Icon - Desktop */}
              <button
                onClick={() => navigate('/admin/login')}
                className="hidden md:flex p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-300 text-gray-600 hover:text-blue-600"
                aria-label="Admin Login"
              >
                <User className="w-5 h-5" />
              </button>

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
              {/* Admin Access - Mobile */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/admin/login');
                }}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-all duration-300"
              >
                <Lock className="w-4 h-4" />
                <span>ADMIN LOGIN</span>
              </button>
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
