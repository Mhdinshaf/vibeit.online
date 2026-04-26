import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Cart Store
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity, size) => {
        const key = `${product._id}-${size}`;
        const price = product.discountPrice || product.originalPrice || 0;

        set((state) => {
          const existingItem = state.items.find((item) => item.key === key);

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.key === key
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { key, product, quantity, size, price }],
          };
        });
      },

      removeItem: (key) => {
        set((state) => ({
          items: state.items.filter((item) => item.key !== key),
        }));
      },

      updateQuantity: (key, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.key === key ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'vibeit-cart',
    }
  )
);

// Customer Dashboard Store
export const useCustomerStore = create(
  persist(
    (set, get) => ({
      orders: [],
      addresses: [],
      filteredOrders: [],
      searchQuery: '',
      statusFilter: 'all',

      setOrders: (orders) => set({ orders }),
      
      setAddresses: (addresses) => set({ addresses }),
      
      setSearchQuery: (query) => {
        set({ searchQuery: query });
        get().filterOrders();
      },

      setStatusFilter: (status) => {
        set({ statusFilter: status });
        get().filterOrders();
      },

      filterOrders: () => {
        const { orders, searchQuery, statusFilter } = get();
        let filtered = orders;

        if (searchQuery.trim()) {
          filtered = filtered.filter((order) =>
            order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        if (statusFilter !== 'all') {
          filtered = filtered.filter((order) => order.status === statusFilter);
        }

        set({ filteredOrders: filtered });
      },

      addOrder: (order) => {
        const existing = get().orders.find((o) => o._id === order._id);
        if (!existing) {
          set((state) => ({
            orders: [order, ...state.orders],
          }));
        }
      },

      updateOrder: (orderId, updatedData) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order._id === orderId ? { ...order, ...updatedData } : order
          ),
        }));
        get().filterOrders();
      },

      addAddress: (address) => {
        set((state) => ({
          addresses: [...state.addresses, address],
        }));
      },

      updateAddress: (addressId, updatedAddress) => {
        set((state) => ({
          addresses: state.addresses.map((addr) =>
            addr._id === addressId ? { ...addr, ...updatedAddress } : addr
          ),
        }));
      },

      deleteAddress: (addressId) => {
        set((state) => ({
          addresses: state.addresses.filter((addr) => addr._id !== addressId),
        }));
      },

      setDefaultAddress: (addressId) => {
        set((state) => ({
          addresses: state.addresses.map((addr) => ({
            ...addr,
            isDefault: addr._id === addressId,
          })),
        }));
      },

      clearDashboardData: () => {
        set({
          orders: [],
          addresses: [],
          filteredOrders: [],
          searchQuery: '',
          statusFilter: 'all',
        });
      },
    }),
    {
      name: 'vibeit-customer-dashboard',
    }
  )
);
