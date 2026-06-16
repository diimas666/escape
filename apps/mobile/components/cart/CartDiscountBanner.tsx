import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../../constants/theme';
import type { CartTotals } from '../../utils/cartTotals';
import { formatPrice } from '../../types/catalog';

type Props = {
  totals: CartTotals;
};

export const CartDiscountBanner = memo(function CartDiscountBanner({ totals }: Props) {
  if (!totals.hasDiscount) {
    return null;
  }

  return (
    <View style={styles.banner}>
      <View style={styles.topRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Акція −{totals.discountPercent}%</Text>
        </View>
        <Text style={styles.savings}>−{formatPrice(totals.savings)}</Text>
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.oldLabel}>Було</Text>
        <Text style={styles.oldPrice}>{formatPrice(totals.originalTotal)}</Text>
        <Text style={styles.arrow}>→</Text>
        <Text style={styles.newPrice}>{formatPrice(totals.total)}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.homeSurface,
    borderRadius: radius.sm,
    padding: 12,
    gap: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    backgroundColor: 'rgba(45, 184, 75, 0.22)',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.priceLight,
  },
  savings: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.priceLight,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  oldLabel: {
    fontSize: 13,
    color: colors.textOnDarkMuted,
  },
  oldPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textOnDarkMuted,
    textDecorationLine: 'line-through',
  },
  arrow: {
    fontSize: 14,
    color: colors.textOnDarkMuted,
  },
  newPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.priceLight,
  },
});
