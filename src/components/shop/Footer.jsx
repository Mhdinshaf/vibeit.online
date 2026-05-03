import { Link } from 'react-router-dom';
import { MessageCircle, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import logo from '../../assets/favicon.jpeg';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t" style={{ borderColor: '#67BAF4', backgroundColor: '#FAFAFA' }}>
      <div className="text-white py-10 sm:py-12"
        style={{ backgroundColor: '#1E466B' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">Need help with your order?</h3>
            <p className="mt-2" style={{ color: '#67BAF4' }}>Our support team is ready on WhatsApp and email.</p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-xl text-white px-6 py-3.5 font-medium transition-colors"
            style={{ backgroundColor: '#67BAF4', color: '#1E466B' }}
          >
            Contact us
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div style={{ backgroundColor: '#FAFAFA', color: '#0D0D0D' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="lg:col-span-1">
              <Link to="/" className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl overflow-hidden ring-1"
                  style={{ backgroundColor: '#1E466B', borderColor: '#67BAF4' }}>
                  <img src={logo} alt="VIBEIT logo" className="w-full h-full object-cover" />
                </div>
                <span className="text-xl font-semibold tracking-tight" style={{ color: '#0D0D0D' }}>VIBEIT</span>
              </Link>
              <p className="leading-relaxed mb-5" style={{ color: '#0D0D0D' }}>
                The Vibe of Online Shopping. Premium quality products delivered to your doorstep across Sri Lanka.
              </p>
              <p className="text-sm" style={{ color: '#1E466B' }}>Sri Lanka • Island-wide delivery</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4" style={{ color: '#0D0D0D' }}>Explore</h4>
              <ul className="space-y-3">
                {[
                  { to: '/shop', label: 'Shop' },
                  { to: '/about', label: 'About Us' },
                  { to: '/contact', label: 'Contact Us' },
                  { to: '/cart', label: 'Cart' },
                ].map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="inline-flex items-center gap-2 transition-colors"
                      style={{ color: '#0D0D0D' }}
                    >
                      <ArrowRight className="w-4 h-4" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4" style={{ color: '#0D0D0D' }}>Support</h4>
              <ul className="space-y-3">
                {[
                  { to: '/shipping', label: 'Shipping Info' },
                  { to: '/returns', label: 'Returns & Exchanges' },
                  { to: '/faq', label: 'FAQs' },
                  { to: '/shop', label: 'Shop Now' },
                ].map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="inline-flex items-center gap-2 transition-colors"
                      style={{ color: '#0D0D0D' }}
                    >
                      <ArrowRight className="w-4 h-4" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4" style={{ color: '#0D0D0D' }}>Contact</h4>
              <ul className="space-y-4">
                <li>
                  <a
                    href="mailto:vibeit@gmail.com"
                    className="flex items-center gap-3 transition-colors"
                    style={{ color: '#0D0D0D' }}
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: '#67BAF4', color: '#1E466B' }}>
                      <Mail className="w-4 h-4" />
                    </div>
                    <span>vibeit@gmail.com</span>
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+94753979659"
                    className="flex items-center gap-3 transition-colors"
                    style={{ color: '#0D0D0D' }}
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: '#67BAF4', color: '#1E466B' }}>
                      <Phone className="w-4 h-4" />
                    </div>
                    <span>+94 75 397 9659</span>
                  </a>
                </li>
                <li>
                  <div className="flex items-center gap-3" style={{ color: '#0D0D0D' }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: '#67BAF4', color: '#1E466B' }}>
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span>Colombo, Sri Lanka</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3"
            style={{ borderColor: '#67BAF4' }}>
            <p className="text-sm" style={{ color: '#1E466B' }}>
              &copy; {currentYear} VibeIt.lk. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs" style={{ color: '#1E466B' }}>
              <span>Secure Payments</span>
              <span>Quality Products</span>
              <span>Fast Delivery</span>
            </div>
          </div>
        </div>
      </div>

      <a
        href="https://wa.me/94753979659"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 text-white p-3.5 rounded-2xl shadow-lg transition-colors z-50 hover:scale-110"
        style={{ backgroundColor: '#1E466B' }}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-5 h-5" />
      </a>
    </footer>
  );
};

export default Footer;
