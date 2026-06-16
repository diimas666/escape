type CacheEntry<T> = {
  data: T;
  expiresAt: number;
};

const cache = new Map<string, CacheEntry<unknown>>();
const inflight = new Map<string, Promise<unknown>>();

export const CACHE_TTL = {
  short: 2 * 60 * 1000,
  medium: 5 * 60 * 1000,
  long: 15 * 60 * 1000,
} as const;

export function getCached<T>(key: string): T | null {
  const entry = cache.get(key);

  if (!entry || entry.expiresAt <= Date.now()) {
    return null;
  }

  return entry.data as T;
}

export function setCached<T>(key: string, data: T, ttlMs: number): void {
  cache.set(key, {
    data,
    expiresAt: Date.now() + ttlMs,
  });
}

export async function cachedFetch<T>(
  key: string,
  ttlMs: number,
  fetcher: () => Promise<T>,
): Promise<T> {
  const cached = getCached<T>(key);

  if (cached != null) {
    return cached;
  }

  const pending = inflight.get(key);

  if (pending) {
    return pending as Promise<T>;
  }

  const promise = fetcher()
    .then(data => {
      setCached(key, data, ttlMs);
      inflight.delete(key);
      return data;
    })
    .catch(error => {
      inflight.delete(key);
      throw error;
    });

  inflight.set(key, promise);
  return promise as Promise<T>;
}

export function invalidateCache(keyPrefix?: string): void {
  if (!keyPrefix) {
    cache.clear();
    return;
  }

  for (const key of cache.keys()) {
    if (key.startsWith(keyPrefix)) {
      cache.delete(key);
    }
  }
}
