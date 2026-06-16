import { useEffect, useState } from 'react';
import { fetchHomeCatalog } from '../services/catalog';
import { getCached } from '../services/apiCache';
import { reportLoadError } from '../utils/reportLoadError';
import { errorMessages } from '../utils/errors';
import {
  mapProduct,
  type ApiProduct,
  type HomeCategory,
  type HomeProduct,
} from '../types/catalog';

type HomeCatalogCache = {
  categories: HomeCategory[];
  trending: ApiProduct[];
  popular: ApiProduct[];
};

type HomeData = {
  categories: HomeCategory[];
  trending: HomeProduct[];
  popular: HomeProduct[];
  isLoading: boolean;
  error: string | null;
};

function mapHomeCatalog(data: HomeCatalogCache) {
  return {
    categories: data.categories,
    trending: data.trending.map(mapProduct),
    popular: data.popular.map(mapProduct),
  };
}

export function useHomeData(): HomeData {
  const cachedCatalog = getCached<HomeCatalogCache>('home:catalog');
  const initial = cachedCatalog ? mapHomeCatalog(cachedCatalog) : null;

  const [categories, setCategories] = useState<HomeCategory[]>(
    initial?.categories ?? [],
  );
  const [trending, setTrending] = useState<HomeProduct[]>(initial?.trending ?? []);
  const [popular, setPopular] = useState<HomeProduct[]>(initial?.popular ?? []);
  const [isLoading, setIsLoading] = useState(!initial);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchHomeCatalog();

        if (cancelled) {
          return;
        }

        setCategories(data.categories);
        setTrending(data.trending.map(mapProduct));
        setPopular(data.popular.map(mapProduct));
        setError(null);
      } catch (loadError) {
        if (!cancelled) {
          setError(reportLoadError(loadError, errorMessages.loadData));
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
  }, []);

  return {
    categories,
    trending,
    popular,
    isLoading,
    error,
  };
}
