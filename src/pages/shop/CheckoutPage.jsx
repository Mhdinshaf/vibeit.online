import { useState, useEffect } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Truck, CreditCard, DollarSign, AlertCircle, ChevronRight, Package, MapPin, User, Mail, Phone, Home, Shield, Loader2, CheckCircle } from 'lucide-react';
import { useCartStore } from '../../context/store';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { createOrder } from '../../services/api';
import { BANK_TRANSFER_DETAILS } from '../../constants/bankDetails';
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
    console.error?.(...args);
  }
};

// Premium Input Component
const CheckoutInput = ({ icon: Icon, label, required, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-blue-500">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Icon className="w-5 h-5 text-gray-400" />
        </div>
      )}
      <input
        {...props}
        className={`w-full ${Icon ? 'pl-11' : 'px-4'} pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-0 transition-all duration-300 text-gray-900 placeholder-gray-400`}
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
      setForm((prev) => ({
        ...prev,
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        email: customer.email || '',
        phone: customer.phone || '',
      }));
    }
  }, [customer]);

  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [showNotes, setShowNotes] = useState(false);
  const [isOrderFinalizing, setIsOrderFinalizing] = useState(false);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Helper to get image URL
  const getImageUrl = (img) => {
    if (!img) return '/placeholder.jpg';
    if (typeof img === 'string') return img;
    if (img.url) return img.url;
    return '/placeholder.jpg';
  };

  const shippingFee = subtotal >= 5000 ? 0 : 400;
  const total = subtotal + shippingFee;

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
      // Navigate to success page with order data
      navigate(`/order-success/${data._id}`, { state: { order: data } });
      // Clear cart after navigation to avoid checkout empty-cart redirect race
      setTimeout(() => {
        clearCart();
      }, 0);
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
      // Send both keys for backend compatibility (`items` and `orderItems`)
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8 bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm">
          <Link to="/cart" className="text-gray-500 hover:text-blue-600 transition-colors">Cart</Link>
          <ChevronRight className="w-4 h-4 text-gray-300" />
          <span className="text-blue-600 font-semibold">Checkout</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Secure Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-7 space-y-6">
              {/* Login Option Banner */}
              {!isAuthenticated() && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-4 md:p-6">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">Have an account?</h3>
                      <p className="text-sm text-gray-600 mb-3">Log in to auto-fill your information and access your order history anytime.</p>
                      <button
                        type="button"
                        onClick={() => navigate('/auth/customer/login')}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        Sign in now →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Logged In Banner */}
              {isAuthenticated() && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-4 md:p-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Welcome, {customer?.firstName}!</h3>
                      <p className="text-sm text-gray-600">Your information is auto-filled. You can track this order in your dashboard after purchase.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Contact Information</h2>
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
                <p className="text-xs text-gray-500 mt-2 ml-1">
                  We'll send order confirmation to this email
                </p>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Shipping Address</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      District <span className="text-blue-500">*</span>
                    </label>
                    <select
                      required
                      value={form.district}
                      onChange={(e) => setField('district', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-0 transition-all duration-300 text-gray-900"
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
                  <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-sm font-semibold text-amber-800">Bank details for transfer</p>
                    <p className="text-sm text-amber-700 mt-2">
                      {BANK_TRANSFER_DETAILS.accountHolder}
                    </p>
                    <p className="text-sm text-amber-700">
                      Account: {BANK_TRANSFER_DETAILS.accountNumber}
                    </p>
                    <p className="text-sm text-amber-700">
                      Bank: {BANK_TRANSFER_DETAILS.bankName}
                    </p>
                  </div>
                )}
              </div>

              {/* Shipping Option */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Shipping Method</h2>
                </div>
                <div className="border-2 border-blue-500 rounded-xl p-4 bg-blue-50/50">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Truck className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">Standard Delivery</h3>
                      <p className="text-sm text-gray-600">3-5 business days • Island wide</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600 text-lg">
                        {shippingFee === 0 ? 'FREE' : `රු${shippingFee}`}
                      </p>
                      {shippingFee > 0 && (
                        <p className="text-xs text-gray-500">Free above රු5000</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
                </div>
                <div className="space-y-3">
                  {/* Bank Transfer */}
                  <label
                    className={`block border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                      paymentMethod === 'Bank Transfer'
                        ? 'border-blue-500 bg-blue-50/50 shadow-lg shadow-blue-100'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Bank Transfer"
                        checked={paymentMethod === 'Bank Transfer'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">Bank Transfer</h3>
                        <p className="text-sm text-gray-500">Send slip to WhatsApp 0753979659</p>
                      </div>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    className={`block border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                      paymentMethod === 'Cash on Delivery'
                        ? 'border-blue-500 bg-blue-50/50 shadow-lg shadow-blue-100'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Cash on Delivery"
                        checked={paymentMethod === 'Cash on Delivery'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">Cash on Delivery</h3>
                        <p className="text-sm text-gray-500">Pay when you receive</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showNotes}
                    onChange={(e) => setShowNotes(e.target.checked)}
                    className="w-5 h-5 rounded-lg text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="font-medium text-gray-700">Add order notes (optional)</span>
                </label>

                {showNotes && (
                  <textarea
                    value={form.notes}
                    onChange={(e) => setField('notes', e.target.value)}
                    className="w-full mt-4 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-0 transition-all duration-300 text-gray-900 placeholder-gray-400 resize-none"
                    rows="3"
                    placeholder="Any special instructions for your order..."
                  />
                )}
              </div>

              {/* Legal Text */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600">
                    By placing this order, you agree to our Terms of Service and Privacy Policy. 
                    Your order will be processed and shipped within 1-2 business days.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-4 rounded-xl hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-blue-200"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    PLACING ORDER...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    PLACE ORDER • රු{total.toLocaleString()}
                  </>
                )}
              </button>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-8 bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Order Summary
                  </h2>
                </div>

                <div className="p-6">
                  {/* Items List */}
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item.key} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="relative flex-shrink-0">
                          <img
                            src={getImageUrl(item.product.images?.[0])}
                            alt={item.product.name}
                            className="w-16 h-16 rounded-xl object-cover border border-gray-100"
                          />
                          <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                            {item.product.name}
                          </h3>
                          {item.size && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-lg font-medium">
                              Size: {item.size}
                            </span>
                          )}
                          <p className="text-sm font-bold text-blue-600 mt-1">
                            රු{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pricing */}
                  <div className="border-t border-gray-100 pt-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold text-gray-900">රු{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-semibold">
                        {shippingFee === 0 ? (
                          <span className="text-green-600 flex items-center gap-1">
                            <Truck className="w-4 h-4" />
                            FREE
                          </span>
                        ) : (
                          <span className="text-gray-900">රු{shippingFee}</span>
                        )}
                      </span>
                    </div>
                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex justify-between">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                          රු{total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Truck className="w-4 h-4 text-blue-600" />
                      <span><strong>Estimated:</strong> 3-5 business days</span>
                    </div>
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
