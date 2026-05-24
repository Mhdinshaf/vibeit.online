import { useState, useEffect } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Truck, CreditCard, DollarSign, AlertCircle, ChevronRight, Package, MapPin, User, Mail, Phone, Home, Shield, Loader2, CheckCircle } from 'lucide-react';
import { useCartStore } from '../../context/store';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { createOrder } from '../../services/api';
import { BANK_TRANSFER_DETAILS } from '../../constants/bankDetails';
import { getPromoConfig, loadPromoConfigFromServer, PROMO_CONFIG_EVENT, validatePromoCode } from '../../utils/promotions';
import toast from 'react-hot-toast';

const SRI_LANKA_DISTRICTS = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
  'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
  'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
  'Moneragala', 'Ratnapura', 'Kegalle'
];

// Helper for environment-aware logging
const devError = (...args) => {
  if (import.meta.env.DEV) {
  }
};

const CheckoutInput = ({ icon: Icon, label, required, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Icon className="w-4 h-4 text-slate-400" />
        </div>
      )}
      <input
        {...props}
        className={`w-full ${Icon ? 'pl-9' : 'px-3'} pr-3 py-2.5 bg-white border border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm text-slate-900 placeholder-slate-400`}
      />
    </div>
  </div>
);

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const { customer, isAuthenticated } = useCustomerAuth();
  
  // Calculate subtotal locally
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    postalCode: '',
    notes: '',
  });

  // Auto-populate form with customer data
  useEffect(() => {
    if (customer) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        email: customer.email || '',
        phone: customer.phone || '',
        city: '',
        district: '',
        postalCode: '',
        notes: '',
      });
    }
  }, [customer]);

  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [showNotes, setShowNotes] = useState(false);
  const [isOrderFinalizing, setIsOrderFinalizing] = useState(false);
  const [promoConfig, setPromoConfig] = useState(getPromoConfig());

  // Read promo applied in cart (from localStorage)
  const [appliedPromo, setAppliedPromo] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vibeit_cart_promo') || 'null'); } catch { return null; }
  });

  useEffect(() => {
    const handler = () => setPromoConfig(getPromoConfig());
    window.addEventListener(PROMO_CONFIG_EVENT, handler);
    loadPromoConfigFromServer().then(setPromoConfig).catch(() => {});
    return () => window.removeEventListener(PROMO_CONFIG_EVENT, handler);
  }, []);
  const freeDeliveryEnabled = promoConfig.freeDeliveryEnabled;
  const customerEmail = customer?.email?.toLowerCase();
  const localOrders = JSON.parse(localStorage.getItem('vibeit_orders_db') || '[]');

  // Re-validate promo on load to ensure it hasn't been used since applied to cart
  useEffect(() => {
    if (appliedPromo && customer) {
      const email = customer.email?.toLowerCase();
      const usedPromoCodes = localOrders
        .filter(o => 
          o.shippingAddress?.email?.toLowerCase() === email && 
          o.promoCode && 
          !['Cancelled', 'cancelled'].includes(o.status)
        )
        .map(o => o.promoCode);

      // deliveredOrderCount for this customer
      const deliveredCount = localOrders.filter(o =>
        o.shippingAddress?.email?.toLowerCase() === email &&
        ['Delivered', 'delivered'].includes(o.status)
      ).length;

      const promo = validatePromoCode(appliedPromo.promoCode, deliveredCount, promoConfig, usedPromoCodes, customer);
      if (!promo || promo.alreadyUsed) {
        localStorage.removeItem('vibeit_cart_promo');
        setAppliedPromo(null);
        toast.error(promo?.alreadyUsed 
          ? `The promo code ${appliedPromo.promoCode} has already been used and has been removed.`
          : 'Your promo code is no longer valid and has been removed.'
        );
      }
    }
  }, [appliedPromo, customer, promoConfig]);

  const baseShippingFee = subtotal >= 5000 ? 0 : 400;
  const shippingFee = freeDeliveryEnabled || appliedPromo?.discountType === 'freeDelivery' ? 0 : baseShippingFee;
  const discountAmount = appliedPromo?.discountType === 'percent'
    ? Math.round((subtotal * appliedPromo.discountValue) / 100)
    : 0;
  const total = subtotal + shippingFee - discountAmount;

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Mirror ProductCard/CartPage logic: check imageUrls (DB field) first, then images (virtual)
  const getImageUrl = (product) => {
    const arr = product?.imageUrls || product?.images || [];
    const first = Array.isArray(arr) ? arr[0] : arr;
    if (!first) return '/placeholder.jpg';
    if (typeof first === 'string') return first;
    if (first?.url) return first.url;
    return '/placeholder.jpg';
  };

  const { mutate: placeOrder, isPending } = useMutation({
    mutationFn: createOrder,
    onMutate: () => {
      setIsOrderFinalizing(true);
    },
    onSuccess: (data) => {
      // Open WhatsApp if URL provided
      if (data.whatsappUrl) {
        window.open(data.whatsappUrl, '_blank');
      }
      // Clear cart promo from localStorage after successful order
      localStorage.removeItem('vibeit_cart_promo');
      navigate(`/order-success/${data._id}`, { state: { order: data } });
      setTimeout(() => { clearCart(); }, 0);
    },
    onError: (error) => {
      setIsOrderFinalizing(false);
      const errorMsg = error.message || error.response?.data?.message || 'Failed to place order';
      devError('❌ Checkout error:', errorMsg);
      toast.error(errorMsg);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!form.email || !form.firstName || !form.lastName || !form.phone || !form.address || !form.city || !form.district) {
      toast.error('Please fill in all required fields');
      return;
    }

    const normalizedOrderItems = items
      .map((item) => {
        const productId =
          item?.product?._id ||
          item?.product?.id ||
          (typeof item?.product === 'string' ? item.product : '') ||
          item?.productId ||
          (typeof item?.key === 'string' ? item.key.split('-')[0] : '') ||
          item?._id;

        return {
          product: productId,
          productId,
          name: item?.product?.name || item?.name || item?.title || '',
          productName: item?.product?.name || item?.name || item?.title || '',
          quantity: Number(item?.quantity || 0),
          size: item?.size,
          price: Number(item?.price || 0),
        };
      })
      .filter((item) => Boolean(item.product) && item.quantity > 0);

    if (normalizedOrderItems.length === 0) {
      toast.error('No valid order items found. Please re-add your cart items.');
      return;
    }

    // Prepare order data
    const orderData = {
      customerId: customer?._id || null,
      items: normalizedOrderItems,
      orderItems: normalizedOrderItems,
      shippingAddress: {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        district: form.district,
        postalCode: form.postalCode,
      },
      paymentMethod,
      shippingFee,
      subtotal,
      discount: discountAmount,
      promoCode: appliedPromo?.promoCode || null,
      total,
      notes: form.notes,
    };

    placeOrder(orderData);
  };

  // Redirect if cart is empty
  if ((!items || items.length === 0) && !isPending && !isOrderFinalizing) {
    return <Navigate to="/shop" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-8 overflow-x-clip transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-sm mb-6 pb-4 border-b border-slate-200">
          <Link to="/cart" className="text-slate-500 hover:text-slate-900 transition-colors">Cart</Link>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <span className="text-slate-900 font-bold">Checkout</span>
        </nav>

        <h1 className="text-2xl font-bold text-slate-900 mb-8 uppercase tracking-wider">Secure Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 md:gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-7 space-y-6">
              {!isAuthenticated() && (
                <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 md:p-6">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-slate-700 dark:text-slate-300 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Have an account?</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">Log in to auto-fill your information and access your order history anytime.</p>
                      <button
                        type="button"
                        onClick={() => navigate('/auth/customer/login')}
                        className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        Sign in now →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {isAuthenticated() && (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-700/50 p-4 md:p-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Welcome, {customer?.firstName}!</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Your information is auto-filled. You can track this order in your dashboard after purchase.</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-md border border-slate-200 p-6 shadow-sm mb-6">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider">Contact Information</h2>
                </div>
                <CheckoutInput
                  icon={Mail}
                  label="Email Address"
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setField('email', e.target.value)}
                  placeholder="your@email.com"
                />
                <p className="text-xs text-slate-500 mt-2 ml-1">
                  We'll send order confirmation to this email
                </p>
              </div>

              <div className="bg-white rounded-md border border-slate-200 p-6 shadow-sm mb-6">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider">Shipping Address</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      District <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={form.district}
                      onChange={(e) => setField('district', e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm text-slate-900"
                    >
                      <option value="">Select District</option>
                      {SRI_LANKA_DISTRICTS.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <CheckoutInput
                      icon={User}
                      label="First Name"
                      required
                      type="text"
                      value={form.firstName}
                      onChange={(e) => setField('firstName', e.target.value)}
                      placeholder="John"
                    />
                    <CheckoutInput
                      label="Last Name"
                      required
                      type="text"
                      value={form.lastName}
                      onChange={(e) => setField('lastName', e.target.value)}
                      placeholder="Doe"
                    />
                  </div>

                  <CheckoutInput
                    icon={Phone}
                    label="Phone Number"
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setField('phone', e.target.value)}
                    placeholder="+94 71 234 5678"
                  />

                  <CheckoutInput
                    icon={Home}
                    label="Street Address"
                    required
                    type="text"
                    value={form.address}
                    onChange={(e) => setField('address', e.target.value)}
                    placeholder="123 Main Street"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <CheckoutInput
                      label="City"
                      required
                      type="text"
                      value={form.city}
                      onChange={(e) => setField('city', e.target.value)}
                      placeholder="Colombo"
                    />
                    <CheckoutInput
                      label="Postal Code"
                      type="text"
                      value={form.postalCode}
                      onChange={(e) => setField('postalCode', e.target.value)}
                      placeholder="10100"
                    />
                  </div>
                </div>
                {paymentMethod === 'Bank Transfer' && (
                  <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 p-4">
                    <p className="text-sm font-bold text-blue-900 mb-2">Bank details for transfer</p>
                    <p className="text-sm text-blue-800">
                      {BANK_TRANSFER_DETAILS.accountHolder}
                    </p>
                    <p className="text-sm text-blue-800">
                      Account: {BANK_TRANSFER_DETAILS.accountNumber}
                    </p>
                    <p className="text-sm text-blue-800">
                      Bank: {BANK_TRANSFER_DETAILS.bankName}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-md border border-slate-200 p-6 shadow-sm mb-6">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider">Shipping Method</h2>
                </div>
                <div className="border border-slate-300 rounded-md p-4 bg-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 text-sm">Standard Delivery</h3>
                      <p className="text-xs text-slate-600 mt-1">3-5 business days • Island wide</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">
                        {shippingFee === 0 ? 'FREE' : `Rs ${shippingFee}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-md border border-slate-200 p-6 shadow-sm mb-6">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider">Payment Method</h2>
                </div>
                <div className="space-y-3">
                  <label
                    className={`block border rounded-md p-4 cursor-pointer transition-colors ${
                      paymentMethod === 'Bank Transfer'
                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                        : 'border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Bank Transfer"
                        checked={paymentMethod === 'Bank Transfer'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 text-sm">Bank Transfer</h3>
                        <p className="text-xs text-slate-500 mt-1">Send slip to WhatsApp 0753979659</p>
                      </div>
                    </div>
                  </label>

                  <label
                    className={`block border rounded-md p-4 cursor-pointer transition-colors ${
                      paymentMethod === 'Cash on Delivery'
                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                        : 'border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Cash on Delivery"
                        checked={paymentMethod === 'Cash on Delivery'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 text-sm">Cash on Delivery</h3>
                        <p className="text-xs text-slate-500 mt-1">Pay when you receive</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="bg-white rounded-md border border-slate-200 p-6 shadow-sm mb-6">
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={showNotes}
                    onChange={(e) => setShowNotes(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <span className="font-bold text-sm text-slate-700">Add order notes (optional)</span>
                </label>

                {showNotes && (
                  <textarea
                    value={form.notes}
                    onChange={(e) => setField('notes', e.target.value)}
                    className="w-full mt-2 px-3 py-2 bg-white border border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm text-slate-900 placeholder-slate-400 resize-none"
                    rows="3"
                    placeholder="Any special instructions for your order..."
                  />
                )}
              </div>

              <div className="bg-slate-100 rounded-xl p-4 border border-slate-200">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-slate-700 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-600">
                    By placing this order, you agree to our Terms of Service and Privacy Policy. 
                    Your order will be processed and shipped within 1-2 business days.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3.5 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm uppercase tracking-wider"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Placing order...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Place order • Rs {total.toLocaleString()}
                  </>
                )}
              </button>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-8 bg-slate-50 rounded-md border border-slate-200 shadow-sm overflow-hidden p-6">
                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-4">
                  Order Summary
                </h2>

                {appliedPromo && (
                  <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2.5 mb-4">
                    <span className="text-emerald-600 text-lg">🎟️</span>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-emerald-800">{appliedPromo.promoCode} applied</p>
                      <p className="text-xs text-emerald-600">{appliedPromo.description}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.key} className="flex gap-4">
                      <div className="relative flex-shrink-0">
                        <img
                          src={getImageUrl(item.product)}
                          alt={item.product.name}
                          className="w-16 h-16 rounded-md object-contain bg-white border border-slate-200"
                          onError={(e) => { e.target.src = '/placeholder.jpg'; e.target.onerror = null; }}
                        />
                        <span className="absolute -top-2 -right-2 bg-slate-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-slate-50">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-slate-900 line-clamp-2">
                          {item.product.name}
                        </h3>
                        {item.size && (
                          <span className="text-xs text-slate-500 font-medium">
                            Size: {item.size}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900">
                          Rs {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-200 pt-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-bold text-slate-900">Rs {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Shipping</span>
                    <span className="font-bold">
                      {shippingFee === 0 ? (
                        <span className="text-blue-600 flex items-center gap-1">FREE</span>
                      ) : (
                        <span className="text-slate-900">Rs {shippingFee}</span>
                      )}
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-emerald-600">Discount ({appliedPromo?.promoCode})</span>
                      <span className="font-bold text-emerald-600">-Rs {discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t border-slate-200 pt-4 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-bold text-slate-900 uppercase">Total</span>
                      <span className="text-2xl font-bold text-slate-900">Rs {total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-200 pt-6">
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                    <Shield className="w-4 h-4 text-slate-400" />
                    <span>Secure Checkout • SSL Encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
