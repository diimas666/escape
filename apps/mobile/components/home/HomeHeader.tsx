import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/theme';

type Props = {
  onCartPress?: () => void;
};

export function HomeHeader({ onCartPress }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.textBlock}>
        <Text style={styles.greeting}>Привіт! 👋</Text>
        <Text style={styles.subtitle}>Знайди свої аксесуари</Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Кошик"
        onPress={onCartPress}
        style={styles.cartButton}>
        <Ionicons name="bag-outline" size={22} color={colors.textOnDark} />
        <View style={styles.badge} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  textBlock: {
    flex: 1,
    paddingRight: 12,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textOnDark,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textOnDarkMuted,
  },
  cartButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.homeSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
  },
});
