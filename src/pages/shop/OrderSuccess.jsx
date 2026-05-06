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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-16">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 mx-auto mb-8 bg-blue-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Order Placed Successfully!
          </h1>
          <p className="text-slate-500 mb-8 font-medium">
            Thank you for your order. We'll process it shortly.
          </p>
          <Link 
            to="/shop" 
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-8 py-3.5 rounded-md hover:bg-blue-700 transition-colors text-sm uppercase tracking-wider"
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
  const whatsappUrl = `https://wa.me/94753979659?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-slate-50 py-8 overflow-x-clip">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center relative">
            <CheckCircle className="w-10 h-10 text-blue-600" />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3 uppercase tracking-tight">
            Order Placed Successfully!
          </h1>
          <p className="text-lg text-slate-500 mb-6 font-medium">
            Thank you for shopping with VibeIt
          </p>
          <div className="inline-flex items-center gap-3 bg-white border border-slate-200 px-6 py-3 rounded-md shadow-sm">
            <span className="text-sm text-slate-500 font-bold uppercase">Order Number:</span>
            <span className="font-mono font-bold text-blue-600 text-lg">{orderNumber}</span>
            <button
              onClick={() => copyOrderNumber(orderNumber)}
              className="p-1.5 hover:bg-slate-100 rounded-md transition-colors"
              title="Copy Order Number"
            >
              {copied ? (
                <Check className="w-5 h-5 text-emerald-600" />
              ) : (
                <Copy className="w-5 h-5 text-slate-400 hover:text-slate-600" />
              )}
            </button>
          </div>
        </div>

        {/* Bank Transfer Instructions */}
        {isBankTransfer && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-6 sm:p-8 mb-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-blue-100 pb-4">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-md flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-blue-900 text-xl uppercase tracking-wider">Payment Required</h3>
            </div>
            <div className="space-y-4 text-blue-900 mb-6 font-medium">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm">1</div>
                <p>Transfer amount: <strong className="text-blue-700 text-lg">Rs {order.total.toLocaleString()}</strong></p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm">2</div>
                <p>Use reference: <strong className="font-mono bg-white px-2 py-0.5 rounded border border-blue-200">{orderNumber}</strong> and transfer to:</p>
              </div>
              <div className="flex items-start gap-3 pl-9">
                <div className="bg-white p-4 rounded-md border border-blue-200 w-full">
                  <p><strong>{BANK_TRANSFER_DETAILS.accountHolder}</strong></p>
                  <p>A/C {BANK_TRANSFER_DETAILS.accountNumber}</p>
                  <p>{BANK_TRANSFER_DETAILS.bankName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm">3</div>
                <p>Send payment slip to WhatsApp: <strong>0753979659</strong></p>
              </div>
            </div>
            <div className="bg-blue-100 rounded-md p-3 text-sm text-blue-800 font-bold">
              ⚠️ Your order will be processed after payment confirmation
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden mb-6">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Package className="w-5 h-5 text-slate-400" />
              Order Summary
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4 mb-6">
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">{item.product?.name || 'Product'}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-semibold text-slate-500">
                        Qty: {item.quantity}
                      </span>
                      {item.size && (
                        <span className="text-xs font-semibold text-slate-500">
                          Size: {item.size}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="font-bold text-slate-900">
                    Rs {((item.price || 0) * (item.quantity || 0)).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-slate-200 pt-4 space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">Rs {order.subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="font-bold">
                  {order.shippingFee === 0 ? (
                    <span className="text-blue-600 flex items-center gap-1">
                      FREE
                    </span>
                  ) : (
                    <span className="text-slate-900">Rs {order.shippingFee?.toLocaleString()}</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-4 border-t border-slate-200 mt-2 text-slate-900">
                <span className="uppercase">Total</span>
                <span>
                  Rs {order.total?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-md border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider">Shipping To</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-md p-4">
              <p className="font-bold text-slate-900 mb-1">
                {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
              </p>
              <p className="text-slate-600 text-sm font-medium">{order.shippingAddress?.address}</p>
              <p className="text-slate-600 text-sm font-medium">
                {order.shippingAddress?.city}, {order.shippingAddress?.district}
                {order.shippingAddress?.postalCode && ` ${order.shippingAddress.postalCode}`}
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-md p-3">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="text-slate-700 font-bold text-sm">{order.shippingAddress?.phone}</span>
              </div>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-md p-3">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="text-slate-700 text-sm font-bold">{order.shippingAddress?.email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-md border border-slate-200 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4 uppercase tracking-wider">Next Steps</h2>
          <div className="space-y-3 text-sm text-slate-600 font-medium">
            <p>1. Keep your Order ID: <span className="font-mono text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">{orderNumber}</span></p>
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
            className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3.5 rounded-md transition-colors text-sm uppercase tracking-wider"
          >
            <MessageCircle className="w-4 h-4" />
            Send WhatsApp Message
          </a>
          <Link
            to="/shop"
            className="flex items-center justify-center gap-2 bg-white border border-slate-300 text-slate-700 font-bold px-6 py-3.5 rounded-md hover:bg-slate-50 transition-colors text-sm uppercase tracking-wider"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Email Confirmation Note */}
        <div className="text-center">
          <p className="text-sm text-slate-500 font-medium flex items-center justify-center gap-2">
            <Mail className="w-4 h-4 text-slate-400" />
            Order confirmation sent to <strong className="text-slate-900">{order.shippingAddress?.email}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
