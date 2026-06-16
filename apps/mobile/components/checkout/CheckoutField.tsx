import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { colors } from '../../constants/theme';

type Props = TextInputProps & {
  label: string;
  optional?: boolean;
  last?: boolean;
};

export function CheckoutField({ label, optional, last, style, ...inputProps }: Props) {
  return (
    <View style={[styles.wrap, last && styles.wrapLast]}>
      <Text style={styles.label}>
        {label}
        {optional ? <Text style={styles.optional}> (необов&apos;язково)</Text> : null}
      </Text>
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[styles.input, style]}
        {...inputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.screen,
    gap: 8,
  },
  wrapLast: {
    borderBottomWidth: 0,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  optional: {
    fontWeight: '400',
    color: colors.textMuted,
  },
  input: {
    fontSize: 16,
    color: colors.text,
    padding: 0,
    minHeight: 24,
  },
});
