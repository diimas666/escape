import { useEffect, useState } from 'react';
import { fetchCategories } from '../services/catalog';
import { getCached } from '../services/apiCache';
import { reportLoadError } from '../utils/reportLoadError';
import { errorMessages } from '../utils/errors';

type CategoriesData = {
  categories: HomeCategory[];
  isLoading: boolean;
  error: string | null;
};

export function useCategories(): CategoriesData {
  const cached = getCached<HomeCategory[]>('categories:all');
  const [categories, setCategories] = useState<HomeCategory[]>(cached ?? []);
  const [isLoading, setIsLoading] = useState(!cached);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchCategories();

        if (cancelled) {
          return;
        }

        setCategories(data);
        setError(null);
      } catch (loadError) {
        if (!cancelled) {
          setError(reportLoadError(loadError, errorMessages.loadCategories));
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

  return { categories, isLoading, error };
}
