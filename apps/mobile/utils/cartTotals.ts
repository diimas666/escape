import type { CartItem } from '../types/cart';

export type CartTotals = {
  total: number;
  originalTotal: number;
  savings: number;
  discountPercent: number;
  hasDiscount: boolean;
};

export function getCartTotals(items: CartItem[]): CartTotals {
  let total = 0;
  let originalTotal = 0;

  for (const item of items) {
    const lineTotal = item.price * item.quantity;
    total += lineTotal;

    const originalUnitPrice =
      item.oldPrice && item.oldPrice > item.price ? item.oldPrice : item.price;
    originalTotal += originalUnitPrice * item.quantity;
  }

  const savings = originalTotal - total;
  const hasDiscount = savings > 0;
  const discountPercent = hasDiscount
    ? Math.round((savings / originalTotal) * 100)
    : 0;

  return {
    total,
    originalTotal,
    savings,
    discountPercent,
    hasDiscount,
  };
}
