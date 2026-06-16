import type { NavigatorScreenParams } from '@react-navigation/native';
import type { HomeCategory, HomeProduct } from '../types/catalog';

export type CategoriesStackParamList = {
  CategoriesList: undefined;
  Category: { category: HomeCategory };
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList>;
  Product: { product: HomeProduct };
  Checkout: undefined;
};

export type TabParamList = {
  Home: undefined;
  Categories: NavigatorScreenParams<CategoriesStackParamList> | undefined;
  Cart:
    | {
        returnTo?: {
          name: 'Product';
          params: { product: HomeProduct };
        };
      }
    | undefined;
  Favorites: undefined;
  Profile: undefined;
};
