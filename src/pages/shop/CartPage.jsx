import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Lock, Minus, Plus } from 'lucide-react';
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

  const handleQuantityChange = (key, newQty) => {
    if (newQty < 1) return;
    updateQuantity(key, newQty);
  };

  const shippingCost = subtotal >= 5000 ? 0 : 400;
  const total = subtotal + shippingCost;

  // Empty State
  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-16">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-32 h-32 bg-blue-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Your cart is empty
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Looks like you have not added anything yet
          </p>
          <Link to="/shop" className="btn-primary">
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Cart Items */}
          <div className="lg:col-span-7">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Cart ({itemCount})
            </h1>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.key}>
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 md:p-6">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <Link
                        to={`/product/${item.product._id}`}
                        className="flex-shrink-0"
                      >
                        <img
                          src={item.product.images?.[0] || '/placeholder.jpg'}
                          alt={item.product.name}
                          className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover"
                        />
                      </Link>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          {/* Left: Title, Size, Price */}
                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/product/${item.product._id}`}
                              className="font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2"
                            >
                              {item.product.name}
                            </Link>
                            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                              {item.product.subcategory && (
                                <span>{item.product.subcategory}</span>
                              )}
                              {item.size && (
                                <>
                                  <span>•</span>
                                  <span>Size: {item.size}</span>
                                </>
                              )}
                            </div>
                            <p className="text-blue-600 font-bold mt-2">
                              රු{item.price.toLocaleString()} each
                            </p>
                          </div>

                          {/* Right: Quantity & Subtotal */}
                          <div className="flex flex-col items-end gap-3">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  handleQuantityChange(item.key, item.quantity - 1)
                                }
                                className="w-8 h-8 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded hover:border-blue-600 dark:hover:border-blue-600 transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="font-bold text-gray-900 dark:text-white w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(item.key, item.quantity + 1)
                                }
                                className="w-8 h-8 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded hover:border-blue-600 dark:hover:border-blue-600 transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Item Subtotal */}
                            <p className="font-bold text-gray-900 dark:text-white">
                              රු{(item.price * item.quantity).toLocaleString()}
                            </p>

                            {/* Remove Button */}
                            <button
                              onClick={() =>
                                handleRemoveItem(item.key, item.product.name)
                              }
                              className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  {index < items.length - 1 && (
                    <div className="h-px bg-gray-200 dark:bg-gray-700 my-4" />
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
              <button
                onClick={handleClearCart}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                Clear Cart
              </button>
              <Link
                to="/shop"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Order Summary
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </p>

                {/* Pricing Rows */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                    <span>Subtotal</span>
                    <span className="font-medium">
                      රු{subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                    <span>Shipping</span>
                    <span className="font-medium">
                      {shippingCost === 0 ? (
                        <span className="text-green-600 dark:text-green-400">
                          Free
                        </span>
                      ) : (
                        `රු${shippingCost.toLocaleString()}`
                      )}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        Estimated Total
                      </span>
                      <span className="text-2xl font-bold text-blue-600">
                        රු{total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="form-input flex-1 !py-2"
                    />
                    <button
                      onClick={() => toast('Promo codes coming soon!', { icon: '🎁' })}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      APPLY
                    </button>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link to="/checkout" className="btn-primary w-full block text-center mb-6">
                  PROCEED TO CHECKOUT
                </Link>

                {/* Security Badges */}
                <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Lock className="w-4 h-4 text-green-600" />
                    <span>Secure Checkout</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Bank Transfer and Cash on Delivery accepted
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
