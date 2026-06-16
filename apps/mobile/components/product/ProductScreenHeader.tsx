import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, spacing } from '../../constants/theme';

type Props = {
  onBack: () => void;
  onCartPress: () => void;
  cartCount?: number;
};

export function ProductScreenHeader({ onBack, onCartPress, cartCount = 0 }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Назад"
        onPress={onBack}
        style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
        <Ionicons name="arrow-back" size={22} color={colors.textOnDark} />
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Кошик"
        onPress={onCartPress}
        style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
        <Ionicons name="bag-outline" size={22} color={colors.textOnDark} />
        {cartCount > 0 ? <View style={styles.cartBadge} /> : null}
      </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.screen,
    paddingBottom: 12,
    backgroundColor: colors.homeBackground,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.homeSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
});
