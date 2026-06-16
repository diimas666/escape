import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius } from '../constants/theme';
import type { ToastPayload } from '../context/ToastContext';

type Props = {
  toast: ToastPayload | null;
};

const iconByType = {
  error: 'alert-circle',
  info: 'information-circle',
  success: 'checkmark-circle',
} as const;

const accentByType = {
  error: colors.danger,
  info: colors.priceLight,
  success: colors.primary,
} as const;

export function Toast({ toast }: Props) {
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    if (!toast) {
      return;
    }

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, toast, translateY]);

  if (!toast) {
    return null;
  }

  return (
    <View pointerEvents="none" style={[styles.host, { bottom: insets.bottom + 16 }]}>
      <Animated.View
        style={[
          styles.toast,
          {
            borderLeftColor: accentByType[toast.type],
            opacity,
            transform: [{ translateY }],
          },
        ]}>
        <Ionicons
          name={iconByType[toast.type]}
          size={20}
          color={accentByType[toast.type]}
          style={styles.icon}
        />
        <Text style={styles.message}>{toast.message}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
    elevation: 12,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#102A20',
    borderRadius: radius.md,
    borderLeftWidth: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  icon: {
    marginTop: 1,
    marginRight: 10,
  },
  message: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: colors.textOnDark,
  },
});
