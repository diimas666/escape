import { NOVA_POSHTA_API_KEY } from '@env';

type NovaPoshtaResponse<T> = {
  data: T[];
  success: boolean;
  errors: string[];
};

export type NovaPoshtaCity = {
  Ref: string;
  DeliveryCity?: string;
  Present: string;
  MainDescription: string;
  Area: string;
};

export type NovaPoshtaWarehouse = {
  Ref: string;
  Description: string;
  ShortAddress: string;
  CityRef: string;
};

const API_URL = 'https://api.novaposhta.ua/v2.0/json/';

async function callNovaPoshta<T>(body: unknown): Promise<T[]> {
  if (!NOVA_POSHTA_API_KEY || NOVA_POSHTA_API_KEY === 'YOUR_NP_API_KEY_HERE') {
    throw new Error('NovaPoshta API key is not configured');
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      apiKey: NOVA_POSHTA_API_KEY,
      ...(body as object),
    }),
  });

  if (!response.ok) {
    throw new Error(`NovaPoshta API ${response.status}`);
  }

  const json = (await response.json()) as NovaPoshtaResponse<T>;

  if (!json.success) {
    const message = json.errors?.[0] || 'NovaPoshta API error';
    throw new Error(message);
  }

  return json.data;
}

export async function searchCities(query: string): Promise<NovaPoshtaCity[]> {
  if (!query.trim()) {
    return [];
  }

  const data = await callNovaPoshta<{
    Addresses: NovaPoshtaCity[];
  }>({
    modelName: 'AddressGeneral',
    calledMethod: 'searchSettlements',
    methodProperties: {
      CityName: query,
      Limit: 20,
    },
  });

  const first = data[0];
  return first?.Addresses ?? [];
}

export async function searchWarehouses(
  cityRef: string,
  query: string,
): Promise<NovaPoshtaWarehouse[]> {
  if (!cityRef) {
    return [];
  }

  const data = await callNovaPoshta<NovaPoshtaWarehouse>({
    modelName: 'AddressGeneral',
    calledMethod: 'getWarehouses',
    methodProperties: {
      CityRef: cityRef,
      FindByString: query || undefined,
      Limit: 20,
    },
  });

  return data;
}

