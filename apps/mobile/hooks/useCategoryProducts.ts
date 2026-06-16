import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { fetchProductsByCategory } from '../services/catalog';
import { getCached } from '../services/apiCache';
import { reportLoadError } from '../utils/reportLoadError';
import { errorMessages } from '../utils/errors';
import {
  defaultCategoryFilters,
  type CategoryProductFilters,
} from '../types/filters';
import {
  applyCategoryFilters,
  extractBrands,
  extractSubcategoryOptions,
  extractVariantOptions,
  getPriceBounds,
  type FilterOption,
} from '../utils/categoryFilters';
import type { ApiProduct } from '../types/catalog';
import type { PriceBounds } from '../types/filters';

const PAGE_SIZE = 20;

type CategoryProductsData = {
  products: ApiProduct[];
  filteredProducts: ApiProduct[];
  displayedProducts: ApiProduct[];
  totalCount: number;
  brands: string[];
  subcategoryOptions: FilterOption[];
  variantOptions: string[];
  priceBounds: PriceBounds;
  filters: CategoryProductFilters;
  setFilters: Dispatch<SetStateAction<CategoryProductFilters>>;
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  loadMore: () => void;
  error: string | null;
};

export function useCategoryProducts(
  categoryId: string,
  categoryTitle?: string,
): CategoryProductsData {
  const cacheKey = `category:v2:${categoryId}`;
  const cachedProducts = getCached<ApiProduct[]>(cacheKey);

  const [products, setProducts] = useState<ApiProduct[]>(cachedProducts ?? []);
  const [filters, setFilters] = useState(defaultCategoryFilters);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(!cachedProducts);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const cached = getCached<ApiProduct[]>(cacheKey);

    if (cached) {
      setProducts(cached);
      setFilters(defaultCategoryFilters);
      setVisibleCount(PAGE_SIZE);
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }

    async function load() {
      try {
        const data = await fetchProductsByCategory(categoryId, categoryTitle);

        if (cancelled) {
          return;
        }

        setProducts(data);
        setFilters(defaultCategoryFilters);
        setVisibleCount(PAGE_SIZE);
        setError(null);
      } catch (loadError) {
        if (!cancelled) {
          setError(reportLoadError(loadError, errorMessages.loadCategoryProducts));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [cacheKey, categoryId, categoryTitle]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filters]);

  const brands = useMemo(() => extractBrands(products), [products]);
  const subcategoryOptions = useMemo(
    () => extractSubcategoryOptions(products),
    [products],
  );
  const variantOptions = useMemo(
    () => extractVariantOptions(products),
    [products],
  );
  const priceBounds = useMemo(() => getPriceBounds(products), [products]);
  const filteredProducts = useMemo(
    () => applyCategoryFilters(products, filters),
    [products, filters],
  );
  const displayedProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount],
  );
  const hasMore = visibleCount < filteredProducts.length;

  const loadMore = useCallback(() => {
    if (!hasMore || isLoading || isLoadingMore) {
      return;
    }

    setIsLoadingMore(true);

    requestAnimationFrame(() => {
      setVisibleCount(current =>
        Math.min(current + PAGE_SIZE, filteredProducts.length),
      );
      setIsLoadingMore(false);
    });
  }, [filteredProducts.length, hasMore, isLoading, isLoadingMore]);

  return {
    products,
    filteredProducts,
    displayedProducts,
    totalCount: filteredProducts.length,
    brands,
    subcategoryOptions,
    variantOptions,
    priceBounds,
    filters,
    setFilters,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    error,
  };
};
