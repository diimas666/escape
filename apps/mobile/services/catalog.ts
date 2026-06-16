import { api } from '../config/api';
import { CACHE_TTL, cachedFetch, setCached } from './apiCache';
import {
  extractCategories,
  mapProduct,
  type ApiCategory,
  type ApiProduct,
  type HomeCategory,
  type HomeProduct,
  type ProductDetail,
  type SearchProduct,
} from '../types/catalog';
import { stripHtml } from '../utils/stripHtml';
import { normalizeInStock } from '../utils/stock';

const PRODUCTS_LIST_LIMIT = 40;

export function productMatchesCategory(
  product: ApiProduct,
  categoryId: string,
  categoryTitle?: string,
): boolean {
  if (product.categorySlug === categoryId || product.category === categoryId) {
    return true;
  }

  if (categoryTitle && product.category === categoryTitle) {
    return true;
  }

  return false;
}

function filterCategoryProducts(
  products: ApiProduct[],
  categoryId: string,
  categoryTitle?: string,
): ApiProduct[] {
  return products.filter(product =>
    productMatchesCategory(product, categoryId, categoryTitle),
  );
}

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`API ${response.status}`);
  }

  const contentType = response.headers.get('content-type') ?? '';

  if (!contentType.includes('application/json')) {
    throw new Error('API returned non-JSON response');
  }

  return response.json() as Promise<T>;
}

function normalizeCategories(
  data: ApiCategory[] | { categories: ApiCategory[] },
): HomeCategory[] {
  const items = Array.isArray(data) ? data : data.categories;

  return items
    .map(item => ({
      id: item.slug || item.categorySlug || item._id || item.id || '',
      title: item.title || item.name || item.category || '',
      image: item.image || item.images?.[0],
    }))
    .filter(item => item.id && item.title);
}

function normalizeProducts(
  data: ApiProduct[] | { products: ApiProduct[] },
): ApiProduct[] {
  return Array.isArray(data) ? data : data.products ?? [];
}

function normalizeProductImages(image?: string, images?: string[]): string[] {
  const merged = image ? [image, ...(images ?? [])] : [...(images ?? [])];
  return [...new Set(merged.filter(Boolean))];
}

function toProductDetail(product: ApiProduct): ProductDetail {
  const oldPrice =
    product.oldPrice && product.oldPrice > product.price
      ? product.oldPrice
      : undefined;

  const discountPercent =
    product.discountPercent ??
    (oldPrice
      ? Math.round((1 - product.price / oldPrice) * 100)
      : undefined);

  const images = normalizeProductImages(product.image, product.images);

  return {
    id: product._id,
    handle: product.handle,
    title: product.title,
    description: product.description ? stripHtml(product.description) : '',
    price: product.price,
    oldPrice,
    discountPercent,
    image: images[0],
    images,
    variants: product.variants ?? [],
    category: product.category,
    categorySlug: product.categorySlug,
    inStock: normalizeInStock(product.inStock),
    lowStock: product.lowStock === true,
    isNew: product.isNew === true,
    isTrending: product.isTrending === true,
    isFeatured: product.isFeatured === true,
    brand: product.brand,
  };
}

async function loadProducts(query: string): Promise<ApiProduct[]> {
  const response = await api.products(query);
  return normalizeProducts(await parseJson(response));
}

async function loadProductByHandle(handle: string): Promise<ProductDetail> {
  const response = await api.productByHandle(handle);
  const product = await parseJson<ApiProduct>(response);
  return toProductDetail(product);
}

async function loadProductsByCategory(
  categoryId: string,
  categoryTitle?: string,
): Promise<ApiProduct[]> {
  const queryVariants = [
    `category=${encodeURIComponent(categoryId)}`,
    ...(categoryTitle && categoryTitle !== categoryId
      ? [`category=${encodeURIComponent(categoryTitle)}`]
      : []),
  ];

  for (const query of queryVariants) {
    try {
      const products = await loadProducts(query);
      const filtered = filterCategoryProducts(products, categoryId, categoryTitle);

      if (filtered.length === 0) {
        continue;
      }

      return filtered;
    } catch {
      // пробуємо наступний варіант запиту
    }
  }

  return [];
}

