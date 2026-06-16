import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CartItem, CartItemInput } from '../types/cart';

const CART_STORAGE_KEY = 'cart';

export async function loadCart(): Promise<CartItem[]> {
  const stored = await AsyncStorage.getItem(CART_STORAGE_KEY);

  if (!stored) {
    return [];
  }

  try {
    const parsed = JSON.parse(stored) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveCart(items: CartItem[]): Promise<void> {
  await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export async function clearStoredCart(): Promise<void> {
  await AsyncStorage.removeItem(CART_STORAGE_KEY);
}
