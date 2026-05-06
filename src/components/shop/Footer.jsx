import { Link } from 'react-router-dom';
import { MessageCircle, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import logo from '../../assets/favicon.jpeg';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="bg-blue-600 text-white py-12 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight">Need help with your order?</h3>
            <p className="mt-2 text-blue-100 font-medium">Our support team is ready on WhatsApp and email.</p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-white hover:bg-slate-50 text-blue-600 px-8 py-3 font-bold transition-all shadow-sm hover:shadow-md uppercase tracking-wider text-sm"
          >
            Contact us
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="lg:col-span-1">
              <Link to="/" className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-md overflow-hidden ring-1 bg-blue-600 ring-slate-200 flex items-center justify-center">
                  <img src={logo} alt="VIBEIT logo" className="w-full h-full object-cover" />
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900">VIBEIT</span>
              </Link>
              <p className="leading-relaxed mb-5 text-slate-600 font-medium">
                The Vibe of Online Shopping. Premium quality products delivered to your doorstep across Sri Lanka.
              </p>
              <p className="text-sm font-bold text-blue-600">Sri Lanka • Island-wide delivery</p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4 text-lg">Explore</h4>
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
                      className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-semibold"
                    >
                      <ArrowRight className="w-4 h-4" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4 text-lg">Support</h4>
              <ul className="space-y-3">
                {[
                  { to: '/shop', label: 'Shipping Info' },
                  { to: '/contact', label: 'Returns & Exchanges' },
                  { to: '/contact', label: 'FAQs' },
                  { to: '/shop', label: 'Shop Now' },
                ].map((link, idx) => (
                  <li key={`${link.to}-${idx}`}>
                    <Link
                      to={link.to}
                      className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-semibold"
                    >
                      <ArrowRight className="w-4 h-4" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4 text-lg">Contact</h4>
              <ul className="space-y-4">
                <li>
                  <a
                    href="mailto:vibeit@gmail.com"
                    className="flex items-center gap-3 text-slate-600 hover:text-blue-600 transition-colors font-semibold"
                  >
                    <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <span>vibeit@gmail.com</span>
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+94753979659"
                    className="flex items-center gap-3 text-slate-600 hover:text-blue-600 transition-colors font-semibold"
                  >
                    <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-blue-600" />
                    </div>
                    <span>+94 75 397 9659</span>
                  </a>
                </li>
                <li>
                  <div className="flex items-center gap-3 text-slate-600 font-semibold">
                    <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <span>Colombo, Sri Lanka</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-600 font-bold">
              &copy; {currentYear} VibeIt.lk. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm font-bold text-slate-600">
              <span className="hover:text-blue-600 transition-colors cursor-pointer">Secure Payments</span>
              <span className="hover:text-blue-600 transition-colors cursor-pointer">Quality Products</span>
              <span className="hover:text-blue-600 transition-colors cursor-pointer">Fast Delivery</span>
            </div>
          </div>
        </div>
      </div>

      <a
        href="https://wa.me/94753979659"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-50 transform hover:scale-110"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </footer>
  );
};

export default Footer;
