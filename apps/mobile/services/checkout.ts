import type { CartItem } from '../types/cart';
import { api } from '../config/api';

export type CheckoutOrder = {
  name: string;
  lastName: string;
  phone: string;
  email?: string;
  comment?: string;
  paymentMethod: string;
  city: string;
  cityRef: string;
  warehouse: string;
  total: number;
  items: CartItem[];
  createdAt: string;
};

export async function submitCheckout(order: CheckoutOrder): Promise<void> {
  const response = await api.checkout(order);

  if (!response.ok) {
    throw new Error(`Checkout failed: ${response.status}`);
  }
}
