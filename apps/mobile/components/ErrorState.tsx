import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/theme';

type Props = {
  message?: string;
};

export function ErrorState({
  message = 'Не вдалося завантажити дані. Перевірте інтернет і спробуйте ще раз.',
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Помилка</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textOnDark,
  },
  message: {
    fontSize: 14,
    color: colors.textOnDarkMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
