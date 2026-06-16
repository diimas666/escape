import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { mergeCartItem, matchesCartLine, removeCartLine } from '../services/cart';
import { clearStoredCart, loadCart, saveCart } from '../services/cartStorage';
import type { CartItem, CartItemInput } from '../types/cart';

export type { CartItem, CartItemInput };

type CartContextValue = {
  items: CartItem[];
  isHydrated: boolean;
  totalQuantity: number;
  addToCart: (item: CartItemInput) => Promise<void>;
  removeFromCart: (productId: string, variant?: string) => Promise<void>;
  increment: (productId: string, variant?: string) => Promise<void>;
  decrement: (productId: string, variant?: string) => Promise<void>;
  clearCart: () => Promise<void>;
  isInCart: (productId: string, variant?: string) => boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  const updateItems = useCallback(
    (updater: (current: CartItem[]) => CartItem[]) =>
      new Promise<CartItem[]>(resolve => {
        setItems(current => {
          const nextItems = updater(current);
          resolve(nextItems);
          return nextItems;
        });
      }),
    [],
  );

  useEffect(() => {
    let isMounted = true;

    loadCart()
      .then(stored => {
        if (isMounted) {
          setItems(stored);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsHydrated(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const addToCart = useCallback(async (item: CartItemInput) => {
    if (!item.productId || !item.handle) {
      throw new Error('invalid_product');
    }

    const nextItems = await updateItems(current => mergeCartItem(current, item));
    await saveCart(nextItems);
  }, [updateItems]);

  const removeFromCart = useCallback(async (productId: string, variant?: string) => {
    const nextItems = await updateItems(current =>
      removeCartLine(current, productId, variant),
    );
    await saveCart(nextItems);
  }, [updateItems]);

  const increment = useCallback(async (productId: string, variant?: string) => {
    const nextItems = await updateItems(current =>
      current.map(item =>
        matchesCartLine(item, productId, variant)
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
    await saveCart(nextItems);
  }, [updateItems]);

  const decrement = useCallback(async (productId: string, variant?: string) => {
    const nextItems = await updateItems(current =>
      current
        .map(item =>
          matchesCartLine(item, productId, variant)
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter(item => item.quantity > 0),
    );
    await saveCart(nextItems);
  }, [updateItems]);

  const clearCart = useCallback(async () => {
    setItems([]);
    await clearStoredCart();
  }, []);

  const isInCart = useCallback(
    (productId: string, variant?: string) =>
      items.some(item => matchesCartLine(item, productId, variant)),
    [items],
  );

  const totalQuantity = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      isHydrated,
      totalQuantity,
      addToCart,
      removeFromCart,
      increment,
      decrement,
      clearCart,
      isInCart,
    }),
    [
      items,
      isHydrated,
      totalQuantity,
      addToCart,
      removeFromCart,
      increment,
      decrement,
      clearCart,
      isInCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }

  return context;
}
