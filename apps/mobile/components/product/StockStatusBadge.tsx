import { StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../../constants/theme';

type Props = {
  inStock: boolean;
  lowStock?: boolean;
};

export function StockStatusBadge({ inStock, lowStock }: Props) {
  if (!inStock) {
    return (
      <View style={[styles.badge, styles.outOfStock]}>
        <Text style={styles.outOfStockText}>Немає в наявності</Text>
      </View>
    );
  }

  if (lowStock) {
    return (
      <View style={[styles.badge, styles.lowStock]}>
        <Text style={styles.lowStockText}>Мало в наявності</Text>
      </View>
    );
  }

  return (
    <View style={[styles.badge, styles.inStock]}>
      <Text style={styles.inStockText}>В наявності</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexShrink: 0,
  },
  inStock: {
    backgroundColor: colors.homeSearch,
  },
  inStockText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.priceLight,
  },
  lowStock: {
    backgroundColor: '#FEF3C7',
  },
  lowStockText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B45309',
  },
  outOfStock: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  outOfStockText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textOnDarkMuted,
  },
});
