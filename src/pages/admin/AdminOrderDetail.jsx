import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getOrderById, updateOrderStatus } from '../../services/api';
import { BANK_TRANSFER_DETAILS } from '../../constants/bankDetails';
import toast from 'react-hot-toast';

const STATUSES = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

// Helper for environment-aware logging
const devLog = (...args) => {
  if (import.meta.env.DEV) {
    console.log?.(...args);
  }
};

const AdminOrderDetail = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  
  // Log the ID being used from URL params
  devLog('📄 AdminOrderDetail - URL param ID:', id, 'Type:', typeof id, 'Length:', String(id).length);

  const { data: order, isLoading } = useQuery({
    queryKey: ['admin-order', id],
    queryFn: () => {
      if (!id) {
        throw new Error('Order ID is required');
      }
      return getOrderById(id);
    },
    enabled: Boolean(id),
    refetchInterval: 5000,
  });

  const { mutate: mutateOrderStatus, isPending: isUpdating } = useMutation({
    mutationFn: (status) => updateOrderStatus(id, { status }),
    onMutate: async (nextStatus) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['admin-order', id] });

      // Snapshot the previous value
      const previousOrder = queryClient.getQueryData(['admin-order', id]);

      // Optimistically update to the new value
      if (previousOrder) {
        queryClient.setQueryData(['admin-order', id], {
          ...previousOrder,
          status: nextStatus,
        });
      }

      return { previousOrder };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-order', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Order status updated successfully');
    },
    onError: (error, variables, context) => {
      // Revert on error
      if (context?.previousOrder) {
        queryClient.setQueryData(['admin-order', id], context.previousOrder);
      }
      const errorMsg = error.response?.data?.message || 'Failed to update order status';
      toast.error(errorMsg);
    },
  });

  if (isLoading) {
    return <div className="h-32 rounded-2xl bg-gray-100 animate-pulse" />;
  }

  if (!order) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
        <p className="text-red-600 font-semibold">Order not found.</p>
        <p className="text-gray-500 text-sm mt-2">Order ID: {id}</p>
        <p className="text-gray-500 text-sm">The order may have been deleted or the ID may be incorrect.</p>
      </div>
    );
  }

  const isCod = order.paymentMethod === 'Cash on Delivery';
  const isBankTransfer = order.paymentMethod === 'Bank Transfer';
  const orderItems = Array.isArray(order?.items) && order.items.length > 0
    ? order.items
    : Array.isArray(order?.orderItems)
      ? order.orderItems
      : [];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order {order.orderNumber || order._id}</h1>
            <p className="text-sm text-gray-500 mt-1">{new Date(order.createdAt).toLocaleString()}</p>
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
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Update Status</h2>
        <select
          value={order.status || 'Pending'}
          onChange={(e) => mutateOrderStatus(e.target.value)}
          disabled={isUpdating}
          className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0"
        >
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {isCod && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
          <p className="font-semibold text-emerald-800">Cash on Delivery order</p>
          <p className="text-sm text-emerald-700 mt-1">Collect payment from the customer at delivery.</p>
        </div>
      )}

      {isBankTransfer && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <p className="font-semibold text-amber-800">Bank Transfer details provided to customer</p>
          <p className="text-sm text-amber-700 mt-1">
            Account: {BANK_TRANSFER_DETAILS.accountNumber} • {BANK_TRANSFER_DETAILS.bankName} •{' '}
            {BANK_TRANSFER_DETAILS.accountHolder}
          </p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Items</h2>
        {orderItems.length > 0 ? (
          <div className="space-y-3">
            {orderItems.map((item, index) => {
              const productName = item?.product?.name || item?.name || `Product ${index + 1}`;
              return (
                <div key={index} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                  <div>
                    <p className="font-semibold text-gray-900">{productName}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity || 0} {item.size ? `• Size: ${item.size}` : ''}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    රු{Number((item.price || 0) * (item.quantity || 0)).toLocaleString()}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No item details available for this order.</p>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Shipping & Contact</h2>
        <p className="text-gray-900 font-medium">
          {order?.shippingAddress?.firstName} {order?.shippingAddress?.lastName}
        </p>
        <p className="text-sm text-gray-600 mt-1">{order?.shippingAddress?.address}</p>
        <p className="text-sm text-gray-600">
          {order?.shippingAddress?.city}, {order?.shippingAddress?.district} {order?.shippingAddress?.postalCode || ''}
        </p>
        <p className="text-sm text-gray-600 mt-2">Phone: {order?.shippingAddress?.phone}</p>
        <p className="text-sm text-gray-600">Email: {order?.shippingAddress?.email}</p>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
