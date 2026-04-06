import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle, MessageCircle, CreditCard } from 'lucide-react';

const OrderSuccess = () => {
  const { id } = useParams();
  const location = useLocation();
  const order = location.state?.order;

  // If no order data, show generic success
  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-16">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Thank you for your order. We'll process it shortly.
          </p>
          <Link to="/shop" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const isBankTransfer = order.paymentMethod === 'Bank Transfer';
  const orderNumber = order.orderNumber || order._id;

  const whatsappMessage = encodeURIComponent(
    `Hi VibeIt! I've placed an order.\n\nOrder Number: ${orderNumber}\nTotal: රු${order.total.toLocaleString()}\nPayment Method: ${order.paymentMethod}`
  );
  const whatsappUrl = `https://wa.me/94718684580?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Order Placed Successfully!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
            Thank you for your order
          </p>
          <p className="text-lg font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 inline-block px-6 py-2 rounded-lg">
            {orderNumber}
          </p>
        </div>

        {/* Bank Transfer Instructions */}
        {isBankTransfer && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-lg">
                  Bank Transfer Instructions
                </h3>
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <p>✓ Transfer the exact amount: <strong className="text-blue-600 text-base">රු{order.total.toLocaleString()}</strong></p>
                  <p>✓ Use your order number as reference: <strong className="font-mono">{orderNumber}</strong></p>
                  <p>✓ Send payment slip photo to WhatsApp: <strong>071 868 4580</strong></p>
                </div>
              </div>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/40 rounded-lg p-3 text-sm text-blue-800 dark:text-blue-300">
              ⚠️ Your order will be processed after we receive payment confirmation
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Order Summary
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Product
                  </th>
                  <th className="text-center py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Quantity
                  </th>
                  <th className="text-center py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Size
                  </th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 dark:border-gray-700/50 last:border-0"
                  >
                    <td className="py-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.product?.name || 'Product'}
                      </p>
                    </td>
                    <td className="text-center py-3 text-sm text-gray-700 dark:text-gray-300">
                      {item.quantity}
                    </td>
                    <td className="text-center py-3 text-sm text-gray-500 dark:text-gray-400">
                      {item.size || '-'}
                    </td>
                    <td className="text-right py-3 text-sm font-medium text-gray-900 dark:text-white">
                      රු{((item.price || 0) * (item.quantity || 0)).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Subtotal</span>
              <span>රු{order.subtotal?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Shipping</span>
              <span>
                {order.shippingFee === 0 ? (
                  <span className="text-green-600 font-medium">Free</span>
                ) : (
                  `රු${order.shippingFee?.toLocaleString()}`
                )}
              </span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
              <span>Total</span>
              <span className="text-blue-600">රු{order.total?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Shipping Address
          </h2>
          <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <p className="font-medium text-base">
              {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
            </p>
            <p>{order.shippingAddress?.address}</p>
            <p>
              {order.shippingAddress?.city}, {order.shippingAddress?.district}
              {order.shippingAddress?.postalCode && ` ${order.shippingAddress.postalCode}`}
            </p>
            <p className="pt-2">{order.shippingAddress?.phone}</p>
            <p>{order.shippingAddress?.email}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider px-6 py-4 rounded-lg transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Send WhatsApp Message
          </a>
          <Link
            to="/shop"
            className="flex-1 btn-outline text-center"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Email Confirmation Note */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center border border-blue-100 dark:border-blue-800">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            📧 Order confirmation details will be sent to <strong className="text-blue-600">{order.shippingAddress?.email}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
