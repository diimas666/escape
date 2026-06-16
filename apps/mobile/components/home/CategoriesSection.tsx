import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ProductImage } from '../ProductImage';
import { colors, radius } from '../../constants/theme';
import type { HomeCategory } from '../../types/catalog';

type Props = {
  items: HomeCategory[];
  onSeeAll?: () => void;
  onCategoryPress?: (category: HomeCategory) => void;
};

export function CategoriesSection({
  items,
  onSeeAll,
  onCategoryPress,
}: Props) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>Категорії</Text>
        <Pressable onPress={onSeeAll}>
          <Text style={styles.link}>Дивитись всі</Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}>
        {items.map(category => (
          <Pressable
            key={category.id}
            style={styles.card}
            onPress={() => onCategoryPress?.(category)}>
            <View style={styles.imageBox}>
              <ProductImage
                uri={category.image}
                label={category.title}
                size={56}
                rounded={radius.md}
              />
            </View>
            <Text style={styles.label} numberOfLines={2}>
              {category.title}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 28,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textOnDark,
  },
  link: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textOnDarkMuted,
  },
  list: {
    gap: 12,
    paddingRight: 4,
  },
  card: {
    width: 88,
    alignItems: 'center',
  },
  imageBox: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textOnDark,
    textAlign: 'center',
    lineHeight: 16,
  },
});
