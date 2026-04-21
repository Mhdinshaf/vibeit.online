import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Lock, Minus, Plus, ArrowRight, Gift, ShoppingBag, Truck } from 'lucide-react';
import { useCartStore } from '../../context/store';
import toast from 'react-hot-toast';

const CartPage = () => {
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

  // Empty State
  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-100">
            <ShoppingBag className="w-16 h-16 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Your cart is empty
          </h1>
          <p className="text-gray-500 mb-8">
            Looks like you haven't added anything to your cart yet
          </p>
          <Link 
            to="/shop" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-blue-200"
          >
            <ShoppingCart className="w-5 h-5" />
            START SHOPPING
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Free Shipping Progress */}
        {freeShippingRemaining > 0 && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 mb-8 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Cart Items */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Shopping Cart
                <span className="text-blue-600 ml-2">({itemCount})</span>
              </h1>
              <button
                onClick={handleClearCart}
                className="text-sm text-gray-500 hover:text-red-600 font-medium transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <div 
                  key={item.key}
                  className="bg-white rounded-2xl border border-gray-100 p-4 md:p-5 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <Link
                      to={`/product/${item.product._id}`}
                      className="flex-shrink-0"
                    >
                      <img
                        src={getImageUrl(item.product.images?.[0])}
                        alt={item.product.name}
                        className="w-24 h-24 md:w-28 md:h-28 rounded-xl object-cover border border-gray-100"
                      />
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        {/* Left: Title, Size, Price */}
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/product/${item.product._id}`}
                            className="font-bold text-gray-900 hover:text-blue-600 line-clamp-2 transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            {item.product.category && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                                {item.product.category}
                              </span>
                            )}
                            {item.size && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-lg font-medium">
                                Size: {item.size}
                              </span>
                            )}
                          </div>
                          <p className="text-lg font-bold text-blue-600 mt-2">
                            රු{item.price.toLocaleString()}
                          </p>
                        </div>

                        {/* Right: Quantity & Subtotal */}
                        <div className="flex flex-col items-end gap-3">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                            <button
                              onClick={() =>
                                handleQuantityChange(item.key, item.quantity - 1, item.product.stockQuantity)
                              }
                              className="w-9 h-9 flex items-center justify-center bg-white rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                            >
                              <Minus className="w-4 h-4 text-gray-600" />
                            </button>
                            <span className="font-bold text-gray-900 w-10 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(item.key, item.quantity + 1, item.product.stockQuantity)
                              }
                              disabled={item.quantity >= item.product.stockQuantity}
                              className="w-9 h-9 flex items-center justify-center bg-white rounded-lg hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>

                          {/* Item Subtotal */}
                          <p className="font-bold text-gray-900 text-lg">
                            රු{(item.price * item.quantity).toLocaleString()}
                          </p>

                          {/* Remove Button */}
                          <button
                            onClick={() =>
                              handleRemoveItem(item.key, item.product.name)
                            }
                            className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-600 transition-colors"
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

            {/* Continue Shopping */}
            <div className="mt-6">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-8">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
                  <h2 className="text-xl font-bold text-white">Order Summary</h2>
                </div>

                <div className="p-6">
                  {/* Items summary */}
                  <div className="flex items-center justify-between text-gray-600 mb-4">
                    <span>{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
                  </div>

                  {/* Pricing Rows */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold text-gray-900">
                        රු{subtotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-semibold">
                        {shippingCost === 0 ? (
                          <span className="text-green-600 flex items-center gap-1">
                            <Truck className="w-4 h-4" />
                            FREE
                          </span>
                        ) : (
                          <span className="text-gray-900">රු{shippingCost.toLocaleString()}</span>
                        )}
                      </span>
                    </div>
                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                          රු{total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Promo Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter code"
                        className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-0 transition-all text-sm"
                      />
                      <button
                        onClick={() => toast('Promo codes coming soon!', { icon: '🎁' })}
                        className="px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                      >
                        <Gift className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Link 
                    to="/checkout" 
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-4 rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-blue-200 mb-4"
                  >
                    PROCEED TO CHECKOUT
                    <ArrowRight className="w-5 h-5" />
                  </Link>

                  {/* Security Badges */}
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Lock className="w-4 h-4 text-green-600" />
                    <span>Secure Checkout • SSL Encrypted</span>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 text-center">
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
