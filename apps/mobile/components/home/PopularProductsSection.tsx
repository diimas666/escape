import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { RelatedProductCard } from '../product/RelatedProductCard';
import { colors } from '../../constants/theme';
import type { HomeProduct } from '../../types/catalog';

type Props = {
  items: HomeProduct[];
  onProductPress?: (product: HomeProduct) => void;
  onFavoritePress?: (product: HomeProduct) => void;
  onAddToCartPress?: (product: HomeProduct) => void;
  isFavorite?: (productId: string) => boolean;
  isInCart?: (productId: string) => boolean;
};

export function PopularProductsSection({
  items,
  onProductPress,
  onFavoritePress,
  onAddToCartPress,
  isFavorite,
  isInCart,
}: Props) {
  if (items.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Популярні товари</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}>
        {items.map(product => (
          <RelatedProductCard
            key={product.id}
            product={product}
            onPress={() => onProductPress?.(product)}
            onFavoritePress={onFavoritePress}
            onAddToCartPress={onAddToCartPress}
            isFavorite={isFavorite?.(product.id)}
            isInCart={isInCart?.(product.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textOnDark,
    marginBottom: 16,
  },
  list: {
    gap: 12,
    paddingRight: 4,
  },
});
