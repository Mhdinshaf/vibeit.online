/**
 * Shipping fee calculator
 * - First 1 kg  → Rs 500 (base)
 * - Each extra kg (or part thereof) → Rs 150
 * - Free if subtotal >= 5000 OR freeDeliveryEnabled OR promo applies
 *
 * @param {Array}   cartItems   - cart items with { product: { weightKg }, quantity }
 * @param {number}  subtotal    - cart subtotal in Rs
 * @param {boolean} freeDelivery - admin-toggled free delivery flag
 * @param {object}  appliedPromo - promo object (may have discountType: 'freeDelivery')
 * @returns {{ fee: number, totalWeightKg: number, breakdown: string }}
 */
export const FREE_SHIPPING_THRESHOLD = 5000;
export const BASE_SHIPPING_FEE = 500;   // first 1 kg
export const EXTRA_KG_FEE = 150;        // per additional kg

export const calcShipping = (cartItems = [], subtotal = 0, freeDelivery = false, appliedPromo = null) => {
  // Free delivery conditions
  if (
    freeDelivery ||
    appliedPromo?.discountType === 'freeDelivery' ||
    subtotal >= FREE_SHIPPING_THRESHOLD
  ) {
    return { fee: 0, totalWeightKg: 0, breakdown: 'FREE' };
  }

  // Calculate total weight
  const totalWeightKg = cartItems.reduce((sum, item) => {
    const w = Number(item?.product?.weightKg) || 1;
    const q = Number(item?.quantity) || 1;
    return sum + w * q;
  }, 0);

  // Rs500 for first kg + Rs150 per each additional kg (rounded up)
  const extraKg = Math.max(0, Math.ceil(totalWeightKg) - 1);
  const fee = BASE_SHIPPING_FEE + extraKg * EXTRA_KG_FEE;

  const breakdown = totalWeightKg <= 1
    ? `${totalWeightKg.toFixed(1)} kg — Rs 500`
    : `${totalWeightKg.toFixed(1)} kg — Rs 500 + ${extraKg}×Rs 150`;

  return { fee, totalWeightKg, breakdown };
};
