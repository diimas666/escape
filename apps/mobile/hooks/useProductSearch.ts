import { useEffect, useState } from 'react';
import { searchProductsByQuery } from '../services/catalog';
import type { SearchProduct } from '../types/catalog';

const DEBOUNCE_MS = 300;

export function useProductSearch(query: string) {
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        const items = await searchProductsByQuery(trimmed);
        if (!cancelled) {
          setResults(items);
        }
      } catch {
        if (!cancelled) {
          setResults([]);
        }
      } finally {
        if (!cancelled) {
          setIsSearching(false);
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  return { results, isSearching };
}
