import { API_BASE_URL } from '@env';

const baseUrl = API_BASE_URL.replace(/\/$/, '');

const jsonHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

function request(path: string, init?: RequestInit) {
  return fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      ...jsonHeaders,
      ...init?.headers,
    },
  });
}

export const api = {
  categories: () => request('/api/categories'),
  products: (params: string) => request(`/api/products?${params}`),
  productByHandle: (handle: string) =>
    request(`/api/products/${encodeURIComponent(handle)}`),
  checkout: (body: unknown) =>
    request('/api/checkout', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};

export { baseUrl };
