import { Link } from 'react-router-dom';
import { MessageCircle, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto">
      {/* CTA Band */}
      <div className="bg-blue-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <h3 className="text-xl md:text-2xl font-bold">
            Need Help with Sizing or Delivery?
          </h3>
          <Link to="/contact" className="btn-outline !border-white !text-white hover:!bg-white hover:!text-blue-600">
            CONTACT US
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Column */}
            <div>
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  VB
                </div>
                <span className="text-xl font-bold text-white">VIBEIT.lk</span>
              </Link>
              <p className="text-sm text-gray-400 leading-relaxed">
                The Vibe of Online Shopping
              </p>
            </div>

            {/* Information Column */}
            <div>
              <h4 className="text-white font-bold mb-4">Information</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-sm hover:text-blue-400 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-sm hover:text-blue-400 transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-sm hover:text-blue-400 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-sm hover:text-blue-400 transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/shipping" className="text-sm hover:text-blue-400 transition-colors">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link to="/returns" className="text-sm hover:text-blue-400 transition-colors">
                    Returns & Exchanges
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Column */}
            <div>
              <h4 className="text-white font-bold mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-0.5 text-blue-400 flex-shrink-0" />
                  <a
                    href="mailto:vibeit@gmail.com"
                    className="text-sm hover:text-blue-400 transition-colors"
                  >
                    vibeit@gmail.com
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <Phone className="w-4 h-4 mt-0.5 text-blue-400 flex-shrink-0" />
                  <a
                    href="tel:+94718684580"
                    className="text-sm hover:text-blue-400 transition-colors"
                  >
                    +94 71 868 4580
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-blue-400 flex-shrink-0" />
                  <span className="text-sm">Colombo, Sri Lanka</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-500">
              &copy; {currentYear} VibeIt.lk. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/94718684580"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 z-50"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </footer>
  );
};

export default Footer;
