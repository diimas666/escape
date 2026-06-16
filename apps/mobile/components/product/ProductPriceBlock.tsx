import { StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../../constants/theme';
import { formatPrice } from '../../types/catalog';
import { StockStatusBadge } from './StockStatusBadge';

type Props = {
  price: number;
  oldPrice?: number;
  discountPercent?: number;
  inStock: boolean;
  lowStock?: boolean;
};

export function ProductPriceBlock({
  price,
  oldPrice,
  discountPercent,
  inStock,
  lowStock,
}: Props) {
  const hasDiscount = oldPrice != null && oldPrice > price;
  const percent =
    discountPercent ??
    (hasDiscount ? Math.round((1 - price / oldPrice) * 100) : undefined);

  return (
    <View style={styles.block}>
      {percent && percent > 0 ? (
        <View style={styles.discountBadge}>
          <Text style={styles.discountBadgeText}>-{percent}%</Text>
        </View>
      ) : null}

      <View style={styles.row}>
        <View style={styles.prices}>
          {hasDiscount ? (
            <Text style={styles.oldPrice}>{formatPrice(oldPrice)}</Text>
          ) : null}
          <Text style={styles.price}>{formatPrice(price)}</Text>
        </View>

        <StockStatusBadge inStock={inStock} lowStock={lowStock} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    marginBottom: 20,
  },
  discountBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.homeSurface,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10,
  },
  discountBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.priceLight,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  prices: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: 10,
    flex: 1,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.priceLight,
  },
  oldPrice: {
    fontSize: 18,
    color: colors.textOnDarkMuted,
    textDecorationLine: 'line-through',
  },
});
