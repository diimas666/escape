import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, radius } from '../../constants/theme';

const ADDED_FEEDBACK_MS = 1500;

type Props = {
  inStock: boolean;
  inCart: boolean;
  onAdd: () => Promise<void>;
  onRemove: () => Promise<void>;
  style?: object;
};

export function AddToCartButton({
  inStock,
  inCart,
  onAdd,
  onRemove,
  style,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!inCart) {
      setJustAdded(false);
    }
  }, [inCart]);

  const handlePress = async () => {
    if (!inStock || isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      if (inCart) {
        await onRemove();
        return;
      }

      await onAdd();
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), ADDED_FEEDBACK_MS);
    } catch {
      setJustAdded(false);
    } finally {
      setIsLoading(false);
    }
  };

  const showAdded = justAdded && inCart;
  const isDisabled = !inStock || isLoading;

  return (
    <Pressable
      disabled={isDisabled}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.button,
        style,
        !inStock && styles.buttonDisabled,
        inCart && !showAdded && styles.buttonInCart,
        pressed && !isDisabled && styles.pressed,
      ]}>
      {isLoading ? (
        <ActivityIndicator color={colors.textOnDark} size="small" />
      ) : showAdded ? (
        <View style={styles.content}>
          <Ionicons name="checkmark-circle" size={20} color={colors.textOnDark} />
          <Text style={styles.text}>Додано в кошик</Text>
        </View>
      ) : inCart ? (
        <View style={styles.content}>
          <Ionicons name="trash-outline" size={18} color={colors.textOnDark} />
          <Text style={styles.text}>Видалити з кошика</Text>
        </View>
      ) : (
        <Text style={styles.text}>
          {inStock ? 'Додати в кошик' : 'Немає в наявності'}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1.4,
    minHeight: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonInCart: {
    backgroundColor: colors.primaryDark,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textOnDark,
  },
});
