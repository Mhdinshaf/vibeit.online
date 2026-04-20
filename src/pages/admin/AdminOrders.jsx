import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Eye, Search } from 'lucide-react';
import { getOrders, ORDER_SYNC_EVENT, updateOrderStatus } from '../../services/api';
import { BANK_TRANSFER_DETAILS } from '../../constants/bankDetails';
import toast from 'react-hot-toast';

const STATUSES = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

const AdminOrders = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [paymentMethod, setPaymentMethod] = useState('all');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', page, status, paymentMethod, search],
    queryFn: () => getOrders({ page, limit: 20, status, paymentMethod, search }),
    refetchInterval: 5000,
  });

  const { mutate: mutateOrderStatus } = useMutation({
    mutationFn: ({ id, nextStatus }) => updateOrderStatus(id, { status: nextStatus }),
    onMutate: async ({ id, nextStatus }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['admin-orders'] });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(['admin-orders', page, status, paymentMethod, search]);

      // Optimistically update to the new value
      if (previousData) {
        queryClient.setQueryData(
          ['admin-orders', page, status, paymentMethod, search],
          {
            ...previousData,
            orders: previousData.orders.map((order) =>
              order._id === id ? { ...order, status: nextStatus } : order
            ),
          }
        );
      }

      return { previousData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-order'] });
      toast.success('Order status updated successfully');
    },
    onError: (error, variables, context) => {
      // Revert on error
      if (context?.previousData) {
        queryClient.setQueryData(
          ['admin-orders', page, status, paymentMethod, search],
          context.previousData
        );
      }
      const errorMsg = error.response?.data?.message || 'Failed to update order status';
      toast.error(errorMsg);
    },
  });

  useEffect(() => {
    const refreshOrders = () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    };

    window.addEventListener(ORDER_SYNC_EVENT, refreshOrders);
    window.addEventListener('storage', refreshOrders);

    return () => {
      window.removeEventListener(ORDER_SYNC_EVENT, refreshOrders);
      window.removeEventListener('storage', refreshOrders);
    };
  }, [queryClient]);

  const orders = data?.orders || data?.data?.orders || (Array.isArray(data) ? data : []);
  const totalPages = data?.pages || data?.totalPages || 1;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 mt-1">Live order queue for admin review</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="relative lg:col-span-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by order id, order number, or customer name"
            className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-all"
          />
        </div>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="lg:col-span-3 px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0"
        >
          <option value="all">All statuses</option>
          {STATUSES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={paymentMethod}
          onChange={(e) => {
            setPaymentMethod(e.target.value);
            setPage(1);
          }}
          className="lg:col-span-3 px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0"
        >
          <option value="all">All payments</option>
          <option value="Cash on Delivery">Cash on Delivery</option>
          <option value="Bank Transfer">Bank Transfer</option>
        </select>
      </div>

      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map((order) => {
            const customerName = `${order?.shippingAddress?.firstName || ''} ${order?.shippingAddress?.lastName || ''}`.trim() || 'Customer';
            const orderRef = order.orderNumber || order._id;
            const isCod = order.paymentMethod === 'Cash on Delivery';
            const isBankTransfer = order.paymentMethod === 'Bank Transfer';

            return (
              <div key={order._id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Order</p>
                    <p className="font-mono font-semibold text-blue-600">{orderRef}</p>
                    <p className="text-sm text-gray-600 mt-1">{customerName}</p>
                    <p className="text-sm font-semibold text-gray-900">රු{Number(order.total || 0).toLocaleString()}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                      {order.status || 'Pending'}
                    </span>
                    <span
                      className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold ${
                        isCod ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {isCod ? 'COD - Collect on delivery' : 'Bank Transfer'}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <select
                      value={order.status || 'Pending'}
                      onChange={(e) => {
                        const orderId = order._id || order.id;
                        if (!orderId) {
                          console.error('❌ CRITICAL: Order has no _id or id!', order);
                          toast.error('Order ID missing - cannot update status');
                          return;
                        }
                        console.log('📋 Status change initiated:');
                        console.log('  - Order._id:', order._id);
                        console.log('  - Order.id:', order.id);
                        console.log('  - Using ID:', orderId);
                        console.log('  - New Status:', e.target.value);
                        console.log('  - Full Order:', JSON.stringify(order, null, 2));
                        mutateOrderStatus({ id: orderId, nextStatus: e.target.value });
                      }}
                      className="px-3 py-2.5 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 text-sm"
                    >
                      {STATUSES.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <Link
                      to={`/admin/orders/${order._id}`}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Link>
                  </div>
                </div>

                {isBankTransfer && (
                  <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm">
                    <p className="font-semibold text-amber-800">Bank transfer payment details</p>
                    <p className="text-amber-700 mt-1">
                      Account: {BANK_TRANSFER_DETAILS.accountNumber} • {BANK_TRANSFER_DETAILS.bankName} •{' '}
                      {BANK_TRANSFER_DETAILS.accountHolder}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <p className="text-gray-500">No orders found.</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page <= 1}
            className="px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page <span className="font-semibold text-gray-900">{page}</span> of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page >= totalPages}
            className="px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
