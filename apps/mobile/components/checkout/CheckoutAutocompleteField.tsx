import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { colors } from '../../constants/theme';

export type AutocompleteSuggestion = {
  id: string;
  title: string;
  subtitle?: string;
};

type Props = Omit<TextInputProps, 'value' | 'onChangeText'> & {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  suggestions: AutocompleteSuggestion[];
  isLoading?: boolean;
  showSuggestions?: boolean;
  onSelect: (item: AutocompleteSuggestion) => void;
  helperText?: string;
  errorText?: string;
  last?: boolean;
};

export function CheckoutAutocompleteField({
  label,
  value,
  onChangeText,
  suggestions,
  isLoading = false,
  showSuggestions = false,
  onSelect,
  helperText,
  errorText,
  last,
  ...inputProps
}: Props) {
  const visibleSuggestions = showSuggestions && suggestions.length > 0;

  return (
    <View style={[styles.wrap, last && styles.wrapLast]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          {...inputProps}
        />
        {isLoading ? <ActivityIndicator size="small" color={colors.primary} /> : null}
      </View>

      {helperText ? <Text style={styles.helper}>{helperText}</Text> : null}
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}

      {visibleSuggestions ? (
        <View style={styles.suggestions}>
          {suggestions.map((item, index) => (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              onPress={() => onSelect(item)}
              style={({ pressed }) => [
                styles.suggestionRow,
                index < suggestions.length - 1 && styles.suggestionBorder,
                pressed && styles.suggestionPressed,
              ]}>
              <Text style={styles.suggestionTitle} numberOfLines={2}>
                {item.title}
              </Text>
              {item.subtitle ? (
                <Text style={styles.suggestionSubtitle} numberOfLines={1}>
                  {item.subtitle}
                </Text>
              ) : null}
            </Pressable>
          ))}
        </View>
      ) : null}
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    padding: 0,
    minHeight: 24,
  },
  helper: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  error: {
    fontSize: 12,
    color: colors.danger,
    lineHeight: 16,
  },
  suggestions: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: colors.screen,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FAFAFA',
  },
  suggestionRow: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 2,
  },
  suggestionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.screen,
  },
  suggestionPressed: {
    backgroundColor: '#F0FDF4',
  },
  suggestionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 19,
  },
  suggestionSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
