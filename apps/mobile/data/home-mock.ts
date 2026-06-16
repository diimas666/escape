import type { HomeCategory, HomeProduct } from '../types/catalog';

export const homeCategories: HomeCategory[] = [
  { id: 'cases', title: 'Чохли', image: undefined },
  { id: 'chargers', title: 'Зарядні пристрої', image: undefined },
  { id: 'cables', title: 'Кабелі', image: undefined },
  { id: 'headphones', title: 'Навушники', image: undefined },
];

export const homeProducts: HomeProduct[] = [
  {
    id: '1',
    handle: 'mock-1',
    title: 'Чохол Silicone Case для iPhone 15',
    price: 499,
  },
  {
    id: '2',
    handle: 'mock-2',
    title: 'Навушники AirPods Pro 2',
    price: 6199,
  },
  {
    id: '3',
    handle: 'mock-3',
    title: 'Кабель USB-C 1м',
    price: 299,
  },
];
