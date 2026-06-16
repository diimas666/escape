import type { ApiProduct } from '../types/catalog';
import type { CategoryProductFilters, PriceBounds } from '../types/filters';
import { formatSubcategoryLabel } from './subcategoryLabel';

type IndexedProduct = {
  product: ApiProduct;
  index: number;
};

export type FilterOption = {
  id: string;
  label: string;
};

export function getProductBrand(product: ApiProduct): string | null {
  const brand = product.brand?.trim();
  return brand || null;
}

export function getProductSubcategorySlug(product: ApiProduct): string | null {
  return product.subcategorySlug?.trim() || null;
}

export function extractBrands(products: ApiProduct[]): string[] {
  const brands = new Set<string>();

  for (const product of products) {
    const brand = getProductBrand(product);
    if (brand) {
      brands.add(brand);
    }
  }

  return Array.from(brands).sort((a, b) => a.localeCompare(b, 'uk'));
}

export function extractSubcategoryOptions(products: ApiProduct[]): FilterOption[] {
  const slugs = new Set<string>();

  for (const product of products) {
    const slug = getProductSubcategorySlug(product);
    if (slug) {
      slugs.add(slug);
    }
  }

  return Array.from(slugs)
    .map(slug => ({
      id: slug,
      label: formatSubcategoryLabel(slug),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, 'uk'));
}

export function extractVariantOptions(products: ApiProduct[]): string[] {
  const variants = new Set<string>();

  for (const product of products) {
    for (const variant of product.variants ?? []) {
      const value = variant.trim();
      if (value) {
        variants.add(value);
      }
    }
  }

  return Array.from(variants).sort((a, b) => a.localeCompare(b, 'uk'));
}

export function getProductVariants(product: ApiProduct): string[] {
  return (product.variants ?? [])
    .map(variant => variant.trim())
    .filter(Boolean);
}

export function getPriceBounds(products: ApiProduct[]): PriceBounds {
  if (products.length === 0) {
    return { min: 0, max: 10_000 };
  }

  const prices = products.map(product => product.price);
  const min = Math.floor(Math.min(...prices));
  const max = Math.ceil(Math.max(...prices));

  return min === max ? { min, max: min + 1 } : { min, max };
}

export function isPriceFilterActive(
  filters: CategoryProductFilters,
  bounds: PriceBounds,
): boolean {
  return (
    (filters.priceMin != null && filters.priceMin > bounds.min) ||
    (filters.priceMax != null && filters.priceMax < bounds.max)
  );
}

function getSortTimestamp(product: ApiProduct, index: number): number {
  return index;
}

export function applyCategoryFilters(
  products: ApiProduct[],
  filters: CategoryProductFilters,
): ApiProduct[] {
  let items: IndexedProduct[] = products.map((product, index) => ({
    product,
    index,
  }));

  if (filters.brands.length > 0) {
    const selected = new Set(filters.brands);
    items = items.filter(({ product }) => {
      const brand = getProductBrand(product);
      return brand != null && selected.has(brand);
    });
  }

  if (filters.subcategories.length > 0) {
    const selected = new Set(filters.subcategories);
    items = items.filter(({ product }) => {
      const subcategorySlug = getProductSubcategorySlug(product);
      return subcategorySlug != null && selected.has(subcategorySlug);
    });
  }

  if (filters.variants.length > 0) {
    const selected = new Set(filters.variants);
    items = items.filter(({ product }) =>
      getProductVariants(product).some(variant => selected.has(variant)),
    );
  }

  if (filters.priceMin != null) {
    items = items.filter(({ product }) => product.price >= filters.priceMin!);
  }

  if (filters.priceMax != null) {
    items = items.filter(({ product }) => product.price <= filters.priceMax!);
  }

  items.sort((left, right) => {
    switch (filters.sort) {
      case 'oldest':
        return (
          getSortTimestamp(left.product, left.index) -
          getSortTimestamp(right.product, left.index)
        );
      case 'price_asc':
        return left.product.price - right.product.price;
      case 'price_desc':
        return right.product.price - left.product.price;
      case 'newest':
      default:
        return (
          getSortTimestamp(right.product, right.index) -
          getSortTimestamp(left.product, left.index)
        );
    }
  });

  return items.map(item => item.product);
}

export function countActiveFilters(filters: CategoryProductFilters): number {
  let count = 0;

  if (filters.brands.length > 0) {
    count += 1;
  }

  if (filters.subcategories.length > 0) {
    count += 1;
  }

  if (filters.variants.length > 0) {
    count += 1;
  }

  if (filters.priceMin != null || filters.priceMax != null) {
    count += 1;
  }

  return count;
}
