import { Link } from 'react-router-dom';
import { MessageCircle, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import logo from '../../assets/favicon.jpeg';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="bg-slate-900 text-white py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">Need help with your order?</h3>
            <p className="mt-2 text-slate-300">Our support team is ready on WhatsApp and email.</p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-slate-900 px-6 py-3.5 font-medium hover:bg-slate-100 transition-colors"
          >
            Contact us
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="bg-white text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="lg:col-span-1">
              <Link to="/" className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-900 ring-1 ring-slate-200">
                  <img src={logo} alt="VIBEIT logo" className="w-full h-full object-cover" />
                </div>
                <span className="text-xl font-semibold tracking-tight text-slate-900">VIBEIT</span>
              </Link>
              <p className="leading-relaxed mb-5">
                The Vibe of Online Shopping. Premium quality products delivered to your doorstep across Sri Lanka.
              </p>
              <p className="text-sm text-slate-500">Sri Lanka • Island-wide delivery</p>
            </div>

            <div>
              <h4 className="text-slate-900 font-semibold mb-4">Explore</h4>
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
                      className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-slate-900 font-semibold mb-4">Support</h4>
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
                      className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-slate-900 font-semibold mb-4">Contact</h4>
              <ul className="space-y-4">
                <li>
                  <a
                    href="mailto:vibeit@gmail.com"
                    className="flex items-center gap-3 text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-slate-700" />
                    </div>
                    <span>vibeit@gmail.com</span>
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+94753979659"
                    className="flex items-center gap-3 text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Phone className="w-4 h-4 text-slate-700" />
                    </div>
                    <span>+94 75 397 9659</span>
                  </a>
                </li>
                <li>
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-slate-700" />
                    </div>
                    <span>Colombo, Sri Lanka</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-sm text-slate-500">
              &copy; {currentYear} VibeIt.lk. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
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
        className="fixed bottom-5 right-5 bg-slate-900 hover:bg-slate-700 text-white p-3.5 rounded-2xl shadow-lg transition-colors z-50"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-5 h-5" />
      </a>
    </footer>
  );
};

export default Footer;
