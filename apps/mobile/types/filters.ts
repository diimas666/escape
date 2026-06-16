export type ProductSort = 'newest' | 'oldest' | 'price_asc' | 'price_desc';

export type PriceBounds = {
  min: number;
  max: number;
};

export type CategoryProductFilters = {
  sort: ProductSort;
  brands: string[];
  subcategories: string[];
  variants: string[];
  priceMin: number | null;
  priceMax: number | null;
};

export const defaultCategoryFilters: CategoryProductFilters = {
  sort: 'newest',
  brands: [],
  subcategories: [],
  variants: [],
  priceMin: null,
  priceMax: null,
};

export const sortLabels: Record<ProductSort, string> = {
  newest: 'Спочатку нові',
  oldest: 'Спочатку старі',
  price_asc: 'Ціна ↑',
  price_desc: 'Ціна ↓',
};
