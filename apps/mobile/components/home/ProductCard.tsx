import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ProductImage } from '../ProductImage';
import { colors, radius } from '../../constants/theme';
import { formatPrice, type HomeProduct } from '../../types/catalog';

type Props = {
  product: HomeProduct;
  onFavoritePress?: (product: HomeProduct) => void;
};

export function ProductCard({ product, onFavoritePress }: Props) {
  return (
    <View style={styles.card}>
      <ProductImage uri={product.image} label={product.title} size={72} />

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Додати в обране"
        onPress={() => onFavoritePress?.(product)}
        style={styles.favoriteButton}>
        <Ionicons name="heart-outline" size={20} color={colors.textMuted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 12,
    marginBottom: 12,
    gap: 12,
  },
  info: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  price: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.price,
  },
  favoriteButton: {
    alignSelf: 'flex-start',
    padding: 4,
  },
});
