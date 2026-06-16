export const errorMessages = {
  noInternet:
    'Немає з\'єднання з інтернетом. Перевірте мережу та спробуйте ще раз.',
  outOfStock: 'Цей товар зараз недоступний для замовлення',
  addToCartFailed: 'Не вдалося додати товар у кошик',
  invalidProduct: 'Товар недоступний',
  selectVariant: 'Будь ласка, виберіть колір товару',
  loadProduct: 'Не вдалося завантажити товар',
  loadData: 'Не вдалося завантажити дані',
  loadCategories: 'Не вдалося завантажити категорії',
  loadCategoryProducts: 'Не вдалося завантажити товари',
  generic: 'Щось пішло не так. Спробуйте ще раз',
} as const;

export function isNetworkError(error: unknown): boolean {
  if (error instanceof TypeError) {
    const message = error.message.toLowerCase();
    return (
      message.includes('network request failed') ||
      message.includes('failed to fetch') ||
      message.includes('network error')
    );
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes('network request failed') ||
      message.includes('failed to fetch') ||
      message.includes('network error') ||
      message.includes('internet')
    );
  }

  return false;
}

export function resolveErrorMessage(
  error: unknown,
  fallback = errorMessages.generic,
): string {
  if (isNetworkError(error)) {
    return errorMessages.noInternet;
  }

  if (error instanceof Error) {
    if (error.message === 'out_of_stock') {
      return errorMessages.outOfStock;
    }

    if (error.message === 'variant_required') {
      return errorMessages.selectVariant;
    }

    if (error.message === 'invalid_product' || error.message === 'missing_product_id') {
      return errorMessages.invalidProduct;
    }

    if (error.message.startsWith('API ')) {
      return fallback;
    }
  }

  return fallback;
}