export async function fetchProducts(limit = PRODUCTS_LIST_LIMIT): Promise<ApiProduct[]> {
  return cachedFetch(`products:list:${limit}`, CACHE_TTL.medium, () =>
    loadProducts(`limit=${limit}`),
  );
}

export async function fetchProductByHandle(
  handle: string,
  options?: { force?: boolean },
): Promise<ProductDetail> {
  const cacheKey = `product:${handle}`;

  if (options?.force) {
    const product = await loadProductByHandle(handle);
    setCached(cacheKey, product, CACHE_TTL.medium);
    return product;
  }

  return cachedFetch(cacheKey, CACHE_TTL.medium, () => loadProductByHandle(handle));
}

export async function fetchRelatedProducts(
  categorySlug: string,
  excludeHandle: string,
  limit = 12,
): Promise<HomeProduct[]> {
  const products = await fetchProductsByCategory(categorySlug);
  return products
    .filter(product => product.handle !== excludeHandle)
    .slice(0, limit)
    .map(mapProduct);
}

export async function fetchProductsByCategory(
  categoryId: string,
  categoryTitle?: string,
): Promise<ApiProduct[]> {
  return cachedFetch(
    `category:v2:${categoryId}`,
    CACHE_TTL.medium,
    () => loadProductsByCategory(categoryId, categoryTitle),
  );
}

/** Спроба /api/categories, інакше — з товарів */
export async function fetchCategories(
  products?: ApiProduct[],
  limit?: number,
): Promise<HomeCategory[]> {
  const cacheKey = `categories:${limit ?? 'all'}`;

  if (!products) {
    const cached = await cachedFetch(cacheKey, CACHE_TTL.long, async () => {
      try {
        const response = await api.categories();
        const data = await parseJson<ApiCategory[] | { categories: ApiCategory[] }>(
          response,
        );
        const categories = normalizeCategories(data);

        if (categories.length > 0) {
          return limit != null ? categories.slice(0, limit) : categories;
        }
      } catch {
        // endpoint ще не існує на бекенді
      }

      const source = await fetchProducts(PRODUCTS_LIST_LIMIT);
      return extractCategories(source, limit);
    });

    return cached;
  }

  return extractCategories(products, limit);
}

export async function fetchTrendingProducts(limit = 6): Promise<ApiProduct[]> {
  return cachedFetch(`products:trending:${limit}`, CACHE_TTL.medium, async () => {
    try {
      const products = await loadProducts(`featured=true&limit=${limit}`);

      if (products.length > 0) {
        return products.slice(0, limit);
      }
    } catch {
      // featured endpoint може бути недоступний
    }

    const products = await loadProducts(`limit=${limit}`);
    return products.slice(0, limit);
  });
}

export async function searchProductsByQuery(
  query: string,
  limit = 5,
): Promise<SearchProduct[]> {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [];
  }

  const products = await fetchProducts(PRODUCTS_LIST_LIMIT);

  return products
    .filter(product => product.title.toLowerCase().includes(normalized))
    .slice(0, limit)
    .map(product => ({
      id: product._id,
      handle: product.handle,
      title: product.title,
      price: product.price,
      image: product.image || product.images?.[0],
      description: product.description ? stripHtml(product.description) : '',
    }));
}

export async function fetchHomeCatalog() {
  return cachedFetch('home:catalog', CACHE_TTL.medium, async () => {
    const [products, trending] = await Promise.all([
      fetchProducts(PRODUCTS_LIST_LIMIT),
      fetchTrendingProducts(6),
    ]);

    const categories = await fetchCategories(products, 8);
    const trendingIds = new Set(trending.map(item => item._id));
    const popular = products.filter(item => !trendingIds.has(item._id)).slice(0, 12);

    return { categories, trending, popular };
  });
}
