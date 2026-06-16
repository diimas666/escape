import type { CartItemInput } from '../types/cart';
import type { HomeProduct } from '../types/catalog';

export function homeProductToCartInput(
  product: HomeProduct,
  variant?: string,
): CartItemInput {
  if (!product.handle) {
    throw new Error('invalid_product');
  }

  return {
    productId: product.id,
    handle: product.handle,
    title: product.title,
    price: product.price,
    image: product.image,
    variant,
  };
}

export async function addHomeProductToCart(
  addToCart: (item: CartItemInput) => Promise<void>,
  product: HomeProduct,
  variant?: string,
) {
  try {
    await addToCart(homeProductToCartInput(product, variant));
  } catch (error) {
    // Якщо товар реально недоступний або некоректний — даємо екрану показати помилку
    if (
      error instanceof Error &&
      (error.message === 'out_of_stock' ||
        error.message === 'variant_required' ||
        error.message === 'invalid_product')
    ) {
      throw error;
    }

    // Для всіх інших випадків (наприклад, збій збереження у AsyncStorage)
    // не ламаємо UX: товар уже у стані кошика, просто логуємо.
    // eslint-disable-next-line no-console
    console.warn('Non-blocking addToCart error', error);
  }
}
