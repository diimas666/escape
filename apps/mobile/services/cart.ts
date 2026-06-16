import type { CartItem } from '../types/cart';

export function matchesCartLine(
  item: CartItem,
  productId: string,
  variant?: string,
): boolean {
  return item.productId === productId && item.variant === variant;
}

export function mergeCartItem(
  items: CartItem[],
  item: Omit<CartItem, 'quantity'>,
): CartItem[] {
  const existing = items.find(entry => matchesCartLine(entry, item.productId, item.variant));

  if (existing) {
    return items.map(entry =>
      matchesCartLine(entry, item.productId, item.variant)
        ? {
            ...entry,
            ...item,
            quantity: entry.quantity + 1,
          }
        : entry,
    );
  }

  return [...items, { ...item, quantity: 1 }];
}

export function removeCartLine(
  items: CartItem[],
  productId: string,
  variant?: string,
): CartItem[] {
  return items.filter(item => !matchesCartLine(item, productId, variant));
}

