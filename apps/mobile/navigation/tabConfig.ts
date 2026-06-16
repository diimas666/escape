import type { ComponentProps } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { TabParamList } from './types';

type TabIconName = ComponentProps<typeof Ionicons>['name'];

export type TabItem = {
  name: keyof TabParamList;
  label: string;
  icons: { active: TabIconName; inactive: TabIconName };
};

export const tabItems: TabItem[] = [
  {
    name: 'Home',
    label: 'Головна',
    icons: { active: 'home', inactive: 'home-outline' },
  },
  {
    name: 'Categories',
    label: 'Категорії',
    icons: { active: 'grid', inactive: 'grid-outline' },
  },
  {
    name: 'Cart',
    label: 'Кошик',
    icons: { active: 'cart', inactive: 'cart-outline' },
  },
  {
    name: 'Favorites',
    label: 'Обране',
    icons: { active: 'heart', inactive: 'heart-outline' },
  },
  {
    name: 'Profile',
    label: 'Профіль',
    icons: { active: 'person', inactive: 'person-outline' },
  },
];
