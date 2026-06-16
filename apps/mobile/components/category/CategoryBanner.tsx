import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ProductImage } from '../ProductImage';
import { colors, radius, spacing } from '../../constants/theme';
import type { HomeCategory } from '../../types/catalog';

type Props = {
  category: HomeCategory;
  onBack?: () => void;
};

const IMAGE_HEIGHT = 140;

export function CategoryBanner({ category, onBack }: Props) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <View style={styles.imageWrap}>
          {category.image ? (
            <Image
              source={{ uri: category.image }}
              style={styles.image}
              resizeMode="contain"
            />
          ) : (
            <ProductImage
              uri={category.image}
              label={category.title}
              size={120}
              rounded={radius.lg}
              resizeMode="contain"
              backgroundColor={colors.card}
            />
          )}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Назад"
            onPress={onBack}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={22} color={colors.textOnDark} />
          </Pressable>
        </View>

        <View style={styles.titleStrip}>
          <Text style={styles.title}>{category.title}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: spacing.screen,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  imageWrap: {
    width: '100%',
    height: IMAGE_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 8,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleStrip: {
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
});
