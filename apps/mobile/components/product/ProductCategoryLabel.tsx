import { StyleSheet, Text } from 'react-native';
import { colors } from '../../constants/theme';

type Props = {
  category?: string;
};

export function ProductCategoryLabel({ category }: Props) {
  if (!category) {
    return null;
  }

  return <Text style={styles.category}>{category}</Text>;
}

const styles = StyleSheet.create({
  category: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.priceLight,
    marginBottom: 6,
  },
});
