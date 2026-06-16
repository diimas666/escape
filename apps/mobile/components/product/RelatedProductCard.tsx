import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ProductImage } from '../ProductImage';
import { colors, radius } from '../../constants/theme';
import { formatPrice, type HomeProduct } from '../../types/catalog';

const DEFAULT_CARD_WIDTH = 156;

type Props = {
  product: HomeProduct;
  width?: number;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  onFavoritePress?: (product: HomeProduct) => void;
  onAddToCartPress?: (product: HomeProduct) => void;
  isFavorite?: boolean;
  isInCart?: boolean;
};

export function RelatedProductCard({
  product,
  width = DEFAULT_CARD_WIDTH,
  style,
  onPress,
  onFavoritePress,
  onAddToCartPress,
  isFavorite = false,
  isInCart = false,
}: Props) {
  const imageSize = Math.round(width * 0.85);
  return (
    <View style={[styles.card, { width }, style]}>
      <View style={styles.imageWrap}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={product.title}
          onPress={onPress}
          style={({ pressed }) => [styles.imagePressable, pressed && styles.imagePressed]}>
          <ProductImage
            uri={product.image}
            label={product.title}
            size={imageSize}
            rounded={radius.md}
            resizeMode="contain"
            backgroundColor={colors.card}
          />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? 'Видалити з обраного' : 'Додати в обране'}
          onPress={() => onFavoritePress?.(product)}
          style={({ pressed }) => [styles.favoriteButton, pressed && styles.favoriteButtonPressed]}
          hitSlop={8}>
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={16}
            color={isFavorite ? colors.danger : colors.textMuted}
          />
        </Pressable>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={product.title}
        onPress={onPress}
        style={({ pressed }) => [pressed && styles.titlePressed]}>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
      </Pressable>

      <View style={styles.footer}>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isInCart ? 'Товар у кошику' : 'Додати в кошик'}
          onPress={() => onAddToCartPress?.(product)}
          style={({ pressed }) => [styles.cartButton, pressed && styles.cartButtonPressed]}
          hitSlop={8}>
          <Ionicons
            name={isInCart ? 'checkmark' : 'cart-outline'}
            size={16}
            color={colors.textOnDark}
          />
        </Pressable>
      </View>
    </View>
  );
}

export const relatedProductCardWidth = DEFAULT_CARD_WIDTH;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.homeSearch,
    borderRadius: radius.lg,
    padding: 10,
  },
  imageWrap: {
    position: 'relative',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  imagePressable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePressed: {
    opacity: 0.92,
  },
  favoriteButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  favoriteButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.95 }],
  },
  titlePressed: {
    opacity: 0.85,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textOnDark,
    lineHeight: 18,
    minHeight: 36,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.priceLight,
    flex: 1,
  },
  cartButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cartButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.95 }],
  },
});
