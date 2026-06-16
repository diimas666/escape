import { useEffect, useState } from 'react';
import {
  fetchProductByHandle,
  fetchRelatedProducts,
} from '../services/catalog';
import { getCached } from '../services/apiCache';
import { reportLoadError } from '../utils/reportLoadError';
import { errorMessages } from '../utils/errors';
import type { HomeProduct, ProductDetail } from '../types/catalog';

type ProductScreenData = {
  product: ProductDetail | null;
  related: HomeProduct[];
  isLoading: boolean;
  error: string | null;
};

export function useProductScreen(handle: string): ProductScreenData {
  const [product, setProduct] = useState<ProductDetail | null>(
    () => getCached<ProductDetail>(`product:${handle}`),
  );
  const [related, setRelated] = useState<HomeProduct[]>([]);
  const [isLoading, setIsLoading] = useState(
    () => !getCached<ProductDetail>(`product:${handle}`),
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const cached = getCached<ProductDetail>(`product:${handle}`);

    if (cached) {
      setProduct(cached);
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }

    setError(null);
    setRelated([]);

    async function load() {
      try {
        const detail = await fetchProductByHandle(handle);

        if (cancelled) {
          return;
        }

        setProduct(detail);
        setIsLoading(false);

        if (detail.categorySlug) {
          const relatedProducts = await fetchRelatedProducts(
            detail.categorySlug,
            detail.handle,
          );

          if (!cancelled) {
            setRelated(relatedProducts);
          }
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(reportLoadError(loadError, errorMessages.loadProduct));
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [handle]);

  return { product, related, isLoading, error };
}
