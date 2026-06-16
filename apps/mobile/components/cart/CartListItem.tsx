import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ProductImage } from '../ProductImage';
import { colors, radius } from '../../constants/theme';
import type { CartItem } from '../../types/cart';
import { formatPrice } from '../../types/catalog';

const IMAGE_SIZE = 80;

type Props = {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
};

export const CartListItem = memo(function CartListItem({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}: Props) {
  return (
    <View style={styles.card}>
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
        <View style={styles.textBlock}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>

          {item.description ? (
            <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
              {item.description}
            </Text>
          ) : null}

          {item.variant ? <Text style={styles.variant}>{item.variant}</Text> : null}
        </View>

        <Text style={styles.price}>{formatPrice(item.price)}</Text>
      </View>

      <View style={styles.actions}>
        <View style={styles.counter}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Зменшити кількість"
            onPress={onDecrement}
            style={({ pressed }) => [styles.counterButton, pressed && styles.pressed]}>
            <Ionicons name="remove" size={18} color={colors.textOnDark} />
          </Pressable>

          <Text style={styles.quantity}>{item.quantity}</Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Збільшити кількість"
            onPress={onIncrement}
            style={({ pressed }) => [styles.counterButton, pressed && styles.pressed]}>
            <Ionicons name="add" size={18} color={colors.textOnDark} />
          </Pressable>
        </View>

        <View style={styles.actionsSpacer} />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Видалити з кошика"
          onPress={onRemove}
          style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}>
          <Ionicons name="trash-outline" size={18} color={colors.danger} />
        </Pressable>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
    backgroundColor: colors.homeSearch,
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 12,
    minHeight: IMAGE_SIZE + 24,
  },
  imageWrap: {
    backgroundColor: colors.card,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'space-between',
    minHeight: IMAGE_SIZE,
  },
  textBlock: {
    gap: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.priceLight,
    lineHeight: 24,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textOnDark,
    lineHeight: 19,
  },
  description: {
    fontSize: 12,
    color: colors.textOnDarkMuted,
    lineHeight: 17,
  },
  variant: {
    fontSize: 12,
    color: colors.textOnDarkMuted,
  },
  actions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: IMAGE_SIZE,
  },
  actionsSpacer: {
    flex: 1,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.homeSurface,
    borderRadius: radius.sm,
    padding: 4,
    gap: 4,
  },
  counterButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },
  quantity: {
    minWidth: 24,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: colors.textOnDark,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.45)',
    backgroundColor: 'rgba(239, 68, 68, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
});
