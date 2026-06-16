import { StyleSheet, Text, View } from 'react-native';
import { ProductImage } from '../ProductImage';
import { colors, radius } from '../../constants/theme';
import type { CartItem } from '../../types/cart';
import { formatPrice } from '../../types/catalog';

const IMAGE_SIZE = 64;

type Props = {
  item: CartItem;
  isLast?: boolean;
};

export function CheckoutOrderItem({ item, isLast = false }: Props) {
  const lineTotal = item.price * item.quantity;

  return (
    <View style={[styles.row, !isLast && styles.rowBorder]}>
      <View style={styles.imageWrap}>
        <ProductImage
          uri={item.image}
          label={item.title}
          size={IMAGE_SIZE}
          rounded={radius.sm}
          resizeMode="cover"
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        {item.variant ? <Text style={styles.variant}>{item.variant}</Text> : null}
        <View style={styles.footer}>
          <Text style={styles.qty}>×{item.quantity}</Text>
          <Text style={styles.price}>{formatPrice(lineTotal)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.screen,
  },
  imageWrap: {
    backgroundColor: colors.screen,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 19,
  },
  variant: {
    fontSize: 12,
    color: colors.textMuted,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  qty: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
});
