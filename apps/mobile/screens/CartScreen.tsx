import type { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FlashList } from '@shopify/flash-list';
import { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CartDiscountBanner } from '../components/cart/CartDiscountBanner';
import { CartListItem } from '../components/cart/CartListItem';
import { BackButton } from '../components/navigation/BackButton';
import { Screen } from '../components/Screen';
import { useCart } from '../context/CartContext';
import { colors, radius, spacing } from '../constants/theme';
import type { RootStackParamList, TabParamList } from '../navigation/types';
import type { CartItem } from '../types/cart';
import { formatPrice } from '../types/catalog';
import { getCartTotals } from '../utils/cartTotals';

type CartNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Cart'>,
  NativeStackNavigationProp<RootStackParamList>
>;

type CartRouteProp = RouteProp<TabParamList, 'Cart'>;

export function CartScreen() {
  const navigation = useNavigation<CartNavigationProp>();
  const route = useRoute<CartRouteProp>();
  const { items, totalQuantity, increment, decrement, removeFromCart } = useCart();
  const cartTotals = useMemo(() => getCartTotals(items), [items]);
  const { total } = cartTotals;

  const handleBack = useCallback(() => {
    const rootNavigation = navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
    const returnTo = route.params?.returnTo;

    if (returnTo && rootNavigation) {
      navigation.setParams({ returnTo: undefined });
      rootNavigation.navigate(returnTo.name, returnTo.params);
      return;
    }

    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    if (rootNavigation?.canGoBack()) {
      rootNavigation.goBack();
      return;
    }

    navigation.navigate('Home');
  }, [navigation, route.params?.returnTo]);

  const openCheckout = useCallback(() => {
    navigation.navigate('Checkout');
  }, [navigation]);

  const renderItem = useCallback(
    ({ item }: { item: CartItem }) => (
      <CartListItem
        item={item}
        onIncrement={() => increment(item.productId, item.variant)}
        onDecrement={() => decrement(item.productId, item.variant)}
        onRemove={() => removeFromCart(item.productId, item.variant)}
      />
    ),
    [decrement, increment, removeFromCart],
  );

  const listHeader = useCallback(
    () => (
      <>
        <View style={styles.header}>
          <BackButton onPress={handleBack} />
        </View>

        <Text style={styles.title}>Кошик</Text>
        {items.length > 0 ? (
          <Text style={styles.subtitleBold}>
            {totalQuantity}{' '}
            {totalQuantity === 1
              ? 'товар'
              : totalQuantity < 5
                ? 'товари'
                : 'товарів'}{' '}
            на суму <Text style={styles.subtitlePrice}>{formatPrice(total)}</Text>
          </Text>
        ) : (
          <Text style={styles.subtitle}>
            Додайте товари з каталогу, щоб оформити замовлення
          </Text>
        )}

        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="cart-outline" size={32} color={colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>Кошик порожній</Text>
            <Text style={styles.emptyText}>
              Оберіть аксесуари в каталозі та додайте їх у кошик.
            </Text>
          </View>
        ) : null}
      </>
    ),
    [handleBack, items.length, total, totalQuantity],
  );

  return (
    <Screen backgroundColor={colors.homeBackground}>
      <View style={styles.layout}>
        <FlashList
          data={items}
          keyExtractor={item => `${item.productId}-${item.variant ?? 'default'}`}
          renderItem={renderItem}
          extraData={items}
          ListHeaderComponent={listHeader}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        />

        {items.length > 0 ? (
          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Разом до сплати</Text>
              <Text style={styles.totalValue}>{formatPrice(total)}</Text>
            </View>

            <CartDiscountBanner totals={cartTotals} />

            <Pressable
              accessibilityRole="button"
              onPress={openCheckout}
              style={({ pressed }) => [styles.checkoutButton, pressed && styles.pressed]}>
              <Text style={styles.checkoutButtonText}>Оформити замовлення</Text>
              <Ionicons name="arrow-forward" size={18} color={colors.textOnDark} />
            </Pressable>
          </View>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.screen,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textOnDark,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textOnDarkMuted,
    marginBottom: 20,
    lineHeight: 20,
  },
  subtitleBold: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textOnDark,
    marginBottom: 20,
    lineHeight: 20,
  },
  subtitlePrice: {
    fontWeight: '700',
    color: colors.priceLight,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 16,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: radius.lg,
    backgroundColor: colors.homeSurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textOnDark,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textOnDarkMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: spacing.screen,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: colors.homeBackground,
    gap: 12,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textOnDarkMuted,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.priceLight,
  },
  checkoutButton: {
    minHeight: 52,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textOnDark,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
});
