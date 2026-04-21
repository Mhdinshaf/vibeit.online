import { Link } from 'react-router-dom';
import { MessageCircle, Mail, Phone, MapPin, Heart, ArrowRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto">
      {/* Premium CTA Band */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white py-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-bold mb-2">
              Need Help with Your Order?
            </h3>
            <p className="text-blue-100">We're here to assist you 24/7</p>
          </div>
          <Link 
            to="/contact" 
            className="group flex items-center gap-2 bg-white text-blue-600 font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            CONTACT US
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-slate-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <Link to="/" className="flex items-center gap-3 mb-6 group">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300">
                  VB
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-white">VIBEIT</span>
                  <span className="text-[10px] text-gray-500 -mt-0.5 tracking-wider">.lk</span>
                </div>
              </Link>
              <p className="text-gray-400 leading-relaxed mb-6">
                The Vibe of Online Shopping. Premium quality products delivered to your doorstep across Sri Lanka.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                <span>in Sri Lanka</span>
              </div>
            </div>

            {/* Information Column */}
            <div>
              <h4 className="text-white font-bold mb-6 text-lg">Information</h4>
              <ul className="space-y-4">
                {[
                  { to: '/about', label: 'About Us' },
                  { to: '/contact', label: 'Contact Us' },
                  { to: '/privacy', label: 'Privacy Policy' },
                  { to: '/terms', label: 'Terms & Conditions' },
                ].map((link) => (
                  <li key={link.to}>
                    <Link 
                      to={link.to} 
                      className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <h4 className="text-white font-bold mb-6 text-lg">Support</h4>
              <ul className="space-y-4">
                {[
                  { to: '/shipping', label: 'Shipping Info' },
                  { to: '/returns', label: 'Returns & Exchanges' },
                  { to: '/faq', label: 'FAQs' },
                  { to: '/shop', label: 'Shop Now' },
                ].map((link) => (
                  <li key={link.to}>
                    <Link 
                      to={link.to} 
                      className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Column */}
            <div>
              <h4 className="text-white font-bold mb-6 text-lg">Contact</h4>
              <ul className="space-y-4">
                <li>
                  <a
                    href="mailto:vibeit@gmail.com"
                    className="flex items-center gap-3 text-gray-400 hover:text-blue-400 transition-colors duration-300 group"
                  >
                    <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-blue-600/20 transition-colors duration-300">
                      <Mail className="w-5 h-5 text-blue-400" />
                    </div>
                    <span>vibeit@gmail.com</span>
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+94753979659"
                    className="flex items-center gap-3 text-gray-400 hover:text-blue-400 transition-colors duration-300 group"
                  >
                    <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-blue-600/20 transition-colors duration-300">
                      <Phone className="w-5 h-5 text-blue-400" />
                    </div>
                    <span>+94 75 397 9659</span>
                  </a>
                </li>
                <li>
                  <div className="flex items-center gap-3 text-gray-400">
                    <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-blue-400" />
                    </div>
                    <span>Colombo, Sri Lanka</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              &copy; {currentYear} VibeIt.lk. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-xs text-gray-600">Secure Payments</span>
              <span className="text-xs text-gray-600">Quality Products</span>
              <span className="text-xs text-gray-600">Fast Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Floating WhatsApp Button */}
      <a
        href="https://wa.me/94753979659"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white p-4 rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-110 z-50"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </footer>
  );
};

export default Footer;
