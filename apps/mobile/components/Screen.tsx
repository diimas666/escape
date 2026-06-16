import type { ReactNode } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/theme';

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
};

/** Базовая оболочка экрана: safe area сверху + фон. Паддинги — внутри экрана (ScrollView). */
export function Screen({
  children,
  style,
  backgroundColor = colors.screen,
}: Props) {
  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.screen, { backgroundColor }, style]}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
