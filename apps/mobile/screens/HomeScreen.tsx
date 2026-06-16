import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { ScrollView, StatusBar, StyleSheet } from 'react-native';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { Screen } from '../components/Screen';
import { CategoriesSection } from '../components/home/CategoriesSection';
import { HomeHeader } from '../components/home/HomeHeader';
import { HomeSearchBar } from '../components/home/HomeSearchBar';
import { PopularProductsSection } from '../components/home/PopularProductsSection';
import { TrendingSlider } from '../components/home/TrendingSlider';
import { colors, spacing } from '../constants/theme';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { showErrorToast } from '../context/ToastContext';
import { useHomeData } from '../hooks/useHomeData';
import type { RootStackParamList, TabParamList } from '../navigation/types';
import type { HomeProduct } from '../types/catalog';
import { addHomeProductToCart } from '../utils/addProductToCart';
import { errorMessages } from '../utils/errors';

type HomeNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export function HomeScreen() {
  const navigation = useNavigation<HomeNavigationProp>();
  const { categories, trending, popular, isLoading, error } = useHomeData();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToCart, items } = useCart();

  const openProduct = (product: HomeProduct) => {
    navigation.navigate('Product', { product });
  };

  const handleAddToCart = useCallback(
    async (product: HomeProduct) => {
      try {
        await addHomeProductToCart(addToCart, product);
      } catch (addError) {
        showErrorToast(addError, errorMessages.addToCartFailed);
      }
    },
    [addToCart],
  );

  const isProductInCart = useCallback(
    (productId: string) => items.some(item => item.productId === productId),
    [items],
  );

  return (
    <Screen backgroundColor={colors.homeBackground}>
      <StatusBar barStyle="light-content" />
      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}>
          <HomeHeader onCartPress={() => navigation.navigate('Cart')} />
          <HomeSearchBar onProductPress={openProduct} />
          <TrendingSlider items={trending} onProductPress={openProduct} />
          <CategoriesSection
            items={categories}
            onSeeAll={() => navigation.navigate('Categories')}
            onCategoryPress={category =>
              navigation.navigate('Categories', {
                screen: 'Category',
                params: { category },
              })
            }
          />
          <PopularProductsSection
            items={popular}
            onProductPress={openProduct}
            onFavoritePress={product => toggleFavorite(product.id)}
            onAddToCartPress={handleAddToCart}
            isFavorite={isFavorite}
            isInCart={isProductInCart}
          />
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.screen,
    paddingBottom: 24,
  },
});
