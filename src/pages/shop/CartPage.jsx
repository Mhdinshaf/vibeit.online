import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Lock, Minus, Plus, ArrowRight, Gift, ShoppingBag, Truck } from 'lucide-react';
import { useCartStore } from '../../context/store';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import toast from 'react-hot-toast';

const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useCustomerAuth();
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  
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

  const shippingCost = subtotal >= 5000 ? 0 : 400;
  const total = subtotal + shippingCost;
  const freeShippingRemaining = subtotal >= 5000 ? 0 : 5000 - subtotal;

  const handleProceedToCheckout = () => {
    if (isAuthenticated()) {
      navigate('/checkout');
      return;
    }

    const cartSnapshot = {
      items,
      savedAt: new Date().toISOString(),
      redirectTo: '/checkout',
    };
    localStorage.setItem('vibeit-cart-checkout-snapshot', JSON.stringify(cartSnapshot));
    toast.error('Please login to complete your purchase.');
    navigate('/login', { state: { from: { pathname: '/checkout' } } });
  };

  // Empty State
  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-16">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-28 h-28 bg-white border border-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <ShoppingBag className="w-14 h-14 text-slate-500" />
          </div>
          <h1 className="text-3xl font-semibold text-slate-900 mb-3">
            Your cart is empty
          </h1>
          <p className="text-slate-600 mb-8">
            Looks like you haven't added anything to your cart yet
          </p>
          <Link 
            to="/shop" 
            className="inline-flex items-center gap-2 bg-slate-900 text-white font-medium px-7 py-3.5 rounded-xl hover:bg-slate-700 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            Start shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-8 overflow-x-clip">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {freeShippingRemaining > 0 && (
          <div className="bg-slate-900 rounded-2xl p-4 mb-6 sm:mb-8 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">
                  Add රු{freeShippingRemaining.toLocaleString()} more for FREE shipping!
                </p>
                <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((subtotal / 5000) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-5 sm:mb-6">
              <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
                Shopping Cart
                <span className="text-slate-500 ml-2">({itemCount})</span>
              </h1>
              <button
                onClick={handleClearCart}
                className="text-sm text-slate-500 hover:text-red-600 font-medium transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <div 
                  key={item.key}
                  className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      to={`/product/${item.product._id}`}
                      className="flex-shrink-0 self-start"
                    >
                      <img
                        src={getImageUrl(item.product.images?.[0])}
                        alt={item.product.name}
                        className="w-24 h-24 md:w-28 md:h-28 rounded-xl object-cover border border-slate-200"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/product/${item.product._id}`}
                            className="font-semibold text-slate-900 hover:text-slate-700 line-clamp-2 transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            {item.product.category && (
                              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">
                                {item.product.category}
                              </span>
                            )}
                            {item.size && (
                              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-lg font-medium">
                                Size: {item.size}
                              </span>
                            )}
                          </div>
                          <p className="text-lg font-semibold text-slate-900 mt-2">
                            රු{item.price.toLocaleString()}
                          </p>
                        </div>

                        <div className="flex flex-col sm:items-end gap-3">
                          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
                            <button
                              onClick={() =>
                                handleQuantityChange(item.key, item.quantity - 1, item.product.stockQuantity)
                              }
                              className="w-9 h-9 flex items-center justify-center bg-white rounded-lg hover:bg-slate-50 transition-colors"
                            >
                              <Minus className="w-4 h-4 text-slate-600" />
                            </button>
                            <span className="font-semibold text-slate-900 w-10 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(item.key, item.quantity + 1, item.product.stockQuantity)
                              }
                              disabled={item.quantity >= item.product.stockQuantity}
                              className="w-9 h-9 flex items-center justify-center bg-white rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="w-4 h-4 text-slate-600" />
                            </button>
                          </div>

                          <p className="font-semibold text-slate-900 text-lg">
                            රු{(item.price * item.quantity).toLocaleString()}
                          </p>

                          <button
                            onClick={() =>
                              handleRemoveItem(item.key, item.product.name)
                            }
                            className="flex items-center gap-1 text-sm text-slate-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </button>
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
                className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 font-medium transition-colors"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Continue Shopping
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-8">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-900 px-6 py-4">
                  <h2 className="text-xl font-semibold text-white">Order Summary</h2>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between text-slate-600 mb-4">
                    <span>{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Subtotal</span>
                      <span className="font-semibold text-slate-900">
                        රු{subtotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Shipping</span>
                      <span className="font-semibold">
                        {shippingCost === 0 ? (
                          <span className="text-emerald-600 flex items-center gap-1">
                            <Truck className="w-4 h-4" />
                            FREE
                          </span>
                        ) : (
                          <span className="text-slate-900">රු{shippingCost.toLocaleString()}</span>
                        )}
                      </span>
                    </div>
                    <div className="border-t border-slate-100 pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-slate-900">Total</span>
                        <span className="text-2xl font-semibold text-slate-900">
                          රු{total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Promo Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter code"
                        className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-900 focus:bg-white transition-colors text-sm"
                      />
                      <button
                        onClick={() => toast('Promo codes coming soon!', { icon: '🎁' })}
                        className="px-4 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
                      >
                        <Gift className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleProceedToCheckout}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-medium py-4 rounded-xl hover:bg-slate-700 transition-colors mb-4"
                  >
                    Proceed to checkout
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                    <Lock className="w-4 h-4 text-emerald-600" />
                    <span>Secure Checkout • SSL Encrypted</span>
                  </div>
                </div>

                <div className="bg-slate-50 px-6 py-4 border-t border-slate-100">
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
