import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Lock, Minus, Plus, ArrowRight, Gift, ShoppingBag, Truck, CheckCircle, X } from 'lucide-react';
import { useCartStore } from '../../context/store';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useEffect, useState } from 'react';
import { getPromoConfig, loadPromoConfigFromServer, PROMO_CONFIG_EVENT, validatePromoCode } from '../../utils/promotions';
import toast from 'react-hot-toast';

const PROMO_STORAGE_KEY = 'vibeit_cart_promo';

const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, customer } = useCustomerAuth();
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const [promoInput, setPromoInput] = useState('');
  const [promoConfig, setPromoConfig] = useState(getPromoConfig());
  const [appliedPromo, setAppliedPromo] = useState(() => {
    try { return JSON.parse(localStorage.getItem(PROMO_STORAGE_KEY) || 'null'); } catch { return null; }
  });
  
  // Calculate values locally
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
      toast.success('Cart cleared');
    }
  };

  const handleRemoveItem = (key, productName) => {
    removeItem(key);
    toast.success(`${productName} removed from cart`);
  };

  const handleQuantityChange = (key, newQty, maxStock) => {
    if (newQty < 1) return;
    if (maxStock && newQty > maxStock) {
      toast.error(`Only ${maxStock} items available in stock`);
      return;
    }
    updateQuantity(key, newQty);
  };

  // Helper to get image URL
  const getImageUrl = (img) => {
    if (!img) return '/placeholder.jpg';
    if (typeof img === 'string') return img;
    if (img.url) return img.url;
    return '/placeholder.jpg';
  };

  // Count delivered orders for this customer (for promo validation)
  const customerEmail = customer?.email?.toLowerCase();
  const localOrders = JSON.parse(localStorage.getItem('vibeit_orders_db') || '[]');
  const deliveredOrderCount = localOrders.filter(o =>
    o.shippingAddress?.email?.toLowerCase() === customerEmail &&
    ['Delivered', 'delivered'].includes(o.status)
  ).length;

  useEffect(() => {
    const handler = () => setPromoConfig(getPromoConfig());
    window.addEventListener(PROMO_CONFIG_EVENT, handler);
    loadPromoConfigFromServer().then(setPromoConfig).catch(() => {});
    return () => window.removeEventListener(PROMO_CONFIG_EVENT, handler);
  }, []);

  const freeDeliveryEnabled = promoConfig.freeDeliveryEnabled;

  const applyPromoCode = () => {
    const code = promoInput.trim();
    if (!code) return;

    // Get codes already used in previous orders
    const usedPromoCodes = localOrders
      .filter(o => 
        o.shippingAddress?.email?.toLowerCase() === customerEmail && 
        o.promoCode && 
        !['Cancelled', 'cancelled'].includes(o.status)
      )
      .map(o => o.promoCode);

    const promo = validatePromoCode(code, deliveredOrderCount, promoConfig, usedPromoCodes, customer);
    
    if (promo) {
      if (promo.alreadyUsed) {
        toast.error(`The code ${promo.promoCode} has already been used by you. Each reward is single-use only.`);
        return;
      }
      setAppliedPromo(promo);
      localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(promo));
      setPromoInput('');
      toast.success(`✅ ${promo.description} applied!`);
    } else {
      toast.error('Invalid or unearned promo code. Check your Rewards in the dashboard.');
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoInput('');
    localStorage.removeItem(PROMO_STORAGE_KEY);
    toast.success('Promo code removed');
  };

  const baseShippingCost = subtotal >= 5000 ? 0 : 400;
  const shippingCost = freeDeliveryEnabled || appliedPromo?.discountType === 'freeDelivery' ? 0 : baseShippingCost;
  const discountAmount = appliedPromo?.discountType === 'percent'
    ? Math.round((subtotal * appliedPromo.discountValue) / 100)
    : 0;
  const total = subtotal + shippingCost - discountAmount;
  const freeShippingRemaining = subtotal >= 5000 ? 0 : 5000 - subtotal;

  const handleProceedToCheckout = () => {
    if (isAuthenticated()) {
      navigate('/checkout');
      return;
    }
    const cartSnapshot = { items, savedAt: new Date().toISOString(), redirectTo: '/checkout' };
    localStorage.setItem('vibeit-cart-checkout-snapshot', JSON.stringify(cartSnapshot));
    toast.error('Please login to complete your purchase.');
    navigate('/login', { state: { from: { pathname: '/checkout' } } });
  };

  // Empty State
  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-16">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-slate-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">
            Your cart is empty
          </h1>
          <p className="text-slate-500 text-sm mb-8">
            Looks like you haven't added anything to your cart yet
          </p>
          <Link 
            to="/shop" 
            className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            Start shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-8 overflow-x-clip transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {freeShippingRemaining > 0 && (
          <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-6 sm:mb-8 text-blue-900">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Truck className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">
                  Add Rs {freeShippingRemaining.toLocaleString()} more for FREE shipping!
                </p>
                <div className="w-full bg-blue-200 rounded-full h-1.5 mt-2">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((subtotal / 5000) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-5 sm:mb-6">
              <h1 className="text-2xl font-bold text-slate-900">
                Shopping Cart
                <span className="text-slate-500 font-normal ml-2 text-lg">({itemCount})</span>
              </h1>
              <button
                onClick={handleClearCart}
                className="text-sm text-slate-500 hover:text-red-600 font-semibold transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
              {items.map((item, index) => (
                <div 
                  key={item.key}
                  className={`p-4 md:p-5 ${index !== items.length - 1 ? 'border-b border-slate-100' : ''}`}
                >
                  <div className="flex flex-col xs:flex-row gap-4 sm:gap-6">
                    <Link
                      to={`/product/${item.product._id}`}
                      className="flex-shrink-0 self-start"
                    >
                      <img
                        src={getImageUrl(item.product.images?.[0])}
                        alt={item.product.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/product/${item.product._id}`}
                            className="font-bold text-slate-900 hover:text-blue-600 line-clamp-2 transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          <div className="flex items-center gap-2 mt-2">
                            {item.product.category && (
                              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-sm uppercase tracking-wider font-semibold">
                                {item.product.category}
                              </span>
                            )}
                            {item.size && (
                              <span className="text-xs text-slate-500 font-medium">
                                Size: {item.size}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-500 mt-2">
                            Rs {item.price.toLocaleString()} each
                          </p>
                        </div>

                        <div className="flex flex-col sm:items-end gap-3">
                          <p className="font-bold text-slate-900 text-lg hidden md:block">
                            Rs {(item.price * item.quantity).toLocaleString()}
                          </p>

                          <div className="flex items-center gap-4">
                            <div className="flex items-center border border-slate-300 rounded-md bg-white">
                              <button
                                onClick={() =>
                                  handleQuantityChange(item.key, item.quantity - 1, item.product.stockQuantity)
                                }
                                className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 transition-colors"
                              >
                                <Minus className="w-3 h-3 text-slate-600" />
                              </button>
                              <span className="font-semibold text-sm text-slate-900 w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(item.key, item.quantity + 1, item.product.stockQuantity)
                                }
                                disabled={item.quantity >= item.product.stockQuantity}
                                className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 transition-colors disabled:opacity-50"
                              >
                                <Plus className="w-3 h-3 text-slate-600" />
                              </button>
                            </div>

                            <button
                              onClick={() =>
                                handleRemoveItem(item.key, item.product.name)
                              }
                              className="text-sm font-semibold text-slate-400 hover:text-red-600 transition-colors underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold transition-colors"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Continue Shopping
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-8">
              <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
                <div className="border-b border-slate-100 px-6 py-4">
                  <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider">Order Summary</h2>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between text-slate-500 text-sm mb-4">
                    <span>{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
                  </div>

                  <div className="space-y-3 mb-5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 text-sm">Subtotal</span>
                      <span className="font-semibold text-slate-900">Rs {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 text-sm">Shipping</span>
                      <span className="font-semibold text-sm">
                        {shippingCost === 0 ? (
                          <span className="text-blue-600 flex items-center gap-1">
                            <Truck className="w-4 h-4" />
                            FREE
                          </span>
                        ) : (
                          <span className="text-slate-900">Rs {shippingCost.toLocaleString()}</span>
                        )}
                      </span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-emerald-600 text-sm">Discount ({appliedPromo?.promoCode})</span>
                        <span className="font-semibold text-emerald-600">-Rs {discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="border-t border-slate-100 pt-4 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-slate-900">Total</span>
                        <span className="text-2xl font-bold text-slate-900">Rs {total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div className="mb-5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      🎟️ Promo Code
                    </label>
                    {appliedPromo ? (
                      <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-emerald-800">{appliedPromo.promoCode}</p>
                            <p className="text-xs text-emerald-600">{appliedPromo.description}</p>
                          </div>
                        </div>
                        <button onClick={removePromo} className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={promoInput}
                          onChange={e => setPromoInput(e.target.value.toUpperCase())}
                          placeholder="Enter code (e.g. VIBE10)"
                          onKeyDown={e => e.key === 'Enter' && applyPromoCode()}
                          className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm text-slate-900"
                        />
                        <button
                          onClick={applyPromoCode}
                          className="w-full sm:w-auto px-4 py-2 bg-slate-900 text-white font-bold text-sm rounded-md hover:bg-slate-700 transition-colors uppercase tracking-wider"
                        >
                          Apply
                        </button>
                      </div>
                    )}
                    {freeDeliveryEnabled && (
                      <p className="text-xs text-emerald-600 mt-1.5">🎉 Free delivery is active on all orders!</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleProceedToCheckout}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3.5 rounded-md hover:bg-blue-700 transition-colors mb-4"
                  >
                    Proceed to checkout
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span>Secure Checkout • SSL Encrypted</span>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500 text-center">
                    We accept Bank Transfer and Cash on Delivery
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
