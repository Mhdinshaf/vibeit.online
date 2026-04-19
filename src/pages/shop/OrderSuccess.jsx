import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, MessageCircle, CreditCard, Package, Truck, MapPin, Mail, Phone, ArrowRight, Sparkles, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { BANK_TRANSFER_DETAILS } from '../../constants/bankDetails';

const OrderSuccess = () => {
  const location = useLocation();
  const order = location.state?.order;
  const [copied, setCopied] = useState(false);

  const copyOrderNumber = (orderNum) => {
    navigator.clipboard.writeText(orderNum);
    setCopied(true);
    toast.success('Order number copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  // If no order data, show generic success
  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center py-16">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full animate-pulse opacity-20" />
            <div className="absolute inset-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-xl shadow-blue-200">
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-500 mb-8">
            Thank you for your order. We'll process it shortly.
          </p>
          <Link 
            to="/shop" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-blue-200"
          >
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="relative w-28 h-28 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-full animate-ping opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-xl shadow-green-200">
              <CheckCircle className="w-14 h-14 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Order Placed Successfully!
          </h1>
          <p className="text-lg text-gray-500 mb-4">
            Thank you for shopping with VibeIt
          </p>
          <div className="inline-flex items-center gap-2 bg-white border-2 border-blue-200 px-6 py-3 rounded-xl shadow-sm">
            <span className="text-sm text-gray-500">Order Number:</span>
            <span className="font-mono font-bold text-blue-600">{orderNumber}</span>
            <button
              onClick={() => copyOrderNumber(orderNumber)}
              className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Bank Transfer Instructions */}
        {isBankTransfer && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/30 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-200">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-xl">Payment Required</h3>
              </div>
              <div className="space-y-3 text-gray-700 mb-4">
                <div className="flex items-center gap-3 bg-white/60 rounded-xl p-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 font-bold">1</div>
                  <p>Transfer amount: <strong className="text-amber-600 text-lg">රු{order.total.toLocaleString()}</strong></p>
                </div>
                <div className="flex items-center gap-3 bg-white/60 rounded-xl p-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 font-bold">2</div>
                  <p>Use reference: <strong className="font-mono">{orderNumber}</strong> and transfer to:</p>
                </div>
                <div className="flex items-center gap-3 bg-white/60 rounded-xl p-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 font-bold">3</div>
                  <p>
                    <strong>{BANK_TRANSFER_DETAILS.accountHolder}</strong> • A/C {BANK_TRANSFER_DETAILS.accountNumber} •{' '}
                    {BANK_TRANSFER_DETAILS.bankName}
                  </p>
                </div>
                <div className="flex items-center gap-3 bg-white/60 rounded-xl p-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 font-bold">4</div>
                  <p>Send payment slip to WhatsApp: <strong>0753979659</strong></p>
                </div>
              </div>
              <div className="bg-amber-100 rounded-xl p-3 text-sm text-amber-800 font-medium">
                ⚠️ Your order will be processed after payment confirmation
              </div>
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Summary
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4 mb-6">
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item.product?.name || 'Product'}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-lg font-medium">
                        Qty: {item.quantity}
                      </span>
                      {item.size && (
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-lg">
                          Size: {item.size}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="font-bold text-gray-900">
                    රු{((item.price || 0) * (item.quantity || 0)).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-gray-100 pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">රු{order.subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-medium">
                  {order.shippingFee === 0 ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      FREE
                    </span>
                  ) : (
                    <span className="text-gray-900">රු{order.shippingFee?.toLocaleString()}</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-3 border-t border-gray-100">
                <span className="text-gray-900">Total</span>
                <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  රු{order.total?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Shipping To</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="font-semibold text-gray-900 mb-1">
                {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
              </p>
              <p className="text-gray-600 text-sm">{order.shippingAddress?.address}</p>
              <p className="text-gray-600 text-sm">
                {order.shippingAddress?.city}, {order.shippingAddress?.district}
                {order.shippingAddress?.postalCode && ` ${order.shippingAddress.postalCode}`}
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                <Phone className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700">{order.shippingAddress?.phone}</span>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                <Mail className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700 text-sm">{order.shippingAddress?.email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Next Steps</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>1. Keep your Order ID: <span className="font-mono text-blue-600">{orderNumber}</span></p>
            {isBankTransfer ? (
              <p>2. Complete the bank transfer and send your slip on WhatsApp for confirmation.</p>
            ) : (
              <p>2. This order is marked as Cash on Delivery and will be paid when delivered.</p>
            )}
            <p>3. Our admin team reviews your order and updates shipment status.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-6 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-green-200"
          >
            <MessageCircle className="w-5 h-5" />
            Send WhatsApp Message
          </a>
          <Link
            to="/shop"
            className="flex items-center justify-center gap-2 bg-white border-2 border-blue-500 text-blue-600 font-bold px-6 py-4 rounded-xl hover:bg-blue-50 transition-all duration-300"
          >
            Continue Shopping
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Email Confirmation Note */}
        <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-100">
          <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
            <Mail className="w-4 h-4 text-blue-600" />
            Order confirmation sent to <strong className="text-blue-600">{order.shippingAddress?.email}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
