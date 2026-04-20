import axios from 'axios';

const ORDER_DB_KEY = 'vibeit_orders_db';
const ORDER_SYNC_KEY = 'vibeit_orders_sync';
export const ORDER_SYNC_EVENT = 'vibeit:orders-updated';

const isOfflineOrServerUnavailable = (error) => {
  if (!error) return false;
  if (!error.response) return true;
  return error.response.status >= 500;
};

const readLocalOrders = () => {
  const raw = localStorage.getItem(ORDER_DB_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeLocalOrders = (orders) => {
  localStorage.setItem(ORDER_DB_KEY, JSON.stringify(orders));
};

const notifyOrdersUpdated = () => {
  localStorage.setItem(ORDER_SYNC_KEY, String(Date.now()));
  window.dispatchEvent(new CustomEvent(ORDER_SYNC_EVENT));
};

const buildOrderNumber = () => {
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const random = Math.floor(1000 + Math.random() * 9000);
  return `VB-${stamp}-${random}`;
};

const getCartItemsSnapshot = () => {
  const raw = localStorage.getItem('vibeit-cart');
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return parsed?.state?.items || [];
  } catch {
    return [];
  }
};

const enrichItems = (items = []) => {
  const cartItems = getCartItemsSnapshot();

  return items.map((item) => {
    const matched = cartItems.find(
      (cartItem) =>
        String(cartItem?.product?._id) === String(item.product) &&
        String(cartItem?.size || '') === String(item?.size || '')
    );

    return {
      ...item,
      product: matched?.product || item.product,
    };
  });
};

const createLocalOrder = (payload) => {
  const now = new Date().toISOString();
  
  // If payload has _id from server, use it. Otherwise generate a temporary ID.
  const orderId = payload._id ||
    (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.floor(Math.random() * 100000)}`);

  return {
    _id: orderId,
    orderNumber: payload.orderNumber || buildOrderNumber(),
    items: enrichItems(payload.items || []),
    shippingAddress: payload.shippingAddress || {},
    paymentMethod: payload.paymentMethod || 'Bank Transfer',
    shippingFee: payload.shippingFee || 0,
    subtotal: payload.subtotal || 0,
    total: payload.total || 0,
    notes: payload.notes || '',
    status: payload.status || 'Pending',
    createdAt: payload.createdAt || now,
    updatedAt: payload.updatedAt || now,
  };
};

const filterOrders = (orders, params = {}) => {
  const { status, paymentMethod, search } = params;

  return orders.filter((order) => {
    const matchStatus = !status || status === 'all' || order.status === status;
    const matchPayment = !paymentMethod || paymentMethod === 'all' || order.paymentMethod === paymentMethod;

    if (!search) {
      return matchStatus && matchPayment;
    }

    const normalizedSearch = String(search).toLowerCase();
    const fullName = `${order?.shippingAddress?.firstName || ''} ${order?.shippingAddress?.lastName || ''}`.toLowerCase();
    const orderRef = `${order.orderNumber || ''} ${order._id || ''}`.toLowerCase();

    return matchStatus && matchPayment && (fullName.includes(normalizedSearch) || orderRef.includes(normalizedSearch));
  });
};

// Use orderNumber as primary key since it's stable across frontend/backend
// _id may vary (UUID vs MongoDB ObjectId), but orderNumber is always consistent
const getOrderIdentity = (order) => {
  // Prefer orderNumber since it's the stable identifier across all states
  if (order?.orderNumber) return String(order.orderNumber);
  // Fallback to _id if orderNumber is missing (edge case)
  if (order?._id) return String(order._id);
  // Last resort: id field (legacy)
  if (order?.id) return String(order.id);
  return '';
};

const sortOrdersByCreatedAtDesc = (orders = []) =>
  [...orders].sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0));

const upsertLocalOrder = (order) => {
  if (!order || !getOrderIdentity(order)) return;

  const orders = readLocalOrders();
  const identity = getOrderIdentity(order);
  const index = orders.findIndex((item) => getOrderIdentity(item) === identity);

  if (index >= 0) {
    // IMPORTANT: Remote order data should completely override local, especially _id
    // This ensures we never keep stale UUIDs from cache
    orders[index] = { ...orders[index], ...order, _id: order._id, orderNumber: order.orderNumber };
  } else {
    orders.unshift(order);
  }

  writeLocalOrders(sortOrdersByCreatedAtDesc(orders));
};

const mergeRemoteAndLocalOrders = (remoteOrders = [], localOrders = []) => {
  const byOrderNumber = new Map();
  
  // First, add all local orders (these are backups for offline mode)
  for (const localOrder of localOrders) {
    const key = localOrder?.orderNumber || getOrderIdentity(localOrder);
    if (!key) continue;
    byOrderNumber.set(key, localOrder);
  }

  // IMPORTANT: Remote orders ALWAYS override local ones (they have the true database _id)
  for (const remoteOrder of remoteOrders) {
    const key = remoteOrder?.orderNumber || getOrderIdentity(remoteOrder);
    if (!key) continue;
    
    // Use remote order completely, but preserve any missing fields from local if needed
    const existing = byOrderNumber.get(key);
    byOrderNumber.set(key, {
      ...existing,      // Keep any local data
      ...remoteOrder,   // Override with remote data (including _id)
    });
  }

  return sortOrdersByCreatedAtDesc(Array.from(byOrderNumber.values()));
};

const normalizeOrdersResponse = (payload) => {
  if (Array.isArray(payload)) {
    return {
      orders: payload,
      total: payload.length,
      page: 1,
      pages: 1,
    };
  }

  const orders = payload?.orders || payload?.data?.orders || [];
  const total = payload?.total || payload?.data?.total || orders.length;
  const page = payload?.page || payload?.data?.page || 1;
  const pages = payload?.pages || payload?.totalPages || payload?.data?.pages || 1;

  return {
    ...payload,
    orders,
    total,
    page,
    pages,
  };
};

const getLocalOrderMetrics = () => {
  const orders = readLocalOrders();
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const currentMonthOrders = orders.filter((order) => {
    const createdAt = new Date(order?.createdAt || 0);
    return createdAt.getFullYear() === currentYear && createdAt.getMonth() === currentMonth;
  });

  return {
    orders,
    monthlyOrders: currentMonthOrders.length,
    monthlyRevenue: currentMonthOrders.reduce((sum, order) => sum + Number(order?.total || 0), 0),
    pendingOrders: orders.filter((order) => order.status === 'Pending').length,
    completedOrders: orders.filter((order) => order.status === 'Delivered').length,
    cancelledOrders: orders.filter((order) => order.status === 'Cancelled').length,
  };
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('vibeit_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('vibeit_token');
      localStorage.removeItem('vibeit_admin');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Product APIs
export const getProducts = async (params) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const getAdminProducts = async (params) => {
  const response = await api.get('/products/admin/all', { params });
  return response.data;
};

export const createProduct = async (data) => {
  const response = await api.post('/products', data);
  return response.data;
};

export const updateProduct = async (id, data) => {
  const response = await api.put(`/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

export const deleteProductPermanent = async (id) => {
  try {
    // Try permanent delete endpoint first
    const response = await api.delete(`/products/${id}/permanent`);
    return response.data;
  } catch (error) {
    // If permanent endpoint doesn't exist, fall back to regular delete
    // This sends a special flag to indicate hard delete
    const response = await api.delete(`/products/${id}`, {
      params: { permanent: true }
    });
    return response.data;
  }
};

// Order APIs
export const createOrder = async (data) => {
  try {
    const response = await api.post('/orders', data);
    upsertLocalOrder(response.data);
    notifyOrdersUpdated();
    return response.data;
  } catch (error) {
    const message = String(error?.response?.data?.message || '').toLowerCase();
    const itemError =
      message.includes('no order item provided') ||
      message.includes('order item') ||
      message.includes('orderitems');

    if (itemError) {
      const normalizedItems = Array.isArray(data?.orderItems) && data.orderItems.length > 0
        ? data.orderItems
        : Array.isArray(data?.items)
          ? data.items
          : [];

      const retryPayload = {
        ...data,
        items: normalizedItems,
        orderItems: normalizedItems,
      };

      const retryResponse = await api.post('/orders', retryPayload);
      upsertLocalOrder(retryResponse.data);
      notifyOrdersUpdated();
      return retryResponse.data;
    }

    if (!isOfflineOrServerUnavailable(error)) {
      throw error;
    }

    const order = createLocalOrder(data);
    const orders = readLocalOrders();
    orders.unshift(order);
    writeLocalOrders(orders);
    notifyOrdersUpdated();
    return order;
  }
};

export const getOrders = async (params) => {
  try {
    const response = await api.get('/orders', { params });
    const remotePayload = normalizeOrdersResponse(response.data);
    const localOrders = readLocalOrders();
    
    // Prioritize remote orders with their MongoDB _id
    const mergedOrders = mergeRemoteAndLocalOrders(remotePayload.orders, localOrders);

    // Ensure all remote orders are cached locally with their original _id
    for (const order of remotePayload.orders) {
      upsertLocalOrder(order);
    }

    const filtered = filterOrders(mergedOrders, params || {});
    const page = Number(params?.page || remotePayload.page || 1);
    const limit = Number(params?.limit || 20);
    const start = (page - 1) * limit;
    const pagedOrders = filtered.slice(start, start + limit);

    // Debug logging - verify _id is from remote (ObjectId), not from cache (UUID)
    if (pagedOrders.length > 0) {
      console.log('🔍 ORDERS LOADED FROM API:');
      console.log('  Remote order count:', remotePayload.orders.length);
      console.log('  Local order count:', localOrders.length);
      console.log('  Merged & filtered count:', filtered.length);
      console.log('  First 3 orders:');
      pagedOrders.slice(0, 3).forEach((o, i) => {
        console.log(`    [${i}] orderNumber: ${o.orderNumber}, _id: ${o._id}, _id_type: ${typeof o._id}, _id_length: ${String(o._id).length}`);
      });
      console.log('  All page orders _ids:', pagedOrders.map(o => o._id));
    }

    return {
      ...remotePayload,
      orders: pagedOrders,
      total: filtered.length,
      page,
      pages: Math.max(1, Math.ceil(filtered.length / limit)),
    };
  } catch (error) {
    if (!isOfflineOrServerUnavailable(error)) {
      throw error;
    }

    const page = Number(params?.page || 1);
    const limit = Number(params?.limit || 20);
    const filtered = filterOrders(
      [...readLocalOrders()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      params || {}
    );

    const start = (page - 1) * limit;
    const pagedOrders = filtered.slice(start, start + limit);

    return {
      orders: pagedOrders,
      total: filtered.length,
      page,
      pages: Math.max(1, Math.ceil(filtered.length / limit)),
    };
  }
};

export const getOrderById = async (id) => {
  if (!id) {
    throw new Error('Order ID is required');
  }
  
  try {
    console.log('🔍 Frontend - Getting order by ID:', id);
    const response = await api.get(`/orders/${id}`);
    const order = response.data;
    
    console.log('✅ Backend returned order._id:', order?._id);
    
    // Ensure we use the server's _id, not a local UUID
    if (order && order._id) {
      upsertLocalOrder(order);
    }
    
    return order;
  } catch (error) {
    console.error('❌ Error fetching order:', error?.response?.status, error?.response?.data?.message);
    
    if (!isOfflineOrServerUnavailable(error)) {
      throw error;
    }

    const order = readLocalOrders().find((item) => String(item._id) === String(id));
    if (!order) {
      throw error;
    }

    return order;
  }
};

export const updateOrderStatus = async (id, data) => {
  if (!id) {
    throw new Error('Order ID is required');
  }
  
  if (!data?.status) {
    throw new Error('Status is required');
  }
  
  // Validate status is one of the allowed values
  const validStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
  if (!validStatuses.includes(data.status)) {
    throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }
  
  try {
    // Log detailed information about the request
    const url = `/orders/${id}/status`;
    console.log('🔄 UPDATE ORDER STATUS REQUEST:');
    console.log('  URL:', url);
    console.log('  ID Type:', typeof id, '| ID Value:', id);
    console.log('  ID Length:', String(id).length, '| ID Format:', /^[0-9a-f]{24}$/.test(id) ? 'MongoDB ObjectId' : 'Other');
    console.log('  New Status:', data.status);
    console.log('  Request Body:', JSON.stringify(data));
    
    const response = await api.put(url, data);
    const updatedOrder = response.data;
    
    console.log('✅ UPDATE ORDER STATUS SUCCESS:');
    console.log('  Response._id:', updatedOrder?._id);
    console.log('  Response.status:', updatedOrder?.status);
    console.log('  Response.orderNumber:', updatedOrder?.orderNumber);
    
    // Ensure we use the server's response
    if (updatedOrder && updatedOrder._id) {
      upsertLocalOrder(updatedOrder);
    }
    
    notifyOrdersUpdated();
    return updatedOrder;
  } catch (error) {
    console.error('❌ UPDATE ORDER STATUS ERROR:');
    console.error('  Status:', error?.response?.status);
    console.error('  Message:', error?.response?.data?.message);
    console.error('  Full Error:', error?.response?.data);
    
    if (!isOfflineOrServerUnavailable(error)) {
      throw error;
    }

    const orders = readLocalOrders();
    const index = orders.findIndex((item) => String(item._id) === String(id));

    if (index === -1) {
      throw error;
    }

    const updated = {
      ...orders[index],
      status: data?.status || orders[index].status,
      updatedAt: new Date().toISOString(),
    };

    orders[index] = updated;
    writeLocalOrders(orders);
    notifyOrdersUpdated();
    return updated;
  }
};

export const getOrderStats = async () => {
  const localMetrics = getLocalOrderMetrics();

  try {
    const response = await api.get('/orders/stats');
    const remote = response.data || {};

    return {
      ...remote,
      totalOrders: Math.max(Number(remote.totalOrders || 0), localMetrics.orders.length),
      pendingOrders: Math.max(Number(remote.pendingOrders || 0), localMetrics.pendingOrders),
      completedOrders: Math.max(Number(remote.completedOrders || 0), localMetrics.completedOrders),
      cancelledOrders: Math.max(Number(remote.cancelledOrders || 0), localMetrics.cancelledOrders),
    };
  } catch (error) {
    if (!isOfflineOrServerUnavailable(error)) {
      throw error;
    }

    return {
      totalOrders: localMetrics.orders.length,
      pendingOrders: localMetrics.pendingOrders,
      completedOrders: localMetrics.completedOrders,
      cancelledOrders: localMetrics.cancelledOrders,
    };
  }
};

// Auth APIs
export const loginAdmin = async (data) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Upload API
export const uploadImage = async (formData) => {
  const response = await api.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const uploadImages = async (formData) => {
  const response = await api.post('/upload/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Analytics API
export const getDashboardStats = async () => {
  const localMetrics = getLocalOrderMetrics();

  try {
    const response = await api.get('/analytics/dashboard');
    const remote = response.data || {};

    return {
      ...remote,
      monthlyRevenue: Math.max(Number(remote.monthlyRevenue || 0), localMetrics.monthlyRevenue),
      monthlyOrders: Math.max(Number(remote.monthlyOrders || 0), localMetrics.monthlyOrders),
      pendingOrders: Math.max(Number(remote.pendingOrders || 0), localMetrics.pendingOrders),
      revenueByDay: remote.revenueByDay || [],
      ordersByCategory: remote.ordersByCategory || [],
      topSellingProducts: remote.topSellingProducts || [],
      lowStockProducts: remote.lowStockProducts || [],
    };
  } catch (error) {
    if (!isOfflineOrServerUnavailable(error)) {
      throw error;
    }

    return {
      monthlyRevenue: localMetrics.monthlyRevenue,
      revenueGrowth: 0,
      monthlyOrders: localMetrics.monthlyOrders,
      pendingOrders: localMetrics.pendingOrders,
      totalProducts: 0,
      lowStockCount: 0,
      revenueByDay: [],
      ordersByCategory: [],
      topSellingProducts: [],
      lowStockProducts: [],
    };
  }
};

export default api;
