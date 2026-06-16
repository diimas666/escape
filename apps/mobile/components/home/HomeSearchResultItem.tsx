import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ProductImage } from '../ProductImage';
import { colors, radius } from '../../constants/theme';
import { formatPrice, type SearchProduct } from '../../types/catalog';

type Props = {
  product: SearchProduct;
  onPress?: () => void;
};

export function HomeSearchResultItem({ product, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.item, pressed && styles.pressed]}>
      <ProductImage uri={product.image} label={product.title} size={56} rounded={radius.sm} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {product.title}
        </Text>
        {product.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {product.description}
          </Text>
        ) : null}
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  pressed: {
    backgroundColor: colors.screen,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  description: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 16,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 2,
  },
});
