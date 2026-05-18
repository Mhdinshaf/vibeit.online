const PROMO_CONFIG_KEY = 'vibeit_promo_config';
export const PROMO_CONFIG_EVENT = 'vibeit:promo-config-updated';

const DEFAULT_CONFIG = {
  freeDeliveryEnabled: false,
  promoTiers: [
    { id: 'tier5',  minOrders: 5,  label: '5+ Orders Reward',  promoCode: 'VIBE10',   discountType: 'percent',      discountValue: 10, description: '10% off your order' },
    { id: 'tier10', minOrders: 10, label: '10+ Orders Reward', promoCode: 'VIBE15',   discountType: 'percent',      discountValue: 15, description: '15% off your order' },
    { id: 'tier15', minOrders: 15, label: '15+ Orders Reward', promoCode: 'VIBE20',   discountType: 'percent',      discountValue: 20, description: '20% off your order' },
    { id: 'tier20', minOrders: 20, label: 'VIP Reward',        promoCode: 'FREESHIP', discountType: 'freeDelivery', discountValue: 0,  description: 'Free Delivery on every order' },
  ],
};

export const isResellerCustomer = (customer) => (
  Boolean(
    customer?.isReseller ||
    customer?.reseller ||
    customer?.customerType === 'reseller' ||
    customer?.role === 'reseller'
  )
);

const isResellerTier = (tier) => Boolean(tier?.resellerOnly);

const getEligibleTiers = (config, customer) => {
  const cfg = config || getPromoConfig();
  const tiers = cfg.promoTiers || [];
  return isResellerCustomer(customer)
    ? tiers.filter(isResellerTier)
    : tiers.filter((tier) => !isResellerTier(tier));
};


export const getPromoConfig = () => {
  try {
    const raw = localStorage.getItem(PROMO_CONFIG_KEY);
    if (!raw) return structuredClone(DEFAULT_CONFIG);
    return { ...structuredClone(DEFAULT_CONFIG), ...JSON.parse(raw) };
  } catch {
    return structuredClone(DEFAULT_CONFIG);
  }
};

export const savePromoConfig = (config) => {
  localStorage.setItem(PROMO_CONFIG_KEY, JSON.stringify(config));
  window.dispatchEvent(new CustomEvent(PROMO_CONFIG_EVENT));
};

export const getEarnedPromos = (deliveredOrderCount, config, customer) => {
  const sorted = [...getEligibleTiers(config, customer)].sort((a, b) => a.minOrders - b.minOrders);
  return sorted.map(tier => ({ ...tier, earned: deliveredOrderCount >= tier.minOrders }));
};

export const getNextMilestone = (deliveredOrderCount, config, customer) => {
  const sorted = [...getEligibleTiers(config, customer)].sort((a, b) => a.minOrders - b.minOrders);
  return sorted.find(t => deliveredOrderCount < t.minOrders) || null;
};

export const validatePromoCode = (code, deliveredOrderCount, config, usedPromoCodes = [], customer) => {
  if (!code) return null;
  const normalizedCode = code.trim().toUpperCase();
  const tier = getEligibleTiers(config, customer).find(
    t => t.promoCode.toUpperCase() === normalizedCode
  );
  if (!tier) return null;
  if (deliveredOrderCount < tier.minOrders) return null;

  // Check if already used
  const isUsed = usedPromoCodes.some(c => String(c || '').toUpperCase() === normalizedCode);
  if (isUsed) {
    return { ...tier, alreadyUsed: true };
  }

  return tier;
};

// Read customer list derived from localStorage orders (used as fallback without backend)
export const deriveCustomersFromOrders = () => {
  try {
    const raw = localStorage.getItem('vibeit_orders_db');
    if (!raw) return [];
    const orders = JSON.parse(raw);
    if (!Array.isArray(orders)) return [];

    const map = new Map();
    orders.forEach(order => {
      const email = order.shippingAddress?.email?.toLowerCase();
      if (!email) return;
      if (!map.has(email)) {
        map.set(email, {
          _id: email,
          firstName: order.shippingAddress?.firstName || '',
          lastName: order.shippingAddress?.lastName || '',
          email,
          phone: order.shippingAddress?.phone || '',
          totalOrders: 0,
          deliveredOrders: 0,
          createdAt: order.createdAt,
          orders: [],
        });
      }
      const c = map.get(email);
      c.totalOrders++;
      if (['Delivered', 'delivered'].includes(order.status)) c.deliveredOrders++;
      c.orders.push(order);
      if (new Date(order.createdAt) < new Date(c.createdAt)) c.createdAt = order.createdAt;
    });
    return Array.from(map.values());
  } catch {
    return [];
  }
};

export const getTierBadgeColor = (tierId) => {
  const colors = {
    tier5:  'bg-blue-100 text-blue-700',
    tier10: 'bg-purple-100 text-purple-700',
    tier15: 'bg-amber-100 text-amber-700',
    tier20: 'bg-emerald-100 text-emerald-700',
  };
  return colors[tierId] || 'bg-slate-100 text-slate-700';
};

export const getHighestEarnedTier = (deliveredOrderCount, config, customer) => {
  const promos = getEarnedPromos(deliveredOrderCount, config, customer);
  return [...promos].reverse().find(p => p.earned) || null;
};
